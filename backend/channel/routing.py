from django.urls import re_path
from .consumers import WSConsumer

websocket_urlpatterns = {
    re_path(r'^ws/ride/(?P<id>\d+)/$', WSConsumer.as_asgi())

}