from django import forms
from django.core.validators import FileExtensionValidator


class ProductImportForm(forms.Form):
    file = forms.FileField(
        label='Excel File',
        validators=[
            FileExtensionValidator(
                allowed_extensions=['xlsx', 'xls'],
                message='Only Excel files (.xlsx, .xls) are allowed'
            )
        ]
    )
    update_existing = forms.BooleanField(
        required=False,
        initial=False,
        label='Update existing products (match by SKU)',
        help_text='If checked, will update products with matching SKU instead of creating new ones'
    )
    create_missing = forms.BooleanField(
        required=False,
        initial=True,
        label='Create missing related records',
        help_text='Create categories, manufacturers, etc. if they dont exist'
    )
