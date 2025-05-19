from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventoryTracker.inventory.views import ProductViewSet, index, CategoryViewSet, ManufacturerViewSet, \
    WareHouseViewSet, ShelfViewSet, VendorViewSet, OENumberViewSet

router = DefaultRouter()
router.register(r'warehouses', WareHouseViewSet)
router.register(r'shelfs', ShelfViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'manufacturers', ManufacturerViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'oenumbers', OENumberViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('', index, name='index'),
]

