
from authentication.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator

from .models import Bus, Location, Route, RouteIndex, Ride

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


class RouteIndexSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteIndex
        fields = ['location','index']


class RouteSerializer(serializers.ModelSerializer):
    places = RouteIndexSerializer(many=True)
    bus = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Route
        fields = '__all__'

    def create(self, validated_data):
        places = validated_data.pop('places')
        route = Route.objects.create(**validated_data)
        for loc in places:
            RouteIndex.objects.create(
                route=route, **loc
            )
        return route

class RouteViewSerializer(serializers.ModelSerializer):
    locations= LocationSerializer(many=True)
    
    class Meta:
        model = Route
        fields = ['route_id','route_name','locations']

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

    class Meta:
        model = Bus
        fields = ['bus_id','bus_name', 'county', 'area','routes', 'default_route']

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
    date = serializers.DateTimeField(read_only=True)
    bus = serializers.PrimaryKeyRelatedField(queryset=Bus.objects.all())
    route = serializers.PrimaryKeyRelatedField(queryset=Route.objects.all())
    marshal= serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Ride
        fields = ['ride_id','weather', 'wind_speed', 'date','bus', 'route', 'marshal']

    def create(self, validated_data):
        return Ride.objects.create(**validated_data)

