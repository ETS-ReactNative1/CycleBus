from django.shortcuts import render
from bus.models import Route, RouteIndex,Ride
from bus.models import Bus
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import Group

from .serializers import(
    LocationSerializer, BusSerializer, RouteSerializer, RouteViewSerializer, RideSerializer
)

class LocationAPIView(APIView):
    
    serializer_class =LocationSerializer

    def post(self, request):
        location= request.data.get('location', {})
        #role = user.pop('role','parent')

        # Create serializer, validate serializer, save serializer 
        serializer = self.serializer_class(data=location)
        serializer.is_valid(raise_exception=True)
        location=serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class BusAPIView(APIView):
    
    serializer_class =BusSerializer

    def post(self, request):
        bus= request.data.get('bus', {})
        #role = user.pop('role','parent')

        # Create serializer, validate serializer, save serializer 
        serializer = self.serializer_class(data=bus)
        serializer.is_valid(raise_exception=True)
        bus_obj=serializer.save()

        return Response({"bus_id":bus_obj.bus_id}, status=status.HTTP_201_CREATED)

    def get(self, request, id=None):
        if id:
            bus = Bus.objects.get(bus_id=id)
            serializer = BusSerializer(bus)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        bus_list = Bus.objects.all()
        serializer = BusSerializer(bus_list, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

class RouteAPIView(APIView):
    serializer_class =RouteSerializer


    def get(self, request, id):
        routes = Route.objects.filter(bus_id = id)
        serializer = RouteViewSerializer(routes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, id):
        route= request.data.get('route', {})
        serializer = self.serializer_class(data=route)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(bus_id=id)
        return Response({"route_id":obj.pk}, status=status.HTTP_201_CREATED)

class RideAPIView(APIView):
    serializer_class =RideSerializer


    def get(self, request, id):
        routes = Ride.objects.filter(ride_id = id)
        serializer = RideSerializer(routes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        ride= request.data.get('ride', {})
        serializer = self.serializer_class(data=ride)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(marshal_id= request.user.id)
        return Response({"ride_id":obj.pk}, status=status.HTTP_201_CREATED)

