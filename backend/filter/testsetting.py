from filter.models import Filter, Setting

filter1 = Filter(
    user_id=2, expression="(A&B)|(C&D)", alarm=False, name="test1", time=15
)
filter1.save()

setting1 = Setting(
    filter_id=filter1.id,
    name="A",
    indicator="LOW",
    value1="8000",
    value2="0",
    sign="above_equal",
)
setting1.save()

setting2 = Setting(
    filter_id=filter1.id,
    name="B",
    indicator="RSI",
    value1="70",
    value2="0",
    sign="above_equal",
)
setting2.save()

setting3 = Setting(
    filter_id=filter1.id,
    name="C",
    indicator="HIGH",
    value1="10000",
    value2="0",
    sign="below",
)
setting3.save()

setting4 = Setting(
    filter_id=filter1.id,
    name="D",
    indicator="BB_UPPER",
    value1="12000",
    value2="14000",
    sign="between",
)
setting4.save()

filter2 = Filter(user_id=2, expression="A&B", alarm=False, name="test2", time=15)
filter2.save()

setting5 = Setting(
    filter_id=filter2.id,
    name="A",
    indicator="HMA",
    value1="300",
    value2="400",
    sign="between",
)
setting5.save()

setting6 = Setting(
    filter_id=filter2.id,
    name="B",
    indicator="OPEN",
    value1="2000",
    value2="0",
    sign="above",
)
setting6.save()
