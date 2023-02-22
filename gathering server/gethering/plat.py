import talib.abstract as ta
from pandas_datareader import data

sillajen = data.DataReader('215600.KQ','yahoo', '2017-01-01', '2018-01-31')\
    .dropna(how='all')\
    .rename(columns=lambda col:col.lower())
# ta-lib로 5기간 종가 이동평균 계산
talib_ma5 = ta.MA(sillajen, timeperiod=5)

# pandas 기능을 이용하여 5기간 이동평균 계산
pandas_ma5 = sillajen.close.rolling(window=5).mean()

