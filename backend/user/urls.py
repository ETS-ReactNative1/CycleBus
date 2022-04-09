from django.urls import re_path

from .views import (
    ChildAPIView,
    ChildBusAPIView,
    ChildRideView,
    JoinLocationApiView,
    ProfileAPIView
)

app_name = 'user'
urlpatterns = [
    re_path(r'^child/$', ChildAPIView.as_view()),
    re_path(r'^child/(?P<id>\d+)/$', ChildAPIView.as_view()),
    re_path(r'^child/(?P<id>\d+)/bus/$', ChildBusAPIView.as_view()),
    re_path(r'^child/(?P<id>\d+)/join/$', JoinLocationApiView.as_view()),
    re_path(r'^profile/(?P<id>\d+)/$', ProfileAPIView.as_view()),
    re_path(r'^profile/$', ProfileAPIView.as_view()),
    re_path(r'^rides/$', ChildRideView.as_view()),
]