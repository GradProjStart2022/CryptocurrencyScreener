import sqlite3
from sqlalchemy import create_engine
import pandas as pd
import datetime
from dateutil.relativedelta import relativedelta
import gc
import calendar
import tqdm
import logging

import _upbit
import utils.rds as rds

logger = logging.getLogger('preprocess')

db_data = 'mysql+pymysql://' + 'root' + ':' + 'upbit_kor' + '@' + '127.0.0.1' + ':3306/' \
          + '2264' + '?charset=utf8'
engine = create_engine(db_data)

RDS = rds.Database()


class CoinPreProcess():
    def __init__(self):
        """
        종목 리스트 조회 및 새로운 종목 RDS 업로드

        Parameters:
            None

        Return:
            종목 리스트 데이터프레임
        """
        RDS.__init__()

        rds_sql = 'select * from SYMBOLS;'
        insert_sql = '''INSERT INTO SYMBOLS(TICKER, NAME_KR, NAME_EN) VALUES (%s, %s, %s)'''

        api = _upbit.Upbit_Api()
        check = api.get_ticker_list()

        if check['code']:
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
            rds_df = pd.read_sql(rds_sql, RDS.db, index_col=None)

            '''
            RDS SYMBOL과 비교해서 sv_code_df에 있고 RDS_SYMBOLS에는 없는 종목은 업데이트 해야함
            거래소, 통화 추가해서 업데이트해야함
            '''
            upbit_lst = set(ticker_df['TICKER'])
            rds_lst = set(rds_df['TICKER'])

            compare_lst = upbit_lst - rds_lst

            for ticker in compare_lst:
                RDS.execute(insert_sql,
                            (ticker_df.loc[ticker_df[ticker_df['TICKER'] == ticker].index[0]]['TICKER'],
                             ticker_df.loc[ticker_df[ticker_df['TICKER'] == ticker].index[0]]['NAME_KR'],
                             ticker_df.loc[ticker_df[ticker_df['TICKER'] == ticker].index[0]]['NAME_EN']))

            RDS.commit()
            RDS.db.close()

        else:
            return

    def get_interval(self, start: datetime.datetime, end: datetime.datetime):
        '''
        start와 end의 시간 간격 개수를 리턴한다.

        Parameters
        ----------
        start: datetime
        end: datetime
        Returns
        -------
        None.
            간격 개수: integer

        '''
        if self.check_interval == 'min':
            return int((end - start).total_seconds() / 60 / self.interval)

        elif self.check_interval == 'day':
            return (end - start).days

        elif self.check_interval == 'week':
            return int((end - start).days / 7)

    def check_new_date(self, local_db_df_date, check_date_rds):
        """
        rds_date이후 첫번째 local_date와 rds_date가 interval 만큼 차이 나는 지 확인

        """
        # check_date = local_db_df_date[local_db_df_date.apply(lambda row: int(datetime.datetime.strftime(datetime.datetime.strptime(row, "%Y-%m-%dT%H:%M:%S"),"%Y%m%d%H%M")))>check_date_rds].index[0] # 이것만 다시 전처리 후 업로드하면 됨.index[0] # 이것만 다시 전처리 후 업로드하면 됨
        str_rds_date = datetime.datetime.strftime(datetime.datetime.strptime(str(check_date_rds), "%Y%m%d%H%M"),
                                                  "%Y-%m-%dT%H:%M:%S")
        check_date = local_db_df_date[local_db_df_date > str_rds_date].index[0]

        if self.check_interval == 'min':
            # local_date가 interval 만큼 차이 나지 않음
            if datetime.datetime.strptime(local_db_df_date.iloc[check_date - 1], "%Y-%m-%dT%H:%M:%S") \
                    == datetime.datetime.strptime(local_db_df_date.iloc[check_date],
                                                  "%Y-%m-%dT%H:%M:%S") - datetime.timedelta(minutes=self.interval):
                return check_date, False

            # local_date가 interval 만큼 차이남
            else:
                return check_date - 1, True

        elif self.check_interval == 'day':
            # local_date가 interval 만큼 차이 나지 않음
            if datetime.datetime.strptime(local_db_df_date.iloc[check_date - 1], "%Y-%m-%dT%H:%M:%S") \
                    == datetime.datetime.strptime(local_db_df_date.iloc[check_date],
                                                  "%Y-%m-%dT%H:%M:%S") - datetime.timedelta(days=self.interval):
                return check_date, False

            # local_date가 interval 만큼 차이남
            else:
                return check_date - 1, True

        elif self.check_interval == 'week':
            # local_date가 interval 만큼 차이 나지 않음
            if datetime.datetime.strptime(local_db_df_date.iloc[check_date - 1], "%Y-%m-%dT%H:%M:%S") \
                    == datetime.datetime.strptime(local_db_df_date.iloc[check_date],
                                                  "%Y-%m-%dT%H:%M:%S") - datetime.timedelta(weeks=self.interval):
                return check_date, False

            # local_date가 interval 만큼 차이남
            else:
                return check_date - 1, True

    def prepro_localDB(self, interval):
        '''
        로컬 데이터베이스 전처리
        convergence RDS 업로드

        Parameters
        ----------

        Returns
        -------
        None.

        '''

        try:
            self.con = sqlite3.connect(
                f"test({interval}).db")
            # self.con = sqlite3.connect(f"C:/Users/ksang/Dropbox/개발/coin-gathering/coin_gathering/db/upbit({interval}).db")
            self.cursor = self.con.cursor()

            if interval == 'day':
                self.interval = 1
                self.check_interval = 'day'

            elif 'min' in interval:
                self.interval = int(interval[:-3])
                self.check_interval = 'min'

            elif interval == 'week':
                self.interval = 1
                self.check_interval = 'week'

            elif interval == 'month':
                self.interval = 1
                self.check_interval = 'month'

        except Exception as e:
            print(e)

        if not self.interval in [1, 3, 5, 10, 15, 60, 240]:
            print('check your interval')
            return

        localtable_sql = '''SELECT name 
        FROM sqlite_master 
        WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'
        UNION ALL SELECT name FROM sqlite_temp_master WHERE type IN ('table', 'view') ORDER BY 1;'''

        table_name = pd.read_sql(localtable_sql, self.con, index_col=None)
        RDS.__init__()

        tq_range = tqdm.trange(len(table_name['name']), ncols=100)

        for i in tq_range:
            name = table_name.iloc[i]['name']

            tq_range.set_description(f"{interval} {name} 전처리")

            new_data = list()

            table_sql = f'''select id from upbit_kor.SYMBOLS where ticker = '{name[4:]}';'''
            id = RDS.executeOne(table_sql)

            # rds에 없는 종목
            if id == None:
                continue

            local_sql = f'''select date, open, high, low, close, volume, RSI from {name};'''

            if self.check_interval == 'min':
                rds_interval = f'{self.interval}M'
            elif self.check_interval == 'day':
                rds_interval = f'{self.interval}D'
            elif self.check_interval == 'week':
                rds_interval = f'{self.interval}W'
            elif self.check_interval == 'month':
                rds_interval = 'MONTH'

            rds_sql = f"""select * from UPBIT_SPOT_KRW_{rds_interval} where id = '{id['id']}' order by cast(TIMESTAMP as unsigned) desc LIMIT 10;"""

            local_db_df = pd.read_sql(local_sql, self.con, index_col=None)
            rds_df = pd.read_sql(rds_sql, RDS.db, index_col=None)

            '''
            rds_df의 마지막 row의 시간이 db_df의 어디에 속하는지 확인필요, local_db_df date(int(YYYYMMDDHHMM)), rds_df(timestampUTC)

            local_df 보다 rds_df가 더 최신일 수 있음 데이터를 채워 넣기 때문에
             -> local_df timestamp < rds_df timestamp 이면 continue

            그 후에 전처리 -> DB 업로드
            '''
            try:
                # 주봉은 매일 실행 시 해당 주 동안에는 동일한 date에서 가격만 변경됨
                # 같은 날짜에 update 처리
                if interval == 'week' or interval == 'month':
                    for idx, row in local_db_df.loc[local_db_df['date'][local_db_df['date'].isin([
                                                                                                     datetime.datetime.utcfromtimestamp(
                                                                                                             int(
                                                                                                                     rds_df.iloc[
                                                                                                                         0][
                                                                                                                         'TIMESTAMP'])).strftime(
                                                                                                             "%Y-%m-%dT%H:%M:%S")])].index[0]:].iterrows():
                        if row['date'] in local_db_df['date'].to_list():
                            update_sql = f"""
                                        update UPBIT_SPOT_KRW_{rds_interval}
                                        set OPEN='{row['open']}',HIGH='{row['high']}',LOW='{row['low']}',CLOSE='{row['close']}',VOLUME='{row['volume']}',RSI='{row['RSI']}'
                                        where TIMESTAMP='{rds_df.iloc[0]['TIMESTAMP']}' and ID='{id['id']}';
                                        """
                            print(local_db_df)
                            RDS.execute(update_sql)
                            RDS.commit()

                        else:
                            insert_sql = f"""
                                        insert into UPBIT_SPOT_KRW_{rds_interval}
                                        values ('{calendar.timegm(datetime.datetime.strptime(row['date'], "%Y-%m-%dT%H:%M:%S").timetuple())}','{row['open']}','{row['high']}','{row['low']}','{row['close']}','{row['volume']}','{row['RSI']}')
                                        """
                            self.cursor.execute(insert_sql)
                            self.con.commit()

                    continue

                # local_time(string) -> timestamp
                check_date_local = int(datetime.datetime.strftime(
                    datetime.datetime.strptime(local_db_df['date'].iloc[-1], "%Y-%m-%dT%H:%M:%S"), "%Y%m%d%H%M"))

                # rds_time -> int(YYYYMMDDHHMMSS)
                check_date_rds = int(
                    datetime.datetime.utcfromtimestamp(int(rds_df.iloc[0]['TIMESTAMP'])).strftime("%Y%m%d%H%M"))

                # local db가 RDS DB보다 아직 최신 데이터가 아님
                if check_date_local <= check_date_rds:
                    continue

                else:
                    # rds_db는 데이터를 채워넣었기 때문에 다를 수도 있음
                    # check_date 이후로 데이터를 가져와서 넣으면 됨
                    # check_date 이후에 데이터가 없어서 비는 경우 발생함
                    check_date, drop_check = self.check_new_date(local_db_df['date'], check_date_rds)

                    local_db_df = \
                        local_db_df.iloc[check_date:]  # 이것만 다시 전처리 후 업로드하면 됨

            except IndexError:
                drop_check = False

            # 데이터 프레임 row을 돌면서 데이터가 있는지 확인
            for idx1, row in local_db_df.iterrows():
                try:
                    curr_date = datetime.datetime.strptime(str(row['date']), "%Y-%m-%dT%H:%M:%S")
                    next_date = datetime.datetime.strptime(str(local_db_df.loc[idx1 + 1, 'date']), "%Y-%m-%dT%H:%M:%S")

                    # interval로 확인
                    if self.check_interval == 'min':
                        if next_date - curr_date == datetime.timedelta(minutes=self.interval):
                            continue

                        else:
                            '''
                            curr과 next가 같은 날인가
                            -> Y curr~next 까지 데이터 채운다.
                            '''
                            # curr과 next가 같은 날이므로 curr~next까지 데이터를 채운다.

                            for idx2 in range(self.get_interval(curr_date, next_date) - 1):
                                new_data.concat([new_data,{'date': datetime.datetime.strftime(curr_date
                                                                                    + datetime.timedelta(
                                    minutes=(idx2 * self.interval) + self.interval), "%Y-%m-%dT%H:%M:%S"),
                                                 'open': local_db_df.loc[idx1, 'open'],
                                                 'high': local_db_df.loc[idx1, 'high'],
                                                 'low': local_db_df.loc[idx1, 'low'],
                                                 'close': local_db_df.loc[idx1, 'close'],
                                                 'RSI': local_db_df.loc[idx1, 'RSI'],
                                                 'volume': 0}])


                    elif self.check_interval == 'day':
                        if next_date - curr_date == datetime.timedelta(days=self.interval):
                            continue

                        else:
                            '''
                            curr과 next가 같은 날인가
                            -> Y curr~next 까지 데이터 채운다.
                            '''
                            # curr과 next가 같은 날이므로 curr~next까지 데이터를 채운다.

                            for idx2 in range(self.get_interval(curr_date, next_date) - 1):
                                new_data.concat([new_data,{'date': datetime.datetime.strftime(curr_date
                                                                                    + datetime.timedelta(days=idx2 + 1),
                                                                                    "%Y-%m-%dT%H:%M:%S"),
                                                 'open': local_db_df.loc[idx1, 'open'],
                                                 'high': local_db_df.loc[idx1, 'high'],
                                                 'low': local_db_df.loc[idx1, 'low'],
                                                 'close': local_db_df.loc[idx1, 'close'],
                                                 'RSI': local_db_df.loc[idx1, 'RSI'],
                                                 'volume': 0}])

                    elif self.check_interval == 'week':
                        if next_date - curr_date == datetime.timedelta(weeks=self.interval):
                            continue

                        else:
                            '''
                            curr과 next가 같은 날인가
                            -> Y curr~next 까지 데이터 채운다.
                            '''
                            # curr과 next가 같은 날이므로 curr~next까지 데이터를 채운다.

                            for idx2 in range(self.get_interval(curr_date, next_date) - 1):
                                new_data.concat([new_data,{'date': datetime.datetime.strftime(curr_date
                                                                                    + datetime.timedelta(
                                    weeks=idx2 + 1), "%Y-%m-%dT%H:%M:%S"),
                                                 'open': local_db_df.loc[idx1, 'open'],
                                                 'high': local_db_df.loc[idx1, 'high'],
                                                 'low': local_db_df.loc[idx1, 'low'],
                                                 'close': local_db_df.loc[idx1, 'close'],
                                                 'RSI': local_db_df.loc[idx1, 'RSI'],
                                                 'volume': 0}])

                    elif self.check_interval == 'month':
                        # interval로 확인
                        if relativedelta(next_date, curr_date).months == 1:
                            continue

                        else:
                            '''
                            curr과 next가 같은 날인가
                            -> Y curr~next 까지 데이터 채운다.
                            '''
                            # curr과 next가 같은 날이므로 curr~next까지 데이터를 채운다.
                            delta = relativedelta(next_date, curr_date)  # 두 날짜의 차이 구하기
                            result = 12 * delta.years + delta.months
                            for idx3 in range(result - 1):
                                N_next_day = curr_date + relativedelta(months=idx3 + 1)
                                new_data.concat([new_data,{'date': N_next_day.strftime("%Y-%m-%dT%H:%M:%S"),
                                                 'open': local_db_df.loc[idx1, 'open'],
                                                 'high': local_db_df.loc[idx1, 'high'],
                                                 'low': local_db_df.loc[idx1, 'low'],
                                                 'close': local_db_df.loc[idx1, 'close'],
                                                 'RSI': local_db_df.loc[idx1, 'RSI'],
                                                 'volume': 0}])
                            print(new_data)


                except KeyError:
                    pass

                except Exception as e:
                    logging.exception(e)

            local_db_df = local_db_df.append(new_data, ignore_index=True)
            local_db_df.sort_values(by='date', inplace=True)

            if drop_check:
                local_db_df = local_db_df.iloc[1:, :]

            local_db_df['date'] = local_db_df['date'].apply(
                lambda row: calendar.timegm(datetime.datetime.strptime(str(row), "%Y-%m-%dT%H:%M:%S").timetuple()))

            local_db_df['id'] = id['id']
            local_db_df.rename(columns={'date': 'timestamp'}, inplace=True)

            # local_db_df.to_sql(f'UPBIT_SPOT_KRW_{rds_interval}',engine, if_exists='append', index=False)

            del local_db_df
            gc.collect()

        RDS.db.close()
        return


if __name__ == "__main__":
    # interval [1min, 5min, 15min, 60min, 240min, day, week, 'month']

    obj = CoinPreProcess()

    obj.prepro_localDB(interval='month')