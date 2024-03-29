from django.db import models

# Create your models here.
class Symbol(models.Model):
    """
    Symbol DB Table
    """

    id = models.AutoField(primary_key=True, verbose_name="심볼 순번")
    TICKER = models.CharField(max_length=255)
    NAME_EN = models.CharField(max_length=255)
    NAME_KR = models.CharField(max_length=255)

    class Meta:
        db_table = "SYMBOLS"


class Price30m(models.Model):
    """
    Price30m DB Table (30분봉)
    """

    id = models.AutoField(primary_key=True, verbose_name="심볼 순번")
    symbol = models.ForeignKey(
        Symbol,
        on_delete=models.CASCADE,
        null=True,
        verbose_name="심볼 순번",
        db_column="symbol_id",
    )
    TICKER = models.CharField(max_length=255)
    DATE = models.DateTimeField(verbose_name="일시")
    OPEN = models.FloatField(null=True)
    HIGH = models.FloatField(null=True)
    LOW = models.FloatField(null=True)
    CLOSE = models.FloatField(null=True)
    VOLUME = models.FloatField(null=True)
    MA = models.FloatField(null=True)
    EMA = models.FloatField(null=True)
    SMA = models.FloatField(null=True)
    WMA = models.FloatField(null=True)
    VMA = models.FloatField(null=True)
    EMAD = models.FloatField(null=True)
    WMAD = models.FloatField(null=True)
    CMA = models.FloatField(null=True)
    BB_UPPER = models.FloatField(null=True)
    BB_LOWER = models.FloatField(null=True)
    MD = models.FloatField(null=True)
    WAVG = models.FloatField(null=True)
    EWAVG = models.FloatField(null=True)
    TRIMA = models.FloatField(null=True)
    EWMA = models.FloatField(null=True)
    HMA = models.FloatField(null=True)
    MAA = models.FloatField(null=True)
    MAG = models.FloatField(null=True)
    MAR = models.FloatField(null=True)
    MACD = models.FloatField(null=True)
    MACD_SIGNAL = models.FloatField(null=True)
    ATR = models.FloatField(null=True)
    RSI = models.FloatField(null=True)
    SLOWK = models.FloatField(null=True)
    SLOWD = models.FloatField(null=True)
    FASTK = models.FloatField(null=True)
    FASTD = models.FloatField(null=True)
    WILLIAMS = models.FloatField(null=True)
    CCI = models.FloatField(null=True)
    AD = models.FloatField(null=True)
    ADOSC = models.FloatField(null=True)
    EP = models.FloatField(null=True)
    DMI = models.FloatField(null=True)
    AA = models.FloatField(null=True)
    LR = models.FloatField(null=True)
    MOTM = models.FloatField(null=True)
    EM = models.FloatField(null=True)
    WM = models.FloatField(null=True)
    MOM = models.FloatField(null=True)
    ROC = models.FloatField(null=True)
    ROCR = models.FloatField(null=True)
    ROCP = models.FloatField(null=True)
    TEMA = models.FloatField(null=True)
    ROCA = models.FloatField(null=True)
    PIVOT = models.FloatField(null=True)
    R2 = models.FloatField(null=True)
    R1 = models.FloatField(null=True)
    S1 = models.FloatField(null=True)
    S2 = models.FloatField(null=True)
    PDCUP = models.FloatField(null=True)
    PDCDN = models.FloatField(null=True)
    EMAC = models.FloatField(null=True)
    WMAC = models.FloatField(null=True)
    KAMA = models.FloatField(null=True)
    CMO = models.FloatField(null=True)
    OBV = models.FloatField(null=True)
    KVO = models.FloatField(null=True)
    ECI = models.FloatField(null=True)
    EMVA = models.FloatField(null=True)
    QSTICK = models.FloatField(null=True)
    STC = models.FloatField(null=True)
    ULTOSC = models.FloatField(null=True)
    DCUP = models.FloatField(null=True)
    DCDN = models.FloatField(null=True)
    DCMI = models.FloatField(null=True)
    MCDHST = models.FloatField(null=True)
    CMF = models.FloatField(null=True)
    AP = models.FloatField(null=True)
    ES = models.FloatField(null=True)
    EMAROC = models.FloatField(null=True)
    KSTO = models.FloatField(null=True)
    KER = models.FloatField(null=True)
    LRI = models.FloatField(null=True)
    LRS = models.FloatField(null=True)
    SD = models.FloatField(null=True)
    SND = models.FloatField(null=True)
    VAR = models.FloatField(null=True)
    COV = models.FloatField(null=True)
    KURTS = models.FloatField(null=True)
    SKNS = models.FloatField(null=True)
    STEM = models.FloatField(null=True)
    VR = models.FloatField(null=True)

    class Meta:
        unique_together = (("TICKER", "DATE"),)
        db_table = "upbit_spot_krw_30min"


