from django.shortcuts import render
from rest_framework import viewsets
from inventoryTracker.inventory.models import Product
from inventoryTracker.inventory.serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


def index(request):
    return render(request, 'index.html')
