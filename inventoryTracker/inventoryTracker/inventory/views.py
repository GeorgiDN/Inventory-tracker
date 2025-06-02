from django.shortcuts import render
from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from inventoryTracker import settings
from inventoryTracker.inventory.models import Product, Category, Manufacturer, Warehouse, Shelf, Vendor
from inventoryTracker.inventory.serializers import ProductSerializer, CategorySerializer, ManufacturerSerializer, \
    WareHouseSerializer, ShelfSerializer, VendorSerializer

from django.contrib.auth.decorators import login_required


def index(request):
    return render(request, 'index.html', {
        'api_url_base': settings.API_BASE_URL
    })


@login_required
def products_view(request):
    context = {'api_url_base': settings.API_BASE_URL}
    return render(request, 'products.html', context)


@login_required
def warehouse_view(request):
    context = {'api_url_base': settings.API_BASE_URL}
    return render(request, 'warehouses.html', context)


@login_required
def shelves_view(request):
    context = {'api_url_base': settings.API_BASE_URL}
    return render(request, 'shelf.html', context)


@login_required
def vendors_view(request):
    context = {'api_url_base': settings.API_BASE_URL}
    return render(request, 'vendors.html', context)


@login_required
def manufacturer_view(request):
    context = {'api_url_base': settings.API_BASE_URL}
    return render(request, 'manufacturers.html', context)


@login_required
def category_view(request):
    context = {'api_url_base': settings.API_BASE_URL}
    return render(request, 'categories.html', context)


class WareHouseViewSet(viewsets.ModelViewSet):
    serializer_class = WareHouseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Warehouse.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShelfViewSet(viewsets.ModelViewSet):
    serializer_class = ShelfSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Shelf.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        warehouse_id = self.request.data.get('warehouse')
        try:
            warehouse = Warehouse.objects.get(id=warehouse_id, user=self.request.user)
            serializer.save(user=self.request.user, warehouse=warehouse)
        except Warehouse.DoesNotExist:
            raise serializers.ValidationError({'warehouse': 'Invalid warehouse selection'})

    def perform_update(self, serializer):
        warehouse_id = self.request.data.get('warehouse')
        try:
            warehouse = Warehouse.objects.get(id=warehouse_id, user=self.request.user)
            serializer.save(warehouse=warehouse)
        except Warehouse.DoesNotExist:
            raise serializers.ValidationError({'warehouse': 'Invalid warehouse selection'})


class VendorViewSet(viewsets.ModelViewSet):
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vendor.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ManufacturerViewSet(viewsets.ModelViewSet):
    serializer_class = ManufacturerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Manufacturer.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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

    @action(detail=False, methods=['post'])
    def bulk_assign_category(self, request):
        product_ids = request.data.get('product_ids', [])
        category_id = request.data.get('category_id')

        if not product_ids or not category_id:
            return Response({'error': 'product_ids and category_id are required'}, status=400)

        try:
            category = Category.objects.get(id=category_id, user=request.user)
            products = Product.objects.filter(id__in=product_ids, user=request.user)
            updated_count = products.update(category=category)
            return Response({'success': f'Updated {updated_count} products'})
        except Category.DoesNotExist:
            return Response({'error': 'Category not found or not owned by user'}, status=404)

    @action(detail=False, methods=['post'])
    def bulk_remove_category(self, request):
        product_ids = request.data.get('product_ids', [])

        if not product_ids:
            return Response({'error': 'product_ids are required'}, status=400)

        products = Product.objects.filter(id__in=product_ids, user=request.user)
        updated_count = products.update(category=None)
        return Response({'success': f'Removed category from {updated_count} products'})

    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        product_ids = request.data.get('product_ids', [])

        if not product_ids:
            return Response({'error': 'product_ids are required'}, status=400)

        products = Product.objects.filter(id__in=product_ids, user=request.user)
        count = products.count()
        products.delete()
        return Response({'success': f'Deleted {count} products'})

    @action(detail=False, methods=['post'])
    def bulk_assign_warehouse(self, request):
        product_ids = request.data.get('product_ids', [])
        warehouse_id = request.data.get('warehouse_id')

        if not product_ids or not warehouse_id:
            return Response({'error': 'product_ids and warehouse_id are required'}, status=400)

        try:
            warehouse = Warehouse.objects.get(id=warehouse_id, user=request.user)
            products = Product.objects.filter(id__in=product_ids, user=request.user)
            updated_count = products.update(warehouse=warehouse)
            return Response({'success': f'Updated {updated_count} products'})
        except Warehouse.DoesNotExist:
            return Response({'error': 'Warehouse not found or not owned by user'}, status=404)

    @action(detail=False, methods=['post'])
    def bulk_remove_warehouse(self, request):
        product_ids = request.data.get('product_ids', [])

        if not product_ids:
            return Response({'error': 'product_ids are required'}, status=400)

        products = Product.objects.filter(id__in=product_ids, user=request.user)
        updated_count = products.update(warehouse=None)
        return Response({'success': f'Removed warehouse from {updated_count} products'})

    @action(detail=False, methods=['post'])
    def bulk_assign_shelf(self, request):
        product_ids = request.data.get('product_ids', [])
        shelf_id = request.data.get('shelf_id')

        if not product_ids or not shelf_id:
            return Response({'error': 'product_ids and shelf_id are required'}, status=400)

        try:
            shelf = Shelf.objects.get(id=shelf_id, user=request.user)
            products = Product.objects.filter(id__in=product_ids, user=request.user)
            updated_count = products.update(shelf=shelf)
            return Response({'success': f'Updated {updated_count} products'})
        except Shelf.DoesNotExist:
            return Response({'error': 'Shelf not found or not owned by user'}, status=404)

    @action(detail=False, methods=['post'])
    def bulk_remove_shelf(self, request):
        product_ids = request.data.get('product_ids', [])

        if not product_ids:
            return Response({'error': 'product_ids are required'}, status=400)

        products = Product.objects.filter(id__in=product_ids, user=request.user)
        updated_count = products.update(shelf=None)
        return Response({'success': f'Removed shelf from {updated_count} products'})

    @action(detail=False, methods=['post'])
    def bulk_assign_manufacturer(self, request):
        product_ids = request.data.get('product_ids', [])
        manufacturer_id = request.data.get('manufacturer_id')

        if not product_ids or not manufacturer_id:
            return Response({'error': 'product_ids and manufacturer_id are required'}, status=400)

        try:
            manufacturer = Manufacturer.objects.get(id=manufacturer_id, user=request.user)
            products = Product.objects.filter(id__in=product_ids, user=request.user)
            updated_count = products.update(manufacturer=manufacturer)
            return Response({'success': f'Updated {updated_count} products'})
        except Manufacturer.DoesNotExist:
            return Response({'error': 'Manufacturer not found or not owned by user'}, status=404)

    @action(detail=False, methods=['post'])
    def bulk_remove_manufacturer(self, request):
        product_ids = request.data.get('product_ids', [])

        if not product_ids:
            return Response({'error': 'product_ids are required'}, status=400)

        products = Product.objects.filter(id__in=product_ids, user=request.user)
        updated_count = products.update(manufacturer=None)
        return Response({'success': f'Removed manufacturer from {updated_count} products'})

    @action(detail=False, methods=['post'])
    def bulk_assign_vendor(self, request):
        product_ids = request.data.get('product_ids', [])
        vendor_id = request.data.get('vendor_id')

        if not product_ids or not vendor_id:
            return Response({'error': 'product_ids and vendor_id are required'}, status=400)

        try:
            products = Product.objects.filter(id__in=product_ids, user=request.user)
            vendor = Vendor.objects.get(id=vendor_id, user=request.user)

            for product in products:
                product.vendor.add(vendor)

            return Response({'success': f'Added vendor to {len(products)} products'})
        except Vendor.DoesNotExist:
            return Response({'error': 'Vendor not found or not owned by user'}, status=404)

    @action(detail=False, methods=['post'])
    def bulk_remove_vendor(self, request):
        product_ids = request.data.get('product_ids', [])
        vendor_id = request.data.get('vendor_id')

        if not product_ids or not vendor_id:
            return Response({'error': 'product_ids and vendor_id are required'}, status=400)

        try:
            products = Product.objects.filter(id__in=product_ids, user=request.user)
            vendor = Vendor.objects.get(id=vendor_id, user=request.user)

            for product in products:
                product.vendor.remove(vendor)

            return Response({'success': f'Removed vendor from {len(products)} products'})
        except Vendor.DoesNotExist:
            return Response({'error': 'Vendor not found or not owned by user'}, status=404)
