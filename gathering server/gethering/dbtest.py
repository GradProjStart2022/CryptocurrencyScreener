import sqlite3
import pandas as pd
import pymysql

# SQLite3 데이터베이스 연결
conn = sqlite3.connect('test(240min).db')

# 커서 생성
cursor = conn.cursor()

# 모든 테이블 이름을 가져오는 쿼리 실행
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")

# 결과 가져오기
tables = cursor.fetchall()

# 연결 종료

# 새로운 데이터프레임 생성
df = pd.DataFrame(columns=['table_name', 'id', 'ticker'])

# MySQL에 연결
mysql_conn = pymysql.connect(
    host='localhost',
    user='root',
    password='2264',
    database='upbit_kor'
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
            df = df.append({'id': id, 'table_name': table_name[0], 'ticker': ticker}, ignore_index=True)



# 데이터프레임 출력
for id, ticker, table in zip(df['id'], df['ticker'], df['table_name']):
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table}")

    # 열 이름 가져오기
    columns = [x[0] for x in cursor.description]

    # 결과 출력
    rows = cursor.fetchall()
    for row in rows:
        data= pd.DataFrame([row], columns=columns)
        data_ticker=pd.DataFrame([row], columns=columns)
        data_ticker.insert(0, 'ticker', ticker)
        data_ticker.insert(0, 'id', id)
        # MySQL에 데이터 추가
        mysql_cursor = mysql_conn.cursor()
        query = "INSERT INTO UPBIT_SPOT_KRW_240M (TIMESTAMP, OPEN, HIGH, LOW, CLOSE, VOLUME, ID) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (str(data['date'][0]), float(data['open'][0]), float(data['high'][0]), float(data['low'][0]),
                  float(data['close'][0]), str(data['volume'][0]), int(data_ticker['id'][0]))
        mysql_cursor.execute(query, values)
        mysql_conn.commit()
        print('ok')
# MySQL 연결 종료
mysql_conn.close()

# 커넥션 닫기
conn.close()
