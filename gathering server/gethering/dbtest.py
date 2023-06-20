import sqlite3

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
db_data = 'mysql+pymysql://' + 'screener' + ':' + 'screener' + '@' + '127.0.0.1' + ':3306/' \
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





engine = create_engine('mysql+pymysql://screener:screener@localhost/screener', echo=False)

metadata = MetaData()

# SQLite3 데이터베이스 연결
con = sqlite3.connect('test(30min).db')

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
    host='localhost',
    user='screener',
    password='screener',
    database='screener'
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


 # 각 데이터프레임을 MySQL에 추가
for symbol_id, ticker, table in zip(df['symbol_id'], df['ticker'], df['table_name']):
    cursor = con.cursor()
    cursor.execute(f"SELECT * FROM {table}")

    # 열 이름 가져오기
    columns = [x[0] for x in cursor.description]

    # 결과 출력
    rows = cursor.fetchall()
    rows = pd.DataFrame(rows, columns=columns)
    rows['TICKER'] = ticker
    rows['symbol_id'] = symbol_id
    rows = rows.rename(columns={'DATE': 'TIMESTAMP'})

    ta.calculate_ta(rows)
    rows.columns = [col.upper() if "_" not in col else col for col in rows.columns]
    rows.replace([np.inf, -np.inf], np.nan, inplace=True)
    try:
        rows.to_sql('upbit_spot_krw_30m', con=engine, if_exists='append', index=False, chunksize=10000)
        print(f"{table} to_sql success")
    except Exception as e:
        print(f"{table} to_sql failed: {str(e)}")



# MySQL 연결 종료
mysql_conn.close()

# 커넥션 닫기
con.close()
