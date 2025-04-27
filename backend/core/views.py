from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status, permissions
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(username=serializer.validated_data['username'])
        if user.check_password(serializer.validated_data['password']):
            refresh = RefreshToken.for_user(user)
            return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            token = request.auth
            token.blacklist()  
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(doctor=request.user)  
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.filter(doctor=request.user)
        response = super().list(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        client = self.get_object()
        if client.doctor != request.user:
            return Response({"detail": "You do not have permission to view this client."}, status=status.HTTP_403_FORBIDDEN)
        response = super().retrieve(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.get('partial', False)
        client = self.get_object()
        if client.doctor != request.user:
            return Response({"detail": "You do not have permission to update this client."}, status=status.HTTP_403_FORBIDDEN)
        
        request.data['doctor'] = request.user.id
        serializer = self.get_serializer(client, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()  
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        client = self.get_object()
        if client.doctor != request.user:
            return Response({"detail": "You do not have permission to delete this client."}, status=status.HTTP_403_FORBIDDEN)
        
        response = super().destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='search')
    def search_clients(self, request):
        query = request.query_params.get('q')
        if not query:
            return Response(
                {"error": "Please provide a search query using '?q='."},
                status=status.HTTP_400_BAD_REQUEST
            )

        results = Client.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(national_id__icontains=query)
        )
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='profile')
    def get_profile(self, request, pk=None):
        try:
            client = self.get_object()
            client_data = self.get_serializer(client).data

            enrollments = Enrollment.objects.filter(client=client)
            enrollment_data = EnrollmentSerializer(enrollments, many=True).data

            profile = {
                'client': client_data,
                'enrollments': enrollment_data
            }

            return Response(profile, status=status.HTTP_200_OK)

        except Client.DoesNotExist:
            return Response({"detail": "Client not found."}, status=status.HTTP_404_NOT_FOUND)



class HealthProgramViewSet(viewsets.ModelViewSet):
    queryset = HealthProgram.objects.all()
    serializer_class = HealthProgramSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EnrollmentCreateSerializer
        return EnrollmentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)





class PublicClientProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, client_id):
        try:
            client = Client.objects.get(pk=client_id)
            client_data = ClientSerializer(client).data

            enrollments = Enrollment.objects.filter(client=client)
            enrollment_data = EnrollmentSerializer(enrollments, many=True).data

            profile = {
                "client": client_data,
                "enrollments": enrollment_data
            }

            return Response(profile, status=status.HTTP_200_OK)
        
        except Client.DoesNotExist:
            return Response({"error": "Client not found."}, status=status.HTTP_404_NOT_FOUND)
