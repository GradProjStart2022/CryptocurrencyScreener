import pandas as pd
import sqlite3
import tqdm
import logging
import _upbit
import datetime
from datetime import datetime, timedelta



logger = logging.getLogger('gathering')


class Upbit_Gathering():
    def __init__(self, currency: str, interval: str):
        """

        Args:
            currency (str): 통화
                KRW
            interval
                1min, 5min, 15min, 60min, 240min, day, week, month

        """
        self.currency = currency

        if 'min' in interval:
            self.interval = interval[:-3] + 'm'
        elif 'day' == interval:
            self.interval = '1d'
        elif 'week' == interval:
            self.interval = '1w'
        elif 'month' == interval:
            self.interval = '1M'

        self.api = _upbit.Upbit_Api()
        self.con = sqlite3.connect(f"./({interval}).db")
        self.cursor = self.con.cursor()

    def get_ticker_list(self):
        """
        종목 리스트 조회

        Parameters:
            None

        Return:
            종목 리스트 데이터프레임
        """

        check = self.api.get_ticker_list()

        if check:
            ticker_df = check['data']
            '''
            KRW만 골라내서 RDS에 업로드
            market -> ticker
                KRW-BTC -> BTC
            korean_name -> NAME_KR
            english_name -> NAME_EN
            '''
            ticker_df.rename(columns={'market': 'TICKER', 'korean_name': 'NAME_KR', 'english_name': "NAME_EN"},
                             inplace=True)
            '''
            KRW 인 코인만
            '''
            for idx, name in enumerate(ticker_df['TICKER']):
                if not "KRW" in name:
                    ticker_df.drop(idx, inplace=True)

            ticker_df['TICKER'] = ticker_df['TICKER'].apply(lambda row: row[4:])

            return ticker_df

        else:
            return

    def get_candle(self, ticker: str, to) -> pd.DataFrame:
        """시세 캔들 조회

        Args:
            ticker (str): 종목 티커
            currency (str): 통화(KRW, USDT)
            interval (str): 1m, 3m, 5m, 15m, 10m, 30m, 60m, 240m, 1d, 1w, 1M
            start_date (str, optional): [description]. Defaults to ''.
            end_date (str, optional): [description]. Defaults to ''.
            limit (int, optional): [description]. Defaults to 200.

        Returns:
            [type]: [description]
        """
        try:
            upbit_currency_pair = f'{self.currency}-{ticker}'

            if len(self.interval) > 1:
                unit = self.interval[:-1]
                interval = self.interval[-1]

            '''
            candle_date_time_utc -> TIMESTAMP_UTC
            opening_price -> OPEN
            high_price -> HIGH
            low_price -> LOW
            trade_price -> CLOSE
            candle_acc_trade_volume -> VOLUME

            id는 symbols 테이블에서 매핑

            200 to를 이동시켜면서 끝까지 가져온다
                -> 마지막에 empty면 종료

            가장 위가 최근 데이터
            '''

            if interval == 'm':
                res = self.api.get_candle_min(market=upbit_currency_pair, unit=unit, to=to)
            elif interval == 'd':
                res = self.api.get_candle_day(market=upbit_currency_pair, to=to)
            elif interval == 'w':
                res = self.api.get_candle_week(market=upbit_currency_pair, to=to)
            elif interval == 'M':
                res = self.api.get_candle_month(market=upbit_currency_pair, to=to)

            if res['code'] == 0:
                return {'code': 0, 'data': None}

            if res['data'].empty:
                return {'code': 0, 'data': None}

            df = res['data'].copy()

            df.rename(columns={'candle_date_time_utc': 'date',
                               'opening_price': 'open',
                               'high_price': 'high',
                               'low_price': 'low',
                               'trade_price': 'close',
                               'candle_acc_trade_volume': 'volume'}, inplace=True)

            result = df[['date', 'open', 'high', 'low', 'close', 'volume']]

            return {'code': 1, 'data': result}

        except Exception as e:
            print(e)

    def gathering(self, end_date='', start_date=''):
        """
        UPbit KRW 코인 데이터 수집기
        DB에 저장한다.

        Parameters:
            end_date
                수집 종료 날짜
                default: '' (current day)
            start_date
                수집 시작 날짜
                default: one year before the current day

        return
        """

        def to_utctime(date):
            if date == '':
                return date

            local_time = datetime.strptime(date, "%Y-%m-%d")
            utc_time = local_time - timedelta(hours=9)

            return utc_time.strftime("%Y-%m-%d %H:%M:%S")

        def newcoin_gathering(name, end_date, start_date):
            result = self.get_candle(ticker=name, to=to_utctime(end_date))
            to = result['data'].iloc[-1]['date'].replace('T', ' ')

            while True:
                result2 = self.get_candle(ticker=name, to=to)

                if result2['code'] == False:
                    break

                else:
                    result['data'] = result['data'].append(result2['data'], ignore_index=True)

                to = result2['data'].iloc[-1]['date'].replace('T', ' ')

                # Check if the start date is reached
                if datetime.strptime(to[:10], "%Y-%m-%d") <= datetime.strptime(start_date, "%Y-%m-%d"):
                    break

            return result

        ticker_df = self.get_ticker_list()

        tq_range = tqdm.trange(len(ticker_df['TICKER']), ncols=100)

        for i in tq_range:
            name = ticker_df.iloc[i]['TICKER']
            tq_range.set_description(f"{self.interval} {name} 수집")

            try:
                # Check if the table exSSists
                table_exists_sql = f"SELECT name FROM sqlite_master WHERE type='table' AND name='KRW_{name}';"
                table_exists = self.con.execute(table_exists_sql).fetchone()

                if not table_exists:
                    # Create the table if it doesn't exist
                    create_table_sql = f"""CREATE TABLE KRW_{name} (
                        date TEXT,
                        open FLOAT,
                        high FLOAT,
                        low FLOAT,
                        close FLOAT,
                        volume FLOAT
                    );"""
                    self.con.execute(create_table_sql)
                    self.con.commit()

                local_sql = f"SELECT date, open, high, low, close, volume FROM KRW_{name} ORDER BY date DESC LIMIT 10;"
                local_db_df = pd.read_sql(local_sql, self.con, index_col=None)

                if local_db_df.empty:
                    result = newcoin_gathering(name=name, end_date=end_date, start_date=start_date)
                    result['data'] = result['data'].iloc[::-1]
                    result['data'].to_sql(f'KRW_{name}', self.con, if_exists='append', index=False)
                    continue

                last_time = local_db_df.iloc[0]['date']

                result = self.get_candle(ticker=name, to=to_utctime(end_date))
                to = result['data'].iloc[-1]['date'].replace('T', ' ')

                if len(result['data']['date'][(result['data']['date'].isin([last_time]))]) != 0:

                    if self.interval == '1w' or self.interval == '1M':
                        for idx, row in result['data'].loc[
                                        :result['data']['date'][result['data']['date'].isin([last_time])].index[
                                            0]].iloc[::-1].iterrows():
                            # 주봉은 매일 실행 시 해당 주 동안에는 동일한 date에서 가격만 변경됨
                            # 같은 날짜에 update 처리
                            if self.interval == '1w' or self.interval == '1M':
                                if row['date'] in local_db_df['date'].to_list():
                                    # Update existing row
                                    update_sql = f"""UPDATE KRW_{name}
                                                    SET open='{row['open']}', high='{row['high']}', low='{row['low']}',
                                                    close='{row['close']}', volume='{row['volume']}'
                                                    WHERE date='{local_db_df.iloc[0]['date']}';"""

                                    self.con.execute(update_sql)
                                    self.con.commit()

                                else:
                                    # Insert new row
                                    insert_sql = f"""
                                                    INSERT INTO KRW_{name}
                                                    VALUES ('{row['date']}', '{row['open']}', '{row['high']}',
                                                    '{row['low']}', '{row['close']}', '{row['volume']}');"""
                                    self.con.execute(insert_sql)
                                    self.con.commit()

                        continue

                    else:
                        (result['data'].loc[
                         :result['data']['date'][result['data']['date'].isin([last_time])].index[0] - 1].iloc[
                         ::-1]).to_sql(f'KRW_{name}', self.con, if_exists='append', index=False)
                        continue

                else:
                    while True:
                        result2 = self.get_candle(ticker=name, to=to)

                        check_date = result2['data']['date'][(result2['data']['date'].isin([last_time]))]

                        if len(check_date) == 0:
                            # New DataFrame does not have the last index from the local DB, update DB
                            result['data'] = result['data'].append(result2['data'], ignore_index=True)

                        else:
                            # Check if the last index from the local DB exists in the new DataFrame
                            last_idx = check_date.index[0]
                            result['data'] = result['data'].append(result2['data'].iloc[:last_idx], ignore_index=True)
                            break

                        to = result2['data'].iloc[-1]['date'].replace('T', ' ')

            except Exception as e:
                print(f"{self.interval} {name} Error: {str(e)}")
                continue

            result['data'] = result['data'].iloc[::-1]
            result['data'].to_sql(f'KRW_{name}', self.con, if_exists='append', index=False)


if __name__ == "__main__":
    obj = Upbit_Gathering('KRW', '30min')
    start_date = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
    obj.gathering(start_date=start_date)
