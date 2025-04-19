from rest_framework import serializers
from .models import CartItem
from furniture.models import Furniture
from furniture.serializers import FurnitureSerializer

class CartItemSerializer(serializers.ModelSerializer):
    furniture = FurnitureSerializer(read_only=True)
    furniture_id = serializers.PrimaryKeyRelatedField(queryset=Furniture.objects.all(), write_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = CartItem
        fields = ('id', 'user', 'furniture', 'furniture_id', 'quantity')

    def validate(self, data):
        furniture_id = data.get('furniture_id')
        quantity = data.get('quantity')
        if furniture_id and quantity is not None and furniture_id.stock < quantity:
            raise serializers.ValidationError({"quantity": f"No hay suficiente stock disponible para {furniture_id.name}."})
        return data

    def create(self, validated_data):
        user = validated_data['user']
        furniture = validated_data['furniture_id']
        quantity = validated_data['quantity']

        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            furniture=furniture,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        return cart_item

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        furniture = validated_data.get('furniture_id', instance.furniture)
        if furniture.stock < instance.quantity:
            raise serializers.ValidationError({"quantity": f"No hay suficiente stock disponible para {furniture.name}."})
        instance.save()
        return instance