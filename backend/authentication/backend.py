import jwt

from django.conf import settings

from rest_framework import authentication, exceptions

from .models import User


class JWTAuthentication(authentication.BaseAuthentication):

    authentication_header_prefix = 'Token'

    # called by every request
    def authenticate(self, request):

        # return None if there's no token in the headers
        # return user+token if authentication is successful
        # else raise AuthenticationFailed execption, Django Rest Framework handles it

        request.user = None

        # auth_header : array with two elements 
        # 1) the name of the authentication header (Token) 
        # 2) the encode JWT token
        auth_header = authentication.get_authorization_header(request).split()
        auth_header_prefix = self.authentication_header_prefix.lower()

        if not auth_header:
            return None

        # invalid header if contains one value
        if len(auth_header) == 1:
            return None

        #invalid header if more than 2 values
        elif len(auth_header) > 2:
            return None

        prefix = auth_header[0].decode('utf-8')
        token = auth_header[1].decode('utf-8')

        # incorrect authentication header prefix(!=token)
        if prefix.lower() != auth_header_prefix:
            return None

        return self._authenticate_credentials(request, token)

    def _authenticate_credentials(self, request, token):
        
        # If successful return the user and token
        # else throw an error.

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except:
            msg = 'Invalid authentication. Could not decode token.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = User.objects.get(pk=payload['id'])
        except User.DoesNotExist:
            msg = 'No user matching this token was found.'
            raise exceptions.AuthenticationFailed(msg)

        if not user.is_active:
            msg = 'This user has been deactivated.'
            raise exceptions.AuthenticationFailed(msg)

        return (user, token)


from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password

class AdminBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        user = self.get_user(username)
        if user:
            check_password(user.password,password)
            return user
        return None

    def get_user(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None