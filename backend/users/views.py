from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import login, logout
from .serializers import UserSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model
from .models import UserProfile  # Asegúrate de importar UserProfile

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            try:
                UserProfile.objects.create(user=user)
            except Exception as e:
                print(f"Error al crear UserProfile: {e}")
                # Considerar retornar un error específico aquí si es crítico
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'detail': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Sesión cerrada exitosamente'})

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        try:
            return UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            # Esto NO debería ocurrir si se crea el UserProfile al registrarse
            # Pero, por si acaso, lo manejamos correctamente
            return Response({'detail': 'Perfil de usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        try:
            instance = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            # Esto NO debería ocurrir si se crea el UserProfile al registrarse
            # Pero, por si acaso, lo manejamos correctamente
            return Response({'detail': 'Perfil de usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)