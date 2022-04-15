import cProfile
from django.shortcuts import render
from authentication.models import User
from bus.models import RouteIndex
from user.models import JoinBusLocation
from bus.serializers import RideSerializer
from user.models import Parent
from user.models import Profile
from bus.models import Bus
from .serializers import BusSerializer, ChildRideSerializer, JoinLocationSerializer, ProfileSerializer
from user.models import Child
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import Group
from django.http import Http404

from .serializers import(
    ChildSerializer,ChildListSerializer
)
from rest_framework.permissions import AllowAny, IsAuthenticated

class ChildAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ChildSerializer

    def post(self, request):
        child = request.data.get('child', {})
        serializer = self.serializer_class(data=child)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(parent=self.request.user)
        if user:
            return Response("Success", status=status.HTTP_201_CREATED)
        else:
            return Response("Invalid data", status=status.HTTP_400_BAD_REQUEST)
            


    def put(self, request,  id):
        try:
            child = request.data.get('child', {})
            child.pop('user',"")

            childObj = Child.objects.get(user_id=id)   
            serializer = ChildSerializer(childObj, child, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
    
        except Child.DoesNotExist:
            raise Http404("User does not exist")

    def get(self, request, id=None):
        if id:
            try:
                child = Child.objects.get(user_id=id) 
            except Child.DoesNotExist:
                raise Http404("User does not exist")

            serializer = ChildSerializer(child)
            return Response({ "child": serializer.data}, status=status.HTTP_200_OK)


        children = Child.objects.filter(parent_id=request.user.id)
        serializer = ChildListSerializer(children, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


        
class ChildBusAPIView(APIView):
    
    serializer_class = BusSerializer
    
    def get(self, request, id=None):
        buses = Child.objects.get(user_id=id).registered_buses.all()
        serializer = BusSerializer(buses, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

class ProfileAPIView(APIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer

    def post(self, request,  id):
        try:
            profile = request.data.get('profile', {})
            profile.pop('user',"")

            profileObj = Profile.objects.get(user_id=id)   
            serializer = ProfileSerializer(profileObj, profile, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
    
        except Profile.DoesNotExist:
            raise Http404("User does not exist")

    def get(self, request):
        profile = Profile.objects.get(user_id=request.user.id)
        serializer = ProfileSerializer(profile)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

class JoinLocationApiView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = JoinLocationSerializer

    def post(self, request, id):
        location = request.data.get('locations', {})
        serializer = self.serializer_class(data=location, many=True)
        serializer.is_valid(raise_exception=True)
        child = User.objects.get(id=id)
        join_data = serializer.save(child=child)

        #enable join locations in the routes-- view for marshal
        for data in join_data:
            RouteIndex.objects.filter(route_id=data.route_id,location_id=data.join_location_id).update(is_join_location=True)
        return Response("Success", status=status.HTTP_201_CREATED)


class ChildRideView(APIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = ChildRideSerializer

    def get(self, request):
        children = Child.objects.filter(parent_id=request.user.id).values_list('user_id',flat=True)
        childRoute = JoinBusLocation.objects.filter(child_id__in=children)
        serializer = self.serializer_class(childRoute, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

