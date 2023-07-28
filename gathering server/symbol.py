import numpy as np
import ta
from sqlalchemy import MetaData
import pandas as pd
from sqlalchemy import create_engine
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

tb_df= ta.calculate_ta(tb_df)
tb_df.columns = [col.upper() if "_" not in col else col for col in tb_df.columns]
columns = tb_df.columns.tolist()
with open('my_list.txt', 'w') as f:
    for item in columns:
        f.write("%s\n" % item)
