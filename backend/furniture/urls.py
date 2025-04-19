from django.urls import path
from . import views

urlpatterns = [
    path('', views.FurnitureList.as_view(), name='furniture-list'),  # Cambia 'furniture/' a ''
    path('furniture/<int:pk>/', views.FurnitureDetail.as_view(), name='furniture-detail'),
    path('categories/', views.CategoryList.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetail.as_view(), name='category-detail'),
]