from django.contrib import admin

# Register your models here.
from price.models import Symbol, Price240m, Price30m, Price60m, Price1d

admin.site.register(Symbol)
admin.site.register(Price30m)
admin.site.register(Price60m)
admin.site.register(Price240m)
admin.site.register(Price1d)
