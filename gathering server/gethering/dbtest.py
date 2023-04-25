import sqlite3
import pandas as pd
import pymysql
import ta

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
    rows = pd.DataFrame(rows, columns=columns)
    rows['TICKER']=ticker
    rows['ID']=id
    ta.calculate_ta(rows)
    rows.columns = [col.upper() if "_" not in col else col for col in rows.columns]

    file_path = 'C:/Users/user/Desktop/csv/'
    rows.to_csv(file_path+ticker + '.csv', index=False)
    print(rows)

# MySQL 연결 종료
mysql_conn.close()

# 커넥션 닫기
conn.close()
