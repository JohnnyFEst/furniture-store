from django.db import models
from django.contrib.auth import get_user_model
from furniture.models import Furniture

User = get_user_model()

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    furniture = models.ForeignKey(Furniture, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.furniture.name} en el carrito de {self.user.username}"