class Price60m(models.Model):
    """
    Price60m DB Table (60분봉)
    """

    id = models.AutoField(primary_key=True, verbose_name="심볼 순번")
    symbol = models.ForeignKey(
        Symbol,
        on_delete=models.CASCADE,
        null=True,
        verbose_name="심볼 순번",
        db_column="symbol_id",
    )
    TICKER = models.CharField(max_length=255)
    DATE = models.DateTimeField(verbose_name="일시")
    OPEN = models.FloatField(null=True)
    HIGH = models.FloatField(null=True)
    LOW = models.FloatField(null=True)
    CLOSE = models.FloatField(null=True)
    VOLUME = models.FloatField(null=True)
    MA = models.FloatField(null=True)
    EMA = models.FloatField(null=True)
    SMA = models.FloatField(null=True)
    WMA = models.FloatField(null=True)
    VMA = models.FloatField(null=True)
    EMAD = models.FloatField(null=True)
    WMAD = models.FloatField(null=True)
    CMA = models.FloatField(null=True)
    BB_UPPER = models.FloatField(null=True)
    BB_LOWER = models.FloatField(null=True)
    MD = models.FloatField(null=True)
    WAVG = models.FloatField(null=True)
    EWAVG = models.FloatField(null=True)
    TRIMA = models.FloatField(null=True)
    EWMA = models.FloatField(null=True)
    HMA = models.FloatField(null=True)
    MAA = models.FloatField(null=True)
    MAG = models.FloatField(null=True)
    MAR = models.FloatField(null=True)
    MACD = models.FloatField(null=True)
    MACD_SIGNAL = models.FloatField(null=True)
    ATR = models.FloatField(null=True)
    RSI = models.FloatField(null=True)
    SLOWK = models.FloatField(null=True)
    SLOWD = models.FloatField(null=True)
    FASTK = models.FloatField(null=True)
    FASTD = models.FloatField(null=True)
    WILLIAMS = models.FloatField(null=True)
    CCI = models.FloatField(null=True)
    AD = models.FloatField(null=True)
    ADOSC = models.FloatField(null=True)
    EP = models.FloatField(null=True)
    DMI = models.FloatField(null=True)
    AA = models.FloatField(null=True)
    LR = models.FloatField(null=True)
    MOTM = models.FloatField(null=True)
    EM = models.FloatField(null=True)
    WM = models.FloatField(null=True)
    MOM = models.FloatField(null=True)
    ROC = models.FloatField(null=True)
    ROCR = models.FloatField(null=True)
    ROCP = models.FloatField(null=True)
    TEMA = models.FloatField(null=True)
    ROCA = models.FloatField(null=True)
    PIVOT = models.FloatField(null=True)
    R2 = models.FloatField(null=True)
    R1 = models.FloatField(null=True)
    S1 = models.FloatField(null=True)
    S2 = models.FloatField(null=True)
    PDCUP = models.FloatField(null=True)
    PDCDN = models.FloatField(null=True)
    EMAC = models.FloatField(null=True)
    WMAC = models.FloatField(null=True)
    KAMA = models.FloatField(null=True)
    CMO = models.FloatField(null=True)
    OBV = models.FloatField(null=True)
    KVO = models.FloatField(null=True)
    ECI = models.FloatField(null=True)
    EMVA = models.FloatField(null=True)
    QSTICK = models.FloatField(null=True)
    STC = models.FloatField(null=True)
    ULTOSC = models.FloatField(null=True)
    DCUP = models.FloatField(null=True)
    DCDN = models.FloatField(null=True)
    DCMI = models.FloatField(null=True)
    MCDHST = models.FloatField(null=True)
    CMF = models.FloatField(null=True)
    AP = models.FloatField(null=True)
    ES = models.FloatField(null=True)
    EMAROC = models.FloatField(null=True)
    KSTO = models.FloatField(null=True)
    KER = models.FloatField(null=True)
    LRI = models.FloatField(null=True)
    LRS = models.FloatField(null=True)
    SD = models.FloatField(null=True)
    SND = models.FloatField(null=True)
    VAR = models.FloatField(null=True)
    COV = models.FloatField(null=True)
    KURTS = models.FloatField(null=True)
    SKNS = models.FloatField(null=True)
    STEM = models.FloatField(null=True)
    VR = models.FloatField(null=True)

    class Meta:
        unique_together = (("TICKER", "DATE"),)
        db_table = "upbit_spot_krw_60min"


