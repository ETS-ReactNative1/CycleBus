from django.urls import re_path
from .views import (
    LocationAPIView, BusAPIView, RouteAPIView, RideAPIView
)

app_name = 'bus'
urlpatterns = [
    re_path('location', LocationAPIView.as_view()),
    re_path(r'^bus/$', BusAPIView.as_view()),
    re_path(r'^bus/(?P<id>\d+)/$', BusAPIView.as_view()),
    re_path(r'^bus/(?P<id>\d+)/route/$', RouteAPIView.as_view()),
    re_path(r'^ride/$', RideAPIView.as_view()),
   
]