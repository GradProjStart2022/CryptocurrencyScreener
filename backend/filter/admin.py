from django.contrib import admin

# Register your models here.
from filter.models import Filter, Setting, Previous

admin.site.register(Filter)
admin.site.register(Setting)
admin.site.register(Previous)