class Price240m(models.Model):
    """
    Price240m DB Table (4시간봉)
    """

    id = models.AutoField(primary_key=True, verbose_name="심볼 순번")
    symbol = models.ForeignKey(
        Symbol,
        on_delete=models.CASCADE,
        null=True,
        verbose_name="심볼 순번",
        db_column="symbol_id",
    )
    TICKER = models.CharField(max_length=255)
    DATE = models.DateTimeField(verbose_name="일시")
    OPEN = models.FloatField(null=True)
    HIGH = models.FloatField(null=True)
    LOW = models.FloatField(null=True)
    CLOSE = models.FloatField(null=True)
    VOLUME = models.FloatField(null=True)
    MA = models.FloatField(null=True)
    EMA = models.FloatField(null=True)
    SMA = models.FloatField(null=True)
    WMA = models.FloatField(null=True)
    VMA = models.FloatField(null=True)
    EMAD = models.FloatField(null=True)
    WMAD = models.FloatField(null=True)
    CMA = models.FloatField(null=True)
    BB_UPPER = models.FloatField(null=True)
    BB_LOWER = models.FloatField(null=True)
    MD = models.FloatField(null=True)
    WAVG = models.FloatField(null=True)
    EWAVG = models.FloatField(null=True)
    TRIMA = models.FloatField(null=True)
    EWMA = models.FloatField(null=True)
    HMA = models.FloatField(null=True)
    MAA = models.FloatField(null=True)
    MAG = models.FloatField(null=True)
    MAR = models.FloatField(null=True)
    MACD = models.FloatField(null=True)
    MACD_SIGNAL = models.FloatField(null=True)
    ATR = models.FloatField(null=True)
    RSI = models.FloatField(null=True)
    SLOWK = models.FloatField(null=True)
    SLOWD = models.FloatField(null=True)
    FASTK = models.FloatField(null=True)
    FASTD = models.FloatField(null=True)
    WILLIAMS = models.FloatField(null=True)
    CCI = models.FloatField(null=True)
    AD = models.FloatField(null=True)
    ADOSC = models.FloatField(null=True)
    EP = models.FloatField(null=True)
    DMI = models.FloatField(null=True)
    AA = models.FloatField(null=True)
    LR = models.FloatField(null=True)
    MOTM = models.FloatField(null=True)
    EM = models.FloatField(null=True)
    WM = models.FloatField(null=True)
    MOM = models.FloatField(null=True)
    ROC = models.FloatField(null=True)
    ROCR = models.FloatField(null=True)
    ROCP = models.FloatField(null=True)
    TEMA = models.FloatField(null=True)
    ROCA = models.FloatField(null=True)
    PIVOT = models.FloatField(null=True)
    R2 = models.FloatField(null=True)
    R1 = models.FloatField(null=True)
    S1 = models.FloatField(null=True)
    S2 = models.FloatField(null=True)
    PDCUP = models.FloatField(null=True)
    PDCDN = models.FloatField(null=True)
    EMAC = models.FloatField(null=True)
    WMAC = models.FloatField(null=True)
    KAMA = models.FloatField(null=True)
    CMO = models.FloatField(null=True)
    OBV = models.FloatField(null=True)
    KVO = models.FloatField(null=True)
    ECI = models.FloatField(null=True)
    EMVA = models.FloatField(null=True)
    QSTICK = models.FloatField(null=True)
    STC = models.FloatField(null=True)
    ULTOSC = models.FloatField(null=True)
    DCUP = models.FloatField(null=True)
    DCDN = models.FloatField(null=True)
    DCMI = models.FloatField(null=True)
    MCDHST = models.FloatField(null=True)
    CMF = models.FloatField(null=True)
    AP = models.FloatField(null=True)
    ES = models.FloatField(null=True)
    EMAROC = models.FloatField(null=True)
    KSTO = models.FloatField(null=True)
    KER = models.FloatField(null=True)
    LRI = models.FloatField(null=True)
    LRS = models.FloatField(null=True)
    SD = models.FloatField(null=True)
    SND = models.FloatField(null=True)
    VAR = models.FloatField(null=True)
    COV = models.FloatField(null=True)
    KURTS = models.FloatField(null=True)
    SKNS = models.FloatField(null=True)
    STEM = models.FloatField(null=True)
    VR = models.FloatField(null=True)

    class Meta:
        unique_together = (("TICKER", "DATE"),)
        db_table = "upbit_spot_krw_240min"


