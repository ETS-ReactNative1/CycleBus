from django.urls import path
from .consumers import WSConsumer

websocket_urlpatterns = {
    path('ws/bus/',WSConsumer.as_asgi()),
}