from django.urls import re_path

from .views import (
    RegistrationAPIView, LoginAPIView, UserRetrieveUpdateAPIView
)

app_name = 'authentication'
urlpatterns = [
    re_path('user', UserRetrieveUpdateAPIView.as_view()),
    # re_path('users/', RegistrationAPIView.as_view()),
    re_path('login/', LoginAPIView.as_view()),
    re_path(r'^register/$', RegistrationAPIView.as_view()),
]