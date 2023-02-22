from django.contrib import admin

# Register your models here.
from filter.models import Filter, Setting

admin.site.register(Filter)
admin.site.register(Setting)
