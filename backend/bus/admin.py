from django.contrib import admin
from django.db import models
from bus.models import Route
from bus.models import Bus


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ("route_id", "route_name")
    readonly_fields = ("route_id","locations")
    fields = ("route_name","is_default","bus")
    


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    
    list_display = ("bus_id", "bus_name")
    readonly_fields = ("bus_id",)
    fields = ("bus_name","county","area","default_marshal",)
    