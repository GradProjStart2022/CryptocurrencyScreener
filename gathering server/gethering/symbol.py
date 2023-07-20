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
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()
engine = create_engine('mysql+pymysql://root:2264@localhost/upbit_kor', echo=False)

metadata = MetaData()
np.random.seed(123)
tb_df = pd.DataFrame({'open': np.random.rand(30),
                   'high': np.random.rand(30),
                   'low': np.random.rand(30),
                   'close': np.random.rand(30),
                   'volume': np.random.rand(30)})

tb_df=ta.calculate_ta(tb_df)
tb_df.columns = [col.upper() if "_" not in col else col for col in tb_df.columns]
columns = tb_df.columns.tolist()
with open('my_list.txt', 'w') as f:
    for item in columns:
        f.write("%s\n" % item)
