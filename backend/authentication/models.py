from django.db import models

# stores the models that will be used for authentication
import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.db import models

# UserManager inherits BaseUserManager
class UserManager(BaseUserManager):

    # create user objects
    def create_user(self, username, email, password):

        if username is None:
            raise TypeError('User should have a username.')

        if email is None:
            raise TypeError('User should have an email address.')

        if password is None:
            raise TypeError('User should submit a password.')

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()

        return user
    #create super user
    def create_superuser(self, username, email, password):
       
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_admin = True
        user.save()

        return user

class User(AbstractBaseUser, PermissionsMixin):
    # username : Uniquely identify the user in UI
    username = models.CharField(db_index=True, max_length=255, unique=True)

    # email: Used to uniquely identify when logging
    email = models.EmailField(db_index=True, unique=True)

    # is_active : Used to activate, deactivate user 
    is_active = models.BooleanField(default=True)

    # is_admin : Used to control logging to Django Admin site
    is_admin = models.BooleanField(default=False)

    # created_at : created timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    # update_at : last updated timestamp
    updated_at = models.DateTimeField(auto_now=True)

    # USERNAME_FIELD : Field used when logging
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # UserManager class manage this type of objects
    objects = UserManager()

    #return type : String
    # return user, to display in UI
    def __str__(self):
       
        return self.email

    # token : dynamic property (can call user.token instead of user.generate_jwt_token())
    @property
    def token(self):
       
        return self._generate_jwt_token()

    def get_full_name(self):
        
        return self.username

    def get_short_name(self):
        
        return self.username

    def _generate_jwt_token(self):
        
        # toke is encoded with user id and a expiry date of 30 days
        dt = datetime.now() + timedelta(days=30)
        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.timestamp())
        }, settings.SECRET_KEY, algorithm='HS256')

        return token
