from datetime import datetime, timedelta
import pandas as pd
from pandas.io.sql import DatabaseError
import sqlite3
import schedule
import tqdm
import logging

import _upbit

con = sqlite3.connect(f"./test(240min).db")
cursor = con.cursor()
cursor.execute("SELECT*FROM KRW_BTC")
cursor.fetchall()