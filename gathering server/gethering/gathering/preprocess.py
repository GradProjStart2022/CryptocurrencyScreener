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

            local_sql = f'''select date, open, high, low, close, volume from {name};'''



if __name__ == "__main__":
    # interval [1min, 5min, 15min, 60min, 240min, day, week, 'month']

    obj = CoinPreProcess()

    obj.prepro_localDB(interval='month')