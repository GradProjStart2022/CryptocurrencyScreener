import pyupbit
import talib
import numpy as np

df = pyupbit.get_ohlcv("KRW-BTC", interval="minute60", count=200)
close_price = df['close'].values
rsi = talib.RSI(close_price)

df['RSI'] = rsi

print(df.tail())