from django.urls import re_path

from .views import (
    ChildAPIView,
    ChildBusAPIView
)

app_name = 'user'
urlpatterns = [
    re_path(r'^child/$', ChildAPIView.as_view()),
    re_path(r'^child/(?P<id>\d+)/$', ChildAPIView.as_view()),
    re_path(r'^child/(?P<id>\d+)/bus/$', ChildBusAPIView.as_view())

]