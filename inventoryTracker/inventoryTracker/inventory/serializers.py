from rest_framework import serializers
from inventoryTracker.inventory.models import Product, Category, Manufacturer, Warehouse, Shelf, Vendor


class WareHouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'location', 'user']
        read_only_fields = ('user',)


class ShelfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelf
        fields = ['id', 'name']


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['id', 'name', 'contact_info', 'user']
        read_only_fields = ('user',)


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = ['id', 'name', 'website']
        read_only_fields = ('user',)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        read_only_fields = ('user',)


class ProductSerializer(serializers.ModelSerializer):
    # For reading (display)
    vendor_details = VendorSerializer(many=True, read_only=True, source='vendor')
    category_name = serializers.CharField(source='category.name', read_only=True)
    manufacturer_name = serializers.CharField(source='manufacturer.name', read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    shelf_name = serializers.CharField(source='shelf.name', read_only=True)

    vendor = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Vendor.objects.all(),
        required=False
    )

    class Meta:
        model = Product
        fields = '__all__'
        extra_fields = ['vendor_details', 'category_name', 'manufacturer_name', 'warehouse_name', 'shelf_name']
        read_only_fields = ('user',)
