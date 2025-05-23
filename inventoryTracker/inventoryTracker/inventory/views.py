from django.shortcuts import render
from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated

from inventoryTracker.inventory.models import Product, Category, Manufacturer, Warehouse, Shelf, Vendor
from inventoryTracker.inventory.serializers import ProductSerializer, CategorySerializer, ManufacturerSerializer, \
    WareHouseSerializer, ShelfSerializer, VendorSerializer


def index(request):
    return render(request, 'index.html')


def products_view(request):
    return render(request, 'products.html')


def warehouse_view(request):
    return render(request, 'warehouses.html')


class WareHouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WareHouseSerializer


class ShelfViewSet(viewsets.ModelViewSet):
    queryset = Shelf.objects.all()
    serializer_class = ShelfSerializer


class VendorViewSet(viewsets.ModelViewSet):
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vendor.objects.filter(user=self.request.user)


class ManufacturerViewSet(viewsets.ModelViewSet):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.none()

    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        vendor_ids = self.request.data.get('vendor', [])
        product = serializer.save(user=self.request.user)

        # Convert vendor IDs to integers if they're strings
        if vendor_ids:
            try:
                vendor_ids = [int(vid) for vid in vendor_ids]
                product.vendor.set(vendor_ids)
            except (ValueError, TypeError) as e:
                raise serializers.ValidationError({'vendor': 'Invalid vendor IDs'})

    def perform_update(self, serializer):
        vendor_ids = self.request.data.get('vendor', [])
        product = serializer.save()

        if 'vendor' in self.request.data:
            try:
                vendor_ids = [int(vid) for vid in vendor_ids]
                product.vendor.set(vendor_ids)
            except (ValueError, TypeError) as e:
                raise serializers.ValidationError({'vendor': 'Invalid vendor IDs'})
