import talib
import pandas as pd
import numpy as np
from scipy.stats import norm
from scipy.stats import kurtosis, skew, sem


def calculate_ta(df):
    open = df['open']
    close = df['close']
    high = df['high']
    low = df['low']
    volume = df['volume']

    # Moving Average (MA)
    ma = talib.MA(close, timeperiod=5, matype=0)
    df['MA'] = ma

    # Exponential Moving Average (EMA)
    ema = talib.EMA(close, timeperiod=5)
    df['EMA'] = ema

    # Simple Moving Average (SMA)
    sma = talib.SMA(close, timeperiod=5)
    df['SMA'] = sma

    # Weighted Moving Average (WMA)
    wma = talib.WMA(close, timeperiod=5)
    df['WMA'] = wma

    # Volume Moving Average (VMA)
    vma = talib.MA(volume * close, timeperiod=5, matype=0) / talib.MA(volume, timeperiod=5, matype=0)
    df['VMA'] = vma

    # Exponential Moving Average of Deviation (EMAD)
    emad = talib.EMA(close - talib.EMA(close, timeperiod=5), timeperiod=5)
    df['EMAD'] = emad

    # Weighted Moving Average of Deviation (WMAD)
    weights = np.arange(1, 6)
    wmavg = np.sum(weights * close[-5:]) / np.sum(weights)
    wmad = talib.WMA(close[-5:] - wmavg, timeperiod=5)
    df['WMAD'] = wmad

    # Centered Moving Average (CMA)
    cma_window = 5
    half_window = cma_window // 2
    cumsum = np.cumsum(np.insert(close.values, 0, 0))
    cma = (cumsum[cma_window:] - cumsum[:-cma_window]) / float(cma_window)
    cma = np.concatenate((np.repeat(np.nan, half_window), cma, np.repeat(np.nan, half_window)))
    df['CMA'] = cma

    # Bollinger Band (BB)

    upper, middle, lower = talib.BBANDS(df['close'], timeperiod=20, nbdevup=2, nbdevdn=2)

    # Add bands to dataframe
    df['BB_UPPER'] = upper
    df['BB_LOWER'] = low

    # Mean Deviation (MD)
    md = talib.STDDEV(close, timeperiod=14, nbdev=1)
    df['MD'] = md

    # Weighted Average (WAVG)
    wavg = talib.WMA(close, timeperiod=20)
    df['WAVG'] = wavg

    # Exponential Weighted Average (EWAVG)
    ewavg = talib.EMA(close, timeperiod=20)
    df['EWAVG'] = ewavg

    # Triangular Moving Average (TRIMA)
    trima = talib.TRIMA(close, timeperiod=20)
    df['TRIMA'] = trima

    # Exponential Weighted Moving Average (EWMA)
    ewma = talib.EMA(close, timeperiod=20)
    df['EWMA'] = ewma


    # Hull Moving Average (HMA)
    wma1 = talib.WMA(close, timeperiod=int(14 / 2))
    wma2 = talib.WMA(close, timeperiod=14)
    wma1 = np.where(np.isnan(wma1), 0, wma1)
    wma2 = np.where(np.isnan(wma2), 0, wma2)
    diff = 2 * wma1 - wma2
    hma = talib.WMA(diff, timeperiod=int(np.sqrt(14)))

    df['HMA'] = hma

    # Moving Average Angle (MAA)
    ma = talib.SMA(close, timeperiod=30)
    ma_diff = ma - ma.shift()
    maa = np.arctan(ma_diff)
    df['MAA'] = maa

    # Moving Average Gap (MAG)
    ma5 = df['close'].rolling(window=5).mean()
    ma20 = df['close'].rolling(window=20).mean()
    mag = ma5 - ma20
    df['MAG'] = mag

    # Moving Average Ratio (MAR)
    ma_short = talib.SMA(close, timeperiod=10)
    ma_long = talib.SMA(close, timeperiod=30)
    mar = ma_short / ma_long
    df['MAR'] = mar

    # MACD
    macd, macdsignal, macdhist = talib.MACD(close, fastperiod=12, slowperiod=26, signalperiod=9)
    df['MACD'] = macd
    df['MACD_SIGNAL'] = macdsignal

    # Average True Range (ATR)
    atr = talib.ATR(high, low, close, timeperiod=14)
    df['ATR'] = atr

    # Relative Strength Index (RSI)
    rsi = talib.RSI(close, timeperiod=14)
    df['RSI'] = rsi

    # Stochastic
    slowk, slowd = talib.STOCH(high, low, close, fastk_period=14, slowk_period=3, slowk_matype=0, slowd_period=3,
                               slowd_matype=0)
    df['SlowK'] = slowk
    df['SlowD'] = slowd

    # Stochastic RSI
    fastk, fastd = talib.STOCHRSI(close, timeperiod=14, fastk_period=3, fastd_period=3, fastd_matype=0)
    df['FastK'] = fastk
    df['FastD'] = fastd

    # Williams %R
    wr = talib.WILLR(high, low, close, timeperiod=14)
    df['Williams %R'] = wr

    # Commodity Channel Index (CCI)
    cci = talib.CCI(high, low, close, timeperiod=14)
    df['CCI'] = cci

    # Accumulation/Distribution (AD)
    ad = talib.AD(high, low, close, volume)
    df['AD'] = ad

    # Accumulation/Distribution Oscillator (ADOSC)
    adosc = talib.ADOSC(high, low, close, volume, fastperiod=3, slowperiod=10)
    df['ADOSC'] = adosc

    # Exit Points (ExitPoints)
    exitpoints = talib.ULTOSC(high, low, close, timeperiod1=7, timeperiod2=14, timeperiod3=28)
    df['EP'] = exitpoints

    # Directional Movement Index (DMI)
    df['DMI'] = talib.DX(df['high'], df['low'], df['close'], timeperiod=14)

    # Angle Average (AA)
    aa = talib.LINEARREG_ANGLE(df['close'], timeperiod=14)
    df['AA'] = aa

    # Linear Regression (LR)
    lr = talib.LINEARREG(df['close'], timeperiod=14)
    df['LR'] = lr

    # Momentum
    df['MOTM'] = talib.MOM(df['close'], timeperiod=14)

    # Exponential Momentum (EM)
    ema = talib.EMA(close, timeperiod=14)
    em = (close - ema) / ema
    df['EM'] = em

    # Weighted Momentum (WM)
    def weighted_momentum(close, timeperiod=20):
        weights = np.arange(1, timeperiod + 1)[::-1]  # 최근에 가까울수록 높은 가중치를 주기 위해 역순으로 정의합니다.
        ema = talib.EMA(close, timeperiod=timeperiod)
        weighted_momentum = np.dot(close[-timeperiod:], weights) / weights.sum() - ema[-1]
        return weighted_momentum

    df['WM'] = df['close'].rolling(20).apply(weighted_momentum, raw=True)

    # Moving Average Momentum (MOM)
    mom = talib.MOM(close, timeperiod=10)
    df['MOM'] = mom

    # Rate of Change (ROC)
    roc = talib.ROC(close, timeperiod=10)
    df['ROC'] = roc

    # Rate of Change Ratio (ROCR)
    rocr = talib.ROCR(close, timeperiod=10)
    df['ROCR'] = rocr

    # Rate of Change Percentage (ROCP)
    rocp = talib.ROCP(close, timeperiod=10)
    df['ROCP'] = rocp

    # Triple Exponential Moving Average (TEMA)
    tema = talib.TEMA(close, timeperiod=30)
    df['TEMA'] = tema

    # Rate of Change Average (ROCA)
    roca = talib.ROCP(close, timeperiod=10)
    roca_avg = talib.MA(roca, timeperiod=10)
    df['ROCA'] = roca_avg

    # Pivot Points, Support, and Resistance
    pivot = (high + low + close) / 3
    r2 = pivot + (high - low)
    r1 = (2 * pivot) - low
    s1 = (2 * pivot) - high
    s2 = pivot - (high - low)

    df['Pivot'] = pivot
    df['R2'] = r2
    df['R1'] = r1
    df['S1'] = s1
    df['S2'] = s2

    # Probability Distribution Channel (PDC)
    stddev = talib.STDDEV(close, timeperiod=20, nbdev=1)

    # 20일 동안의 평균 수익률 계산
    sma = talib.SMA(close, timeperiod=20)
    roc = (close / sma) - 1
    mean = talib.SMA(roc, timeperiod=20)

    # Probability Distribution Channel 상한선, 하한선 계산
    upper = mean + stddev
    lower = mean - stddev

    # DataFrame에 Probability Distribution Channel 상한선, 하한선 추가
    df['PDCUP'] = upper
    df['PDCDN'] = lower

    # Exponential Moving Average Change
    emac = talib.EMA(close, timeperiod=10)
    emac_change = talib.ROCP(emac, timeperiod=10)
    df['EMAC'] = emac_change

    # Weighted Moving Average Change
    wmac = talib.WMA(close, timeperiod=10)
    wmac_change = talib.ROCP(wmac, timeperiod=10)
    df['WMAC'] = wmac_change

    # Kaufman Adaptive Moving Average
    kama = talib.KAMA(close, timeperiod=30)
    df['KAMA'] = kama

    # Chande Momentum Oscillator
    cmo = talib.CMO(close, timeperiod=14)
    df['CMO'] = cmo

    # On Balance Volume
    # OBV 계산
    df['obv'] = talib.OBV(close, volume)

    # Klinger Oscillator 계산
    ko_short = talib.EMA(df['obv'], timeperiod=34) - talib.EMA(df['obv'], timeperiod=55)
    ko_long = talib.EMA(df['obv'], timeperiod=89) - talib.EMA(df['obv'], timeperiod=144)
    df['kvo'] = ko_short - ko_long

    # Ergodic Indicator
    short_ema = talib.EMA(close, timeperiod=5)
    long_ema = talib.EMA(close, timeperiod=35)
    emv = ((high + low) / 2 - (high.shift() + low.shift()) / 2) * (volume / ((high - low)))
    emva = talib.EMA(emv, timeperiod=14)
    eci = (short_ema / long_ema) * 100
    df['ECI'] = eci
    df['EMVA'] = emva

    # QStick Indicator
    # 종가의 단순이동평균 계산
    sma_close = talib.SMA(close, 14)

    # QStick 계산
    qstick = ((close - sma_close) / sma_close) * volume
    df['QSTICK'] = qstick

    # Schaff Trend Cycle
    stc = talib.EMA(talib.EMA(close - talib.MIN(low, timeperiod=10), timeperiod=10), timeperiod=10) / \
          talib.EMA(talib.EMA(talib.MAX(high, timeperiod=10) - talib.MIN(low, timeperiod=10), timeperiod=10),
                    timeperiod=10)

    df['STC'] = stc

    # Ultimate Oscillator (UO)

    ultosc = talib.ULTOSC(high, low, close, timeperiod1=7, timeperiod2=14, timeperiod3=28)

    df['ULTOSC'] = ultosc

    # Upper Donchian Channel (20-day high)
    upper_dc = talib.MAX(high, timeperiod=20)

    # Lower Donchian Channel (20-day low)
    lower_dc = talib.MIN(low, timeperiod=20)

    # Middle Donchian Channel (average of upper and lower channels)
    middle_dc = (upper_dc + lower_dc) / 2

    # Add to DataFrame
    df['DCUP'] = upper_dc
    df['DCDN'] = lower_dc
    df['DCMI'] = middle_dc

    # MACD Histogram (MCDHST)

    macd, signal, hist = talib.MACD(close, fastperiod=12, slowperiod=26, signalperiod=9)
    df['MCDHST'] = hist

    # Chaikin Money Flow
    # Money Flow Volume
    mf_multiplier = ((close - low) - (high - close)) / (high - low)
    mf_volume = mf_multiplier * volume
    mf_volume = np.nan_to_num(mf_volume)
    # Chaikin Money Flow
    cmf = talib.SMA(mf_volume, timeperiod=20) / talib.SMA(volume, timeperiod=20)
    df['CMF']=cmf

    # Average Price
    ap = (open + high + low + close) / 4
    df['AP'] = ap

    # Exponential Smoothing 계산
    alpha = 0.5
    df['ES'] = close.ewm(alpha=alpha, adjust=False).mean()

    #Exponential Moving Average Rate of Change(EMAROC)
    period = 12  # EMA 기간
    ema = talib.EMA(close, timeperiod=period)
    ema_roc = talib.ROC(ema, timeperiod=1)

    df['EMAROC'] = ema_roc

    # KST Oscillator (KSTO)
    if(len(df['ROC'])>50):
        rocma1 = talib.EMA(roc, timeperiod=10)
        rocma2 = talib.EMA(roc, timeperiod=15)
        rocma3 = talib.EMA(roc, timeperiod=20)
        rocma4 = talib.EMA(roc, timeperiod=30)
        kst = talib.SMA(rocma1 + 2 * rocma2 + 3 * rocma3 + 4 * rocma4, timeperiod=9)
        df['KSTO'] = kst
    else:
        new_col = pd.Series([np.nan] * len(df), name='KSTO')
        # Add the new column to the DataFrame
        df = pd.concat([df, new_col], axis=1)


    #Kaufman Efficiency Ratio(KER)

    ker = talib.KAMA(close, timeperiod=10)
    diff = close - ker
    volatility = talib.SUM(abs(diff), timeperiod=10)
    kama_ema = talib.EMA(abs(diff), timeperiod=10)
    ker = diff / volatility * kama_ema
    df['KER'] = ker

    #Linear Regression Intercept(LRI)
    df['LRI'] = talib.LINEARREG_INTERCEPT(close, timeperiod=14)

    #Linear Regression Slope(LRS)
    slope = talib.LINEARREG_SLOPE(close, timeperiod=14)

    df['LRS'] = slope

    # Standard Deviation
    std_dev = close.rolling(window=20).std()
    df['SD'] = std_dev

    # Standard Normal Distribution
    mean = close.rolling(window=20).mean()
    std_dev = close.rolling(window=20).std()
    std_norm_dist = (close - mean) / std_dev
    df['SND'] = std_norm_dist.apply(norm.cdf)

    #Value at Risk

    # 수익률 계산
    returns = close.pct_change()

    # 평균과 표준편차 계산
    mu = np.mean(returns)
    sigma = np.std(returns)

    # VaR 계산
    confidence_level = 0.95
    holding_period = 1
    var = norm.ppf(1 - confidence_level, mu, sigma) * close.iloc[-1] * holding_period

    # 결과를 데이터프레임에 추가
    df['VAR'] = var

    # Correlation Coefficient
    corr = df[['open', 'high', 'low', 'close', 'volume']].corr()
    df['CCI'] = corr['close'].iloc[:-1]

    # Covariance
    cov = df[['open', 'high', 'low', 'close', 'volume']].cov()
    df['COV'] = cov['close'].iloc[:-1]

    # Kurtosis
    kurt = kurtosis(close)
    df['KURTS'] = kurt

    # Skewness
    skewness = skew(close)
    df['SKNS'] = skewness

    # Standard Error of the Mean
    sem_ = sem(close)
    df['STEM'] = sem_
    # Variance Ratio
    returns = close.pct_change()

    # Calculate the 10-day and 30-day rolling returns
    returns_10day = returns.rolling(window=10).sum()
    returns_30day = returns.rolling(window=30).sum()

    # Calculate the variance of the 10-day and 30-day returns
    var_10day = returns_10day.var()
    var_30day = returns_30day.var()

    # Calculate the Variance Ratio
    var_ratio = var_10day / var_30day

    # Add the Variance Ratio to the DataFrame
    df['VR'] = var_ratio
    return df



if __name__ == "__main__":
    np.random.seed(123)
    df = pd.DataFrame({'open': np.random.rand(30),
                   'high': np.random.rand(30),
                   'low': np.random.rand(30),
                   'close': np.random.rand(30),
                   'volume': np.random.rand(30)})
    dd=calculate_ta(df)
    print(calculate_ta(df))
