import pymysql


class Database():
    def __init__(self):
        self.db = pymysql.connect(host='127.0.0.1', # assign your rds address
                                user='screener', # assign your id
                                password='screener', # assign your password
                                db='screener',
                                port=3306,
                                charset='utf8',
                                autocommit = True
        )

        self.cursor = self.db.cursor(pymysql.cursors.DictCursor)

    def execute(self, query, args={}):
        self.cursor.execute(query, args)

    def executeOne(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.cursor.fetchone()
        return row

    def executeAll(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.cursor.fetchall()
        return row

    def commit(self):
        self.db.commit()
