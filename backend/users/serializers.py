from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserProfileDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('address', 'phone_number')

class UserProfileSerializer(serializers.ModelSerializer):
    address = serializers.CharField(source='profile.address', allow_blank=True, required=False)
    phone_number = serializers.CharField(source='profile.phone_number', allow_blank=True, required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'address', 'phone_number']
        read_only_fields = ['id', 'username', 'email']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        address = profile_data.get('address', instance.address)
        phone_number = profile_data.get('phone_number', instance.phone_number)

        instance.address = address
        instance.phone_number = phone_number
        instance.save()
        return instance
        
def get_queryset(self):
    return User.objects.prefetch_related('profile')