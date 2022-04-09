from django.contrib import admin

from bus.models import Bus

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ("bus_id", "bus_name")
    readonly_fields = ("bus_id","bus_name","county","area",)
    fields = ("bus_id","bus_name","county","area","default_marshal",)

