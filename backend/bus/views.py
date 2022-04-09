from tracemalloc import start
from django.utils import timezone
from django.shortcuts import render
from bus.models import Attendance
from user.views import JoinLocationApiView
from user.models import JoinBusLocation
from user.models import Child
from bus.models import Route, RouteIndex,Ride
from bus.models import Bus
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import Group
from django.http import Http404

from .serializers import(
    AttendenceSerializer, LocationSerializer, BusSerializer, MarshalBusSerializer, RouteIndexSerializer, RouteSerializer, RouteViewSerializer, RideSerializer
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
        start = request.query_params.get('start',None)
        end = request.query_params.get('end',None)
        if id:
            bus = Bus.objects.get(bus_id=id)
            serializer = BusSerializer(bus)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        bus_list = Bus.objects.all()
       
        serializer = BusSerializer(bus_list, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

class RouteAPIView(APIView):


    def get(self, request, id, rid):
        route = Route.objects.get(bus_id = id, route_id =rid)
        locs = RouteIndex.objects.filter(route_id = rid).order_by('index')
        locations_ser = RouteIndexSerializer(locs, many=True)
        serializer = RouteSerializer(route)

        res = serializer.data
        res['locations'] = locations_ser.data
        return Response(res, status=status.HTTP_200_OK)

    def list(self, request, id):
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

    permission_classes = (IsAuthenticated,)

    def get(self, request, id):
        rides = Ride.objects.get(ride_id = id)
        child_id = request.query_params.get('child',None)

        serializer = RideSerializer(rides,context = {'child':child_id})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        ride= request.data.get('ride', {})
        serializer = self.serializer_class(data=ride)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(marshal= request.user)
        route = Route.objects.get(route_id =obj.route_id) 
        routeSerializer = RouteViewSerializer(route)
        return Response({"ride_id":obj.ride_id,"route":routeSerializer.data}, status=status.HTTP_201_CREATED)

    def put(self, request, id):
        ride = Ride.objects.get(ride_id = id)
        ride.end=timezone.now()
        ride.save()
        return Response("success", status=status.HTTP_201_CREATED)


class MartialChildAPIView(APIView):
    # permission_classes = (IsAuthenticated,) #TODO: IsMartial with permission
    serializer_class = MarshalBusSerializer

    def get(self, request, rid, lid):
        ride_id = request.query_params.get('ride',None)
        children = JoinBusLocation.objects.filter(route_id = rid, join_location_id=lid)
        serializer = self.serializer_class(children, many=True, context={'ride_id':ride_id})
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
            
class MarshalBusAPIView(APIView):
    
    serializer_class =BusSerializer

    def get(self, request, id=None):
        current_user = request.user
        bus_list = Bus.objects.filter(default_marshal_id=current_user.id)
        serializer = BusSerializer(bus_list, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

class AttendenceApiView(APIView):
    serializer_class =AttendenceSerializer

    def put(self, request, id):
        try:
            ride = Ride.objects.get(ride_id=id)

            for child in request.data.get("attendence",[]):
                attendee = child.pop('attendee',None)
                try:
                    JoinBusLocation.objects.get(route_id =ride.route_id, child_id=attendee )
                    if request.user.id ==  ride.marshal_id:
                        child['join_date_time'] = timezone.now()

                    obj, created = Attendance.objects.get_or_create(ride=ride, attendee_id=attendee) 
                    serializer = self.serializer_class(obj, child, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                except JoinBusLocation.DoesNotExist:
                    raise Http404("User is not registered.")

            return Response("success", status=status.HTTP_201_CREATED)
        except Ride.DoesNotExist:
            raise Http404("Ride not found")