class Price1d(models.Model):
    """
    Price1d DB Table (일봉)
    """

    # id = models.AutoField(primary_key=True, name="id")
    id = models.AutoField(primary_key=True, verbose_name="심볼 순번")
    symbol = models.ForeignKey(
        Symbol,
        on_delete=models.CASCADE,
        null=True,
        verbose_name="심볼 순번",
        db_column="symbol_id",
    )
    TICKER = models.CharField(max_length=255)
    DATE = models.DateTimeField(verbose_name="일시")
    OPEN = models.FloatField(null=True)
    HIGH = models.FloatField(null=True)
    LOW = models.FloatField(null=True)
    CLOSE = models.FloatField(null=True)
    VOLUME = models.FloatField(null=True)
    MA = models.FloatField(null=True)
    EMA = models.FloatField(null=True)
    SMA = models.FloatField(null=True)
    WMA = models.FloatField(null=True)
    VMA = models.FloatField(null=True)
    EMAD = models.FloatField(null=True)
    WMAD = models.FloatField(null=True)
    CMA = models.FloatField(null=True)
    BB_UPPER = models.FloatField(null=True)
    BB_LOWER = models.FloatField(null=True)
    MD = models.FloatField(null=True)
    WAVG = models.FloatField(null=True)
    EWAVG = models.FloatField(null=True)
    TRIMA = models.FloatField(null=True)
    EWMA = models.FloatField(null=True)
    HMA = models.FloatField(null=True)
    MAA = models.FloatField(null=True)
    MAG = models.FloatField(null=True)
    MAR = models.FloatField(null=True)
    MACD = models.FloatField(null=True)
    MACD_SIGNAL = models.FloatField(null=True)
    ATR = models.FloatField(null=True)
    RSI = models.FloatField(null=True)
    SLOWK = models.FloatField(null=True)
    SLOWD = models.FloatField(null=True)
    FASTK = models.FloatField(null=True)
    FASTD = models.FloatField(null=True)
    WILLIAMS = models.FloatField(null=True)
    CCI = models.FloatField(null=True)
    AD = models.FloatField(null=True)
    ADOSC = models.FloatField(null=True)
    EP = models.FloatField(null=True)
    DMI = models.FloatField(null=True)
    AA = models.FloatField(null=True)
    LR = models.FloatField(null=True)
    MOTM = models.FloatField(null=True)
    EM = models.FloatField(null=True)
    WM = models.FloatField(null=True)
    MOM = models.FloatField(null=True)
    ROC = models.FloatField(null=True)
    ROCR = models.FloatField(null=True)
    ROCP = models.FloatField(null=True)
    TEMA = models.FloatField(null=True)
    ROCA = models.FloatField(null=True)
    PIVOT = models.FloatField(null=True)
    R2 = models.FloatField(null=True)
    R1 = models.FloatField(null=True)
    S1 = models.FloatField(null=True)
    S2 = models.FloatField(null=True)
    PDCUP = models.FloatField(null=True)
    PDCDN = models.FloatField(null=True)
    EMAC = models.FloatField(null=True)
    WMAC = models.FloatField(null=True)
    KAMA = models.FloatField(null=True)
    CMO = models.FloatField(null=True)
    OBV = models.FloatField(null=True)
    KVO = models.FloatField(null=True)
    ECI = models.FloatField(null=True)
    EMVA = models.FloatField(null=True)
    QSTICK = models.FloatField(null=True)
    STC = models.FloatField(null=True)
    ULTOSC = models.FloatField(null=True)
    DCUP = models.FloatField(null=True)
    DCDN = models.FloatField(null=True)
    DCMI = models.FloatField(null=True)
    MCDHST = models.FloatField(null=True)
    CMF = models.FloatField(null=True)
    AP = models.FloatField(null=True)
    ES = models.FloatField(null=True)
    EMAROC = models.FloatField(null=True)
    KSTO = models.FloatField(null=True)
    KER = models.FloatField(null=True)
    LRI = models.FloatField(null=True)
    LRS = models.FloatField(null=True)
    SD = models.FloatField(null=True)
    SND = models.FloatField(null=True)
    VAR = models.FloatField(null=True)
    COV = models.FloatField(null=True)
    KURTS = models.FloatField(null=True)
    SKNS = models.FloatField(null=True)
    STEM = models.FloatField(null=True)
    VR = models.FloatField(null=True)

    class Meta:
        unique_together = (("TICKER", "DATE"),)
        db_table = "upbit_spot_krw_day"
