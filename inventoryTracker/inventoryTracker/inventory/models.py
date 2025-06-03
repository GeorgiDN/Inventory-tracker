from django.core.exceptions import ValidationError
from django.db import models


from django.contrib.auth import get_user_model
User = get_user_model()


class Warehouse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_warehouses')
    name = models.CharField(max_length=100)
    location = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Shelf(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_shelves',
                             blank=True, null=True)
    name = models.CharField(max_length=100)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE,
                                  related_name='shelves', null=True, blank=True)

    def __str__(self):
        return f"{self.warehouse.name} - {self.name}"


class Vendor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_vendors')
    name = models.CharField(max_length=100, unique=True)
    contact_info = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Manufacturer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_manufacturers')
    name = models.CharField(max_length=100)
    website = models.CharField(blank=True, null=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_categories')
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_products')
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    sku = models.CharField(max_length=100, unique=True, help_text='Stock keeping unit')
    barcode = models.CharField(max_length=100, blank=True, null=True, unique=True)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.SET_NULL, null=True, blank=True)
    model = models.CharField(max_length=255, null=True, blank=True)
    model_2 = models.CharField(max_length=255, null=True, blank=True)
    model_3 = models.CharField(max_length=255, null=True, blank=True)
    model_4 = models.CharField(max_length=255, null=True, blank=True)
    model_5 = models.CharField(max_length=255, null=True, blank=True)
    quantity = models.IntegerField(blank=True, null=True, default=0)

    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True)
    shelf = models.ForeignKey(Shelf, on_delete=models.SET_NULL, null=True, blank=True)
    box = models.CharField(max_length=100, blank=True, null=True)
    bag = models.CharField(max_length=100, blank=True, null=True)

    vendor = models.ManyToManyField(Vendor, blank=True, related_name='product_vendors')
    buy_price = models.DecimalField(max_digits=12, decimal_places=2,
                                    verbose_name="Purchase Price", blank=True, null=True, default=0)
    sell_price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    additional_info = models.TextField(blank=True, null=True)

    def clean(self):
        if self.quantity and self.quantity < 0:
            raise ValidationError({'quantity': 'Quantity cannot be negative'})
        if self.buy_price and self.buy_price < 0:
            raise ValidationError({'buy_price': 'Buy price cannot be negative'})
        if self.sell_price and self.sell_price < 0:
            raise ValidationError({'sell_price': 'Sell price cannot be negative'})
