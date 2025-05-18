from rest_framework import serializers
from inventoryTracker.inventory.models import OENumber, Product


class OENumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = OENumber
        fields = ['number']


class ProductSerializer(serializers.ModelSerializer):
    oe_numbers = OENumberSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
