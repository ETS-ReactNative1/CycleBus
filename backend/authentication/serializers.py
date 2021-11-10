from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

# called by RegistrationAPIView
class RegistrationSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    # Avoid sending token along with registration request
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User

        # fields in a request
        fields = ['email', 'username', 'password', 'token']

    # create new user
    def create(self, validated_data):
       
        return User.objects.create_user(**validated_data)

# called by LoginAPIView
class LoginSerializer(serializers.Serializer):

    email = serializers.CharField(max_length=255)
    username = serializers.CharField(max_length=255, read_only=True)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    # matching against the database against registered credentials
    def validate(self, data):

        email = data.get('email', None)
        password = data.get('password', None)

        if email is None:
            raise serializers.ValidationError(
                'An email address is required to log in.'
            )

        if password is None:
            raise serializers.ValidationError(
                'A password is required to log in.'
            )

        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError(
                'A user with this email and password was not found.'
            )

        # checking whether user is active
        if not user.is_active:
            raise serializers.ValidationError(
                'This user has been deactivated.'
            )

        return {
            'email': user.email,
            'username': user.username,
            'token': user.token
        }

# called by UserRetrieveUpdateAPIView
class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'token',)
        read_only_fields = ('token','email')


    # update user
    def update(self, instance, validated_data):
        
        password = validated_data.pop('password', None)

        for (key, value) in validated_data.items():

            # set validated data to user
            setattr(instance, key, value)

        if password is not None:
          
            # set password separately
            instance.set_password(password)

        # save the model
        instance.save()

        return instance