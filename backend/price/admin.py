from django.contrib import admin

# Register your models here.
from price.models import ScreeningTest, SymbolTest

admin.site.register(ScreeningTest)
admin.site.register(SymbolTest)
