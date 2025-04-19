from django.shortcuts import render
from rest_framework import generics
from .models import Furniture, Category
from .serializers import FurnitureSerializer, CategorySerializer

class FurnitureList(generics.ListCreateAPIView):
    queryset = Furniture.objects.all()
    serializer_class = FurnitureSerializer

class FurnitureDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Furniture.objects.all()
    serializer_class = FurnitureSerializer

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

