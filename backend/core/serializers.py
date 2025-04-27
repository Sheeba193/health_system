from rest_framework import serializers
from .models import Client, HealthProgram, Enrollment
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'first_name', 'last_name', 'national_id', 'date_of_birth', 'gender', 'contact_number', 'address', 'date_registered']
        read_only_fields = ['date_registered']  


class HealthProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthProgram
        fields = ['id', 'name', 'description']


class EnrollmentSerializer(serializers.ModelSerializer):
    client = ClientSerializer()
    program = HealthProgramSerializer()

    class Meta:
        model = Enrollment
        fields = ['client', 'program', 'status', 'enrolled_on']
        read_only_fields = ['enrolled_on']  

class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['client', 'program', 'status']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()