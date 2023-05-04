from django.contrib import admin

# Register your models here.
from price.models import Price60m, Symbol

admin.site.register(Symbol)
admin.site.register(Price60m)
