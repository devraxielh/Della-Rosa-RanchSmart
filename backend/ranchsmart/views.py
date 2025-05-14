from django.shortcuts import render
from rest_framework import viewsets
from .models import Potrero, Pasto
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer,PotreroSerializer, PastoSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class PotreroViewSet(viewsets.ModelViewSet):
    queryset = Potrero.objects.all()
    serializer_class = PotreroSerializer

class PastoViewSet(viewsets.ModelViewSet):
    queryset = Pasto.objects.all()
    serializer_class = PastoSerializer