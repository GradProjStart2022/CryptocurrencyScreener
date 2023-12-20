import sqlite3
import time
import numpy as np
import pandas as pd
import pymysql
import ta
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float, MetaData, Date
from sqlalchemy import Table, Column, Integer, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
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

class PreProcessing():
    def __init__(self):
        db_data = 'mysql+pymysql://' + 'screener' + ':' + 'screener' + '@' + 'svc.sel3.cloudtype.app' + ':31213/' \
          + 'screener' + '?charset=utf8'
        engine = create_engine(db_data)

        RDS = rds.Database()
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

    def prepro_localDB(self, interval):

        engine = create_engine('mysql+pymysql://screener:screener@svc.sel3.cloudtype.app:31213/screener', echo=False)

        metadata = MetaData()

        # SQLite3 데이터베이스 연결
        db_name = f'({interval}).db'
        con = sqlite3.connect(db_name)
        # 커서 생성
        cursor = con.cursor()

        # 모든 테이블 이름을 가져오는 쿼리 실행
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")

        # 결과 가져오기
        tables = cursor.fetchall()

        # 새로운 데이터프레임 생성
        df = pd.DataFrame(columns=['table_name', 'symbol_id', 'ticker'])

        # MySQL에 연결
        mysql_conn = pymysql.connect(
            host='svc.sel3.cloudtype.app',
            user='screener',
            password='screener',
            database='screener',
            port=31213
        )


        # 각 테이블 이름 출력 및 MySQL에서 SYMBOLS 테이블의 id 가져오기
        for table_name in tables:
            # 공통된 문자열 제외
            if 'KRW_' in table_name[0]:
                table_name_short = table_name[0][4:]

                # MySQL에서 SYMBOLS 테이블의 id 가져오기
                query = "SELECT ID, TICKER FROM SYMBOLS WHERE TICKER = %s"
                mysql_cursor = mysql_conn.cursor()
                mysql_cursor.execute(query, (table_name_short,))
                result = mysql_cursor.fetchone()
                if result:
                    id, ticker = result

                    # 데이터프레임에 추가
                    df = df.append({'symbol_id': id, 'table_name': table_name[0], 'ticker': ticker}, ignore_index=True)

        # 각 테이블 이름 출력 및 MySQL에서 SYMBOLS 테이블의 id 가져오기
        for table_name in tables:
            # 공통된 문자열 제외
            if 'KRW_' in table_name[0]:
                table_name_short = table_name[0][4:]

                # MySQL에서 SYMBOLS 테이블의 id 가져오기
                query = "SELECT ID, TICKER FROM SYMBOLS WHERE TICKER = %s"
                mysql_cursor = mysql_conn.cursor()
                mysql_cursor.execute(query, (table_name_short,))
                result = mysql_cursor.fetchone()
                if result:
                    id, ticker = result

                    # 데이터프레임에 추가
                    df = df.append({'symbol_id': id, 'table_name': table_name[0], 'ticker': ticker}, ignore_index=True)

        for symbol_id, ticker, table in zip(df['symbol_id'], df['ticker'], df['table_name']):
            print(ticker)
            engine = create_engine('mysql+pymysql://screener:screener@svc.sel3.cloudtype.app:31213/screener', echo=False)

            coin_name = ticker
            query = f"""
            SELECT *
            FROM upbit_spot_krw_{interval}
            WHERE TICKER = '{coin_name}'
            ORDER BY DATE DESC
            LIMIT 1;
            """
            result = engine.execute(query).fetchone()
            print(result)
            if result is not None:

                print("존재")

                last_date = result['DATE']
                start_date = last_date - datetime.timedelta(days=50)
                str(start_date)
                cursor = con.cursor()

                cursor.execute(f"SELECT * FROM {table} WHERE DATE > '{start_date}'")
                # 열 이름 가져오기
                columns = [x[0] for x in cursor.description]

                # 결과 출력
                rows = cursor.fetchall()
                rows = pd.DataFrame(rows, columns=columns)
                rows['TICKER'] = ticker
                rows['symbol_id'] = symbol_id
                rows = rows.rename(columns={'DATE': 'DATE'})


                ta.calculate_ta(rows)

                print("계산완료")

                rows.columns = [col.upper() if "_" not in col else col for col in rows.columns]
                rows.replace([np.inf, -np.inf], np.nan, inplace=True)
                rows['DATE'] = pd.to_datetime(rows['DATE'])
                filtered_rows = rows[rows['DATE'] > pd.to_datetime(last_date)]
                filtered_rows.columns = [col.upper() if "_" not in col else col for col in rows.columns]
                filtered_rows.replace([np.inf, -np.inf], np.nan, inplace=True)
                filtered_rows = filtered_rows.fillna(0)
                print(filtered_rows)

                try:
                    mysql_cursor = mysql_conn.cursor()
                    columns = ', '.join(filtered_rows.columns)
                    placeholders = ', '.join(['%s'] * len(filtered_rows.columns))
                    insert_query = f"INSERT INTO upbit_spot_krw_{interval} ({columns}) VALUES ({placeholders})"
                    data = [tuple(row) for row in filtered_rows.values]
                    mysql_cursor.executemany(insert_query, data)
                    mysql_conn.commit()
                    print(f"{table} to_sql success")
                    mysql_cursor.close()


                except Exception as e:
                    print(f"{table} to_sql failed: {str(e)}")

            else:
                print("존재x")

                cursor = con.cursor()
                cursor.execute(f"SELECT * FROM {table}")

                # 열 이름 가져오기
                columns = [x[0] for x in cursor.description]

                # 결과 출력
                rows = cursor.fetchall()
                rows = pd.DataFrame(rows, columns=columns)
                rows['TICKER'] = ticker
                rows['symbol_id'] = symbol_id

                ta.calculate_ta(rows)
                print("계산완료")
                rows.columns = [col.upper() if "_" not in col else col for col in rows.columns]
                rows.replace([np.inf, -np.inf], np.nan, inplace=True)

                try:
                    rows.to_sql(f'upbit_spot_krw_{interval}', con=engine, if_exists='append', index=False, chunksize=10000)
                    print(f"{table} to_sql success")


                except Exception as e:
                    print(f"{table} to_sql failed: {str(e)}")

        # MySQL 연결 종료
        mysql_conn.close()

        # 커넥션 닫기
        con.close()preprocessing.py
if __name__ == "__main__":
    # interval [1min, 5min, 15min, 60min, 240min, day, week, 'month']

    obj = PreProcessing()

    obj.prepro_localDB(interval='60min')


