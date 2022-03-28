from django.shortcuts import render
from bus.models import Bus
from .serializers import BusSerializer
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
        return Response("Success", status=status.HTTP_201_CREATED)

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


