
import math
from tracemalloc import start
from authentication.models import User
from authentication.serializers import UserSerializer
from config import GOOGLE_MAP_KEY
from user.models import JoinBusLocation
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator
import requests

from .models import Attendance, Bus, Location, Route, RouteIndex, Ride

class LocationSerializer(serializers.ModelSerializer):
    
    longitude = serializers.CharField(max_length=128,required=False)
    latitude = serializers.CharField(max_length=128, required = False)
    location_id = serializers.CharField(max_length=128, required = False)
    location_type = serializers.CharField(max_length=128, required = False)
    location_name = serializers.CharField(max_length=128, required = False)
    eircode = serializers.CharField(max_length=128, required = False)
    

    class Meta:
        model = Location
        fields = ['location_id','location_type', 'location_name', 'longitude', 'latitude','eircode']

    def create(self, validated_data):
        return Location.objects.create(**validated_data)




class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


class RouteIndexSerializer(serializers.ModelSerializer):
    location= LocationSerializer()
    class Meta:
        model = RouteIndex
        fields = ['location','index','is_join_location']


class RouteViewSerializer(serializers.ModelSerializer):
    locations= LocationSerializer(many=True)
    active_ride = serializers.SerializerMethodField()
    
    class Meta:
        model = Route
        fields = ['route_id','route_name','locations','active_ride']

    def get_active_ride(self, instance):
        ride = Ride.objects.filter(route=instance, end__isnull=True).last()
        return ride.ride_id if ride else None

    def to_representation(self, route):
        response = super().to_representation(route)
        # routes = route.places.order_by('route_index_location__index')
        # response["places"] = sorted(response["places"], key=lambda x: instance.)
        return response

class BusSerializer(serializers.ModelSerializer):

    bus_id=serializers.IntegerField(read_only=True)
    bus_name = serializers.CharField(max_length=128,required=True)
    county = serializers.CharField(max_length=128,required=True)
    area = serializers.CharField(max_length=128,required=True)
    routes = serializers.SerializerMethodField()
    default_route = serializers.SerializerMethodField()
    default_marshal = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Bus
        fields = ['bus_id','bus_name', 'county', 'area','routes', 'default_route','default_marshal']

    def create(self, validated_data):
        return Bus.objects.create(**validated_data)

    def get_routes(self, instance):
        q = Route.objects.filter(bus=instance)
        serializer = RouteViewSerializer(q, many=True)
        return serializer.data

    def get_default_route(self, instance):
        default_route=instance.route_buses.filter(is_default=True).first()
        if  default_route:
            
            return default_route.route_id

class RideSerializer(serializers.ModelSerializer):


    ride_id=serializers.IntegerField(read_only=True)
    weather = serializers.CharField(max_length=128,required=True)
    wind_speed = serializers.FloatField()
    start = serializers.DateTimeField(read_only=True)
    bus = serializers.PrimaryKeyRelatedField(queryset=Bus.objects.all())
    route = serializers.PrimaryKeyRelatedField(queryset=Route.objects.all())
    marshal= serializers.PrimaryKeyRelatedField(read_only=True)
    stat = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = ['ride_id','weather', 'wind_speed', 'start','bus', 'route', 'marshal','stat']

    def create(self, validated_data):
        return Ride.objects.create(**validated_data)

    
    def get_stat(self, instance):
        child_data= JoinBusLocation.objects.get(
            route=instance.route,
            child_id=self.context['child']
        )
        home = child_data.child.child_user.start_location
        school = child_data.child.child_user.start_location
        join_location = child_data.join_location
        current_location = instance.current_location
        GOOGLE_MAPS_API_KEY = GOOGLE_MAP_KEY

        origin1 = current_location
        destination1 = join_location.latitude + ',' + join_location.longitude
        destination2 = school.latitude + ',' + school.longitude
        mode = "bicycling"
        key = GOOGLE_MAPS_API_KEY
        url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origin1 +'|'+destination1+ '&destinations=' + destination1 +"|"+destination2+ '&units=imperial&key=' + key + '&mode=' + mode
        res = requests.get(url).json()
        bus_to_join = res['rows'][0]['elements'][0]['duration']["value"]
        bus_to_school = res['rows'][0]['elements'][1]['duration']["value"]

        weather_url = "https://api.openweathermap.org/data/2.5/weather?lat="+current_location.split(",")[0]+"&lon="+current_location.split(",")[1]+"&appid=6618c0e3c38b4cb7608cd2c418c97ade&units=metric"
        res = requests.get(weather_url).json()
        return {
            "Ride":"",
            "  Route Name": instance.route.route_name,
            "  Marshal Name": instance.marshal.name,
            "  Start on": instance.start.strftime("%H:%M:%S") if instance.start else "",
            "  End on": instance.end.strftime("%H:%M:%S") if instance.end else "",
            "Bus Arrives ":"",
            "  Join Location": str(math.floor(bus_to_join/60)) +"min" ,
            "  School": str(math.floor(bus_to_school/60)) +"min",
            "Weather":"",
            "  Temparature": str(res["main"]["temp"])+"C" ,
            "  Wind": str(res["wind"]["speed"]*3.6) +"km/h",
        }

class AttendenceSerializer(serializers.ModelSerializer):
    attendance_id =serializers.IntegerField(read_only=True)
    ride = serializers.PrimaryKeyRelatedField(read_only=True)
    attendee = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.CharField(max_length=100,required=True)

    class Meta:
        model = Attendance
        fields = ['attendance_id','join_location', 'join_geo', 'join_date_time','end_date_time', 'ride','attendee','status']



class MarshalBusSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    child = UserSerializer()

    class Meta:
        model = JoinBusLocation
        fields = ['child','status']

    def get_status(self,instance):
        ride_id = self.context['ride_id']
        att = Attendance.objects.filter(attendee = instance.child, ride_id = ride_id).last()
        if att:
            return att.status
        return None