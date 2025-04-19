from django.urls import path
from . import views

urlpatterns = [
   path('', views.CartItemList.as_view(), name='cart-item-list'),
   path('<int:pk>/', views.CartItemDetail.as_view(), name='cart-item-detail'),
]