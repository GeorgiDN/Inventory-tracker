
# Inventory-Tracker

Inventory-Tracker is a web-based inventory management system built with Django and Django REST Framework. It allows users to manage products, categories, warehouses, and vendors, with support for bulk operations and Excel import/export. The frontend is heavily powered by JavaScript for a smooth and dynamic user experience.

Features
🔐 Authentication
User registration, login, and logout

Password reset and change functionality

📦 Product Management
Create, edit, delete products

Assign and remove related foreign keys (e.g., categories, vendors, warehouses)

Bulk operations for updating or clearing foreign keys

View product details dynamically

📁 Related Models
- Categories

- Warehouses

- Vendors

- Manufacturers

📤 Excel Import/Export
Import products from Excel files

Export current product data to Excel

📜 API and Views
Django REST Framework used for backend API

Some functionality uses traditional Django views

CSRF protection and API security in place

⚙️ JavaScript Frontend
Most interactivity handled via JavaScript

Dynamic table rendering

Inline editing

Modals and confirmations for user actions


### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/GeorgiDN/Ecommerse-with-Django.git


### 2. Open the project


### 3. Install dependencies
 
   ```terminal
   
     pip install -r requirements.txt
  
   ```

### 4. Change DB settings in settings.py

  ```py
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "your_db_name",
            "USER": "your_username",
            "PASSWORD": "your_pass",
            "HOST": "your_host",
            "PORT": "your_port",
        }
    }
  ```

### 5. Run the migrations

  ```terminal

    python manage.py migrate

  ```

### 6. Run the project

  ```terminal

    python manage.py runserver

  ```
