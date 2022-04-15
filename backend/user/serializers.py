from pickle import TRUE
from this import d
from xml.dom.domreg import registered
from authentication.serializers import RegistrationSerializer
from authentication.serializers import UserSerializer
from bus.models import Ride
from bus.models import Route
from bus.serializers import LocationSerializer
from bus.models import Bus
from bus.serializers import BusSerializer
from bus.serializers import RouteSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator

from bus.models import Location

from .models import Child, JoinBusLocation, Profile
from authentication.models import User
import requests

class ChildSerializer(serializers.ModelSerializer):
    
    user = RegistrationSerializer()
    start_location = LocationSerializer()
    end_location = LocationSerializer()
    parent = serializers.PrimaryKeyRelatedField(read_only=True)
    buses = serializers.SerializerMethodField()

    class Meta:
        model =  Child
        fields = ['user','start_location','end_location','parent','buses']

    # create new child with user data
    def create(self, validated_data):
        user_data= validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        
        start_location = validated_data.pop('start_location')
        start_obj = Location.objects.filter(eircode=start_location.get('eircode')).first()
        try:
            if start_obj is None:
                res = requests.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query="+start_location.get('eircode')+"&key=AIzaSyCBiU4oYll98xI7IocNOONCCgvkJr3dTZA").json()
                start_geo = res['results'][0]['geometry']['location']
                start_obj = Location.objects.create(latitude = start_geo['lat'],longitude = start_geo['lng'],eircode=start_location.get('eircode'))

            end_location = validated_data.pop('end_location')
            end_obj = Location.objects.filter(eircode=end_location.get('eircode')).first()
            if end_obj is None:
                res = requests.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query="+end_location.get('eircode')+"&key=AIzaSyCBiU4oYll98xI7IocNOONCCgvkJr3dTZA").json()
                end_geo = res['results'][0]['geometry']['location']
                end_obj = Location.objects.create(latitude = end_geo['lat'],longitude = end_geo['lng'],eircode=end_location.get('eircode'))
        except Exception as e:
            return None
        return Child.objects.create(user=user,start_location=start_obj, end_location = end_obj, **validated_data)

    def get_buses(self,obj):
        buses = JoinBusLocation.objects.filter(child=obj.user).values_list('route__bus_id','route__bus__bus_name').distinct()
        out = []

        for bus in buses:
            out.append({
                "bus_id":bus[0],
                "bus_name":bus[1],
            })
        return out


class ChildListSerializer(serializers.ModelSerializer):
    
    user = UserSerializer()
    start_location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())
    end_location = LocationSerializer()
    parent = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model =  Child
        fields = ['user','start_location','end_location','parent']

class ProfileSerializer(serializers.ModelSerializer):

    telephone_no1 = serializers.CharField( max_length=10,required=True)
    telephone_no2 = serializers.CharField( max_length=10)
    address = serializers.CharField( max_length=200,required=True)
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['telephone_no1','telephone_no2','address','user']

class JoinLocationSerializer(serializers.ModelSerializer):
    join_location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())
    route = serializers.PrimaryKeyRelatedField(queryset=Route.objects.all())

    class Meta:
        model = JoinBusLocation
        fields = ['route','join_location']


class ChildRideSerializer(serializers.ModelSerializer):
    
    active_ride = serializers.SerializerMethodField() #if null no active ride
    child = serializers.SerializerMethodField() 
    bus = serializers.SerializerMethodField() 

    class Meta:
        model = JoinBusLocation
        fields = ['route','child','active_ride','bus']

    def get_bus(self, instance):
        return instance.route.bus_id

    def get_active_ride(self, instance):
        ride = Ride.objects.filter(route=instance.route, end__isnull=True).last()
        return ride.ride_id if ride else None

    def get_child(self, instance):
        child = Child.objects.get(user = instance.child)
        return {
            "child_id":child.user.id,
            "name":child.user.name,
            "school":child.end_location.location_name,
            "join_location": LocationSerializer(instance.join_location).data,
            "start_location": LocationSerializer(child.start_location).data,
            "end_location": LocationSerializer(child.end_location).data
        }

