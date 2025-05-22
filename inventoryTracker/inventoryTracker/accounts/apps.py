from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'inventoryTracker.accounts'

    def ready(self):
        import inventoryTracker.accounts.signals
