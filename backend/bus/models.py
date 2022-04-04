from django.conf import settings
from django.db import models
from django.utils import timezone


class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    location_type = models.CharField(max_length=128)
    location_name = models.CharField(max_length=128)
    latitude = models.CharField(max_length=128)
    longitude = models.CharField(max_length=128)
    eircode= models.CharField(max_length=10,null=True )
    created_on = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.last_updated = timezone.now()
        self.save()

    def __str__(self):
        return self.location_id


class Bus(models.Model):
    bus_id = models.IntegerField(primary_key=True)
    bus_name = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    default_marshal = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(blank=True, null=True)


    def publish(self):
        self.last_updated = timezone.now()
        self.save()

    def __str__(self):
        return self.bus_id



class Route(models.Model):
    route_id = models.AutoField(primary_key=True)
    route_name = models.CharField(max_length=100)
    bus = models.ForeignKey("Bus", verbose_name="bus", related_name="route_buses", on_delete=models.CASCADE)
    is_default = models.BooleanField(default=False)
    locations = models.ManyToManyField(Location, through='RouteIndex',verbose_name="route_locations",related_name="route_locations")
    
    def __str__(self):
        return self.route_id

class RouteIndex(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, verbose_name="route_index_location", related_name="route_index_location")
    index = models.IntegerField()

    def __str__(self):
        return self.index


class Ride(models.Model):
    ride_id = models.AutoField(primary_key=True)
    weather = models.CharField(max_length=100)
    wind_speed = models.FloatField()
    start = models.DateTimeField(default=timezone.now)
    end = models.DateTimeField(blank=True, null=True)
    bus = models.ForeignKey("Bus", verbose_name="bus",
                            related_name="ride_bus", on_delete=models.CASCADE)
    route = models.ForeignKey("Route", verbose_name="route",
                              related_name="ride_route", on_delete=models.CASCADE)
    marshal = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.last_updated = timezone.now()
        self.save()

    def __str__(self):
        return self.ride_id


class Attendance(models.Model):
    attendance_id = models.IntegerField(primary_key=True)
    start_location = models.ForeignKey(
        "Location", verbose_name="location", related_name="attend_start_location", on_delete=models.CASCADE)
    end_location = models.ForeignKey(
        "Location", verbose_name="location", related_name="attend_end_location", on_delete=models.CASCADE)
    start_date_time = models.DateTimeField()
    start_date_time = models.DateTimeField()
    # change later to [location,time]
    route = models.CharField(max_length=100)
    ride = models.ForeignKey("Ride", verbose_name="ride",
                             related_name="attend_ride", on_delete=models.CASCADE)
    attendee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.last_updated = timezone.now()
        self.save()

    def __str__(self):
        return self.attendance_id


class Incident(models.Model):
    incident_id = models.IntegerField(primary_key=True)
    incident_type = models.CharField(max_length=100)
    incident_location = models.ForeignKey(
        "Location", verbose_name="location", related_name="incident_location", on_delete=models.CASCADE)
    incident_date_time = models.DateTimeField()
    restart_date_time = models.DateTimeField()
    ride = models.ForeignKey("Ride", verbose_name="ride",
                             related_name="incident_ride", on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.last_updated = timezone.now()
        self.save()

    def __str__(self):
        return self.incident_id
