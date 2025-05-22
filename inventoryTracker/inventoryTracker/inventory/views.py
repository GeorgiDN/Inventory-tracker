from django.shortcuts import render
from rest_framework import viewsets
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
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer


class ManufacturerViewSet(viewsets.ModelViewSet):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        vendor_ids = self.request.data.get('vendor', [])

        # First save the product with the current user
        product = serializer.save(user=self.request.user)

        # Then handle the many-to-many relationship
        if vendor_ids:
            # Filter vendors to only those belonging to the current user
            valid_vendor_ids = self.request.user.vendors.filter(
                id__in=vendor_ids
            ).values_list('id', flat=True)
            product.vendor.set(valid_vendor_ids)

    def perform_update(self, serializer):
        vendor_ids = self.request.data.get('vendor', [])
        product = serializer.save()  # User can't be changed on update

        if 'vendor' in self.request.data:
            # Filter vendors to only those belonging to the current user
            valid_vendor_ids = self.request.user.vendors.filter(
                id__in=vendor_ids
            ).values_list('id', flat=True)
            product.vendor.set(valid_vendor_ids)
