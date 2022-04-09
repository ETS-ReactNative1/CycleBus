from user.models import Profile
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator



from .models import User

# called by RegistrationAPIView
class RegistrationSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    name= serializers.CharField(
        max_length=128,
        required=True
    )
    username= serializers.CharField(
        max_length=128,
        required=True
    )
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True,
        required=True
    )

    password2 = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True,
        required=True
    )

    # Avoid sending token along with registration request
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User

        # fields in a request
        fields = ['name', 'email', 'username', 'password','password2','token']

        extra_kwargs = {
            'name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields do not match."})

        return attrs

    # create new user
    def create(self, validated_data):
       
        user=User.objects.create_user(**validated_data)
        Profile.objects.create(user=user)
        return user
        

# called by LoginAPIView
class LoginSerializer(serializers.Serializer):

    email = serializers.CharField(max_length=255)
    username = serializers.CharField(max_length=255, read_only=True)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)
    groups = serializers.CharField(max_length=255, read_only=True)
    name = serializers.CharField(max_length=255, read_only=True)



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
            'token': user.token,
            'groups':user.groups,
            'name':user.name
        }

# called by UserRetrieveUpdateAPIView
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id','name','email', 'username')


