from django.db import models
from django.contrib.auth.models import User


GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
]

ENROLLMENT_STATUS = [
    ('active', 'Active'),
    ('completed', 'Completed'),
    ('dropped', 'Dropped'),
    ('inactive', 'Inactive'),  
]

class HealthProgram(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Client(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    national_id = models.CharField(max_length=20, unique=True, null=True, blank=True)  # Optional and Unique
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    contact_number = models.CharField(max_length=15)
    address = models.TextField()
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clients')
    date_registered = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Enrollment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    program = models.ForeignKey(HealthProgram, on_delete=models.CASCADE)
    enrolled_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=ENROLLMENT_STATUS, default='active')

    class Meta:
        unique_together = ('client', 'program')  # Prevent multiple enrollments in the same program

    def __str__(self):
        return f"{self.client} - {self.program} - {self.status}"
