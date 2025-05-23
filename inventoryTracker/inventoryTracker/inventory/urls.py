from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventoryTracker.inventory.views import ProductViewSet, products_view, warehouse_view, CategoryViewSet, \
    ManufacturerViewSet, WareHouseViewSet, ShelfViewSet, VendorViewSet, index, vendors_view

router = DefaultRouter()
router.register(r'warehouses', WareHouseViewSet, basename='warehouse')
router.register(r'shelfs', ShelfViewSet)
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'manufacturers', ManufacturerViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('api/', include(router.urls)),
    path('', index, name='index'),
    path('products/', products_view, name='products_view'),
    path('warehouse/', warehouse_view, name='warehouse_view'),
    path('vendors/', vendors_view, name='vendors_view'),
]

