from django.db import models


class Warehouse(models.Model):
    name = models.CharField(max_length=100)
    location = models.TextField(blank=True, null=True)  # optional details

    def __str__(self):
        return self.name


class Shelf(models.Model):
    name = models.CharField(max_length=100)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='shelves')

    def __str__(self):
        return f"{self.warehouse.name} - {self.name}"


class Vendor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    contact_info = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Manufacturer(models.Model):
    name = models.CharField(max_length=100)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class OENumber(models.Model):
    number = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.number


class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    sku = models.CharField(max_length=100, unique=True, help_text='Stock keeping unit')
    barcode = models.CharField(max_length=100, blank=True, null=True, unique=True)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.SET_NULL, null=True, blank=True)
    model = models.CharField(max_length=255, null=True, blank=True)
    oe_numbers = models.ManyToManyField(OENumber, blank=True, related_name="products")
    quantity = models.IntegerField(blank=True, null=True)

    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True)
    shelf = models.ForeignKey(Shelf, on_delete=models.SET_NULL, null=True, blank=True)
    box = models.CharField(max_length=100, blank=True, null=True)
    bag = models.CharField(max_length=100, blank=True, null=True)

    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    buy_price = models.DecimalField(max_digits=12, decimal_places=2,
                                    verbose_name="Purchase Price", blank=True, null=True)
    sell_price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    additional_info = models.TextField(blank=True, null=True)
