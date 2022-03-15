from django.shortcuts import render

from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import Group

from .serializers import(
    RegistrationSerializer,LoginSerializer, UserSerializer,
)

class RegistrationAPIView(APIView):
    # AllowAny : allow all users authenticated or not
    serializer_class = RegistrationSerializer

    def post(self, request):
        user = request.data.get('user', {})
        #role = user.pop('role','parent')

        # Create serializer, validate serializer, save serializer 
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        user=serializer.save()

        #group, is_created = Group.objects.get_or_create()
        #group.user_set.add(user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LoginAPIView(APIView):

    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        user = request.data.get('user', {})

        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):

    # Allow only authenticated users
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def retrieve(self, request):

        # format user object
        serializer = self.serializer_class(request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request):

        serializer_data = request.data.get('user', {})
        
        serializer = self.serializer_class(
            request.user, data=serializer_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):

    # Allow only authenticated users
    # permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def retrieve(self, request):

        # format user object
        serializer = self.serializer_class(request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request):

        serializer_data = request.data.get('user', {})
        
        serializer = self.serializer_class(
            request.user, data=serializer_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)