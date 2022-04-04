from django.urls import re_path
from .views import (
    LocationAPIView, BusAPIView, MartialChildAPIView, RouteAPIView, RideAPIView,RideAPIView, MarshalBusAPIView
)

app_name = 'bus'
urlpatterns = [
    re_path('location', LocationAPIView.as_view()),
    re_path(r'^bus/$', BusAPIView.as_view()),
    re_path(r'^marshal_bus/$', MarshalBusAPIView.as_view()),
    re_path(r'^bus/(?P<id>\d+)/$', BusAPIView.as_view()),
    re_path(r'^bus/(?P<id>\d+)/route/$', RouteAPIView.as_view()),
    re_path(r'^bus/(?P<id>\d+)/children/$', MartialChildAPIView.as_view()),
    re_path(r'^bus/(?P<id>\d+)/route/(?P<rid>\d+)$', RouteAPIView.as_view()),
    re_path(r'^ride/$', RideAPIView.as_view()),
    re_path(r'^ride/(?P<id>\d+)/end/$', RideAPIView.as_view()),
   
]