from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventoryTracker.inventory.views import ProductViewSet, products_view, warehouse_view, CategoryViewSet, \
    ManufacturerViewSet, WareHouseViewSet, ShelfViewSet, VendorViewSet, index, vendors_view, manufacturer_view, \
    category_view, shelves_view, export_products_to_excel, import_products

router = DefaultRouter()
router.register(r'warehouses', WareHouseViewSet, basename='warehouse')
router.register(r'shelves', ShelfViewSet, basename='shelf')
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'manufacturers', ManufacturerViewSet, basename='manufacturer')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('api/', include(router.urls)),
    path('', index, name='index'),
    path('products/', products_view, name='products'),
    path('warehouse/', warehouse_view, name='warehouses'),
    path('shelves/', shelves_view, name='shelves'),
    path('vendors/', vendors_view, name='vendors'),
    path('manufacturers/', manufacturer_view, name='manufacturers'),
    path('categories/', category_view, name='categories'),
    path('products/export/', export_products_to_excel, name='export_products'),
    path('products/import/', import_products, name='import_products'),
]

