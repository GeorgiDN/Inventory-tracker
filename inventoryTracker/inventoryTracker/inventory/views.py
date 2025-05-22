from django.shortcuts import render
from rest_framework import viewsets
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
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer


class ManufacturerViewSet(viewsets.ModelViewSet):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        vendor_ids = self.request.data.get('vendor', [])
        product = serializer.save()
        if vendor_ids:
            product.vendor.set(vendor_ids)

    def perform_update(self, serializer):
        vendor_ids = self.request.data.get('vendor', [])
        product = serializer.save()
        if 'vendor' in self.request.data:
            product.vendor.set(vendor_ids)
