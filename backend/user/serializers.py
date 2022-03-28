from pickle import TRUE
from xml.dom.domreg import registered
from authentication.serializers import RegistrationSerializer
from authentication.serializers import UserSerializer
from bus.serializers import LocationSerializer
from bus.models import Bus
from bus.serializers import BusSerializer
from bus.serializers import RouteSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator

from bus.models import Location

from .models import Child
from authentication.models import User

class ChildSerializer(serializers.ModelSerializer):
    
    user = RegistrationSerializer()
    start_location = LocationSerializer()
    end_location = LocationSerializer()
    join_location = LocationSerializer()
    parent = serializers.PrimaryKeyRelatedField(read_only=True)
    registered_buses = serializers.PrimaryKeyRelatedField(many=True,queryset=Bus.objects.all(), required=False)

    class Meta:
        model =  Child
        fields = ['user','start_location','end_location','join_location','parent','registered_buses']
        extra_kwargs = {'registered_buses': {'required': False}}

    # create new child with user data
    def create(self, validated_data):
        user_data= validated_data.pop('user')
        user = User.objects.create_user(**user_data)

        return Child.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        registered_buses = validated_data.pop('registered_buses', [])
        instance.registered_buses.add(*registered_buses)
        fields = ['start_location','end_location']
        for field in fields:
            try:
                setattr(instance, field, validated_data[field])
            except KeyError:  
                pass
        instance.save()
        return instance

    def to_representation(self, obj):
        data = super().to_representation(obj)
        buses = Bus.objects.filter(bus_id__in=data['registered_buses'])
        out = []
        for bus in buses:
            ride=bus.ride_bus.filter(end__isnull=True).last()
            out.append({
                "bus_id":bus.bus_id,
                "bus_name":bus.bus_name,
                "ride_id": ride.ride_id if ride else None,
                "route_id": ride.route_id if ride else None
            })
        data['registered_buses'] = out
        return data 



class ChildListSerializer(serializers.ModelSerializer):
    
    user = UserSerializer()
    start_location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())
    end_location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())
    parent = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model =  Child
        fields = ['user','start_location','end_location','parent']
