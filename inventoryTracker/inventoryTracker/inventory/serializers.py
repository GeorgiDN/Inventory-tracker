from rest_framework import serializers
from inventoryTracker.inventory.models import OENumber, Product, Category, Manufacturer, Warehouse, Shelf, Vendor


class WareHouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name']


class ShelfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelf
        fields = ['id', 'name']


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['id', 'name']


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = ['id', 'name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class OENumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = OENumber
        fields = ['id', 'number']


class ProductSerializer(serializers.ModelSerializer):
    oe_numbers = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=OENumber.objects.all()
    )

    class Meta:
        model = Product
        fields = '__all__'
