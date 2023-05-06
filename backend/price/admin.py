from django.contrib import admin

# Register your models here.
from price.models import Symbol, Price240m

admin.site.register(Symbol)
admin.site.register(Price240m)
