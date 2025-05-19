from django.contrib import admin
from .models import Product, Category, Vendor, Manufacturer, Warehouse, Shelf


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'quantity', 'category', 'warehouse', 'shelf', 'buy_price', 'sell_price')
    list_filter = ('category', 'warehouse', 'vendor')
    search_fields = ('name', 'sku', 'model')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    pass


@admin.register(Manufacturer)
class ManufacturerAdmin(admin.ModelAdmin):
    pass


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    pass


@admin.register(Shelf)
class ShelfAdmin(admin.ModelAdmin):
    pass
