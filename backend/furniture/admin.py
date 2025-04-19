from django.contrib import admin
from .models import Furniture, Category

class FurnitureAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'image')
    search_fields = ('name', 'category__name')

admin.site.register(Furniture)
admin.site.register(Category)
