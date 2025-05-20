const csrftoken = document.getElementById('csrftoken').value;
const API_URL = 'http://127.0.0.1:8000/api/products/';

async function loadSelectOptions(apiUrl, selectId) {
    const response = await fetch(apiUrl);
    const items = await response.json();
    const select = document.getElementById(selectId);

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

loadSelectOptions('http://127.0.0.1:8000/api/warehouses/', 'warehouse');
loadSelectOptions('http://127.0.0.1:8000/api/shelfs/', 'shelf');
loadSelectOptions('http://127.0.0.1:8000/api/vendors/', 'product-vendor');
loadSelectOptions('http://127.0.0.1:8000/api/manufacturers/', 'product-manufacturer');
loadSelectOptions('http://127.0.0.1:8000/api/categories/', 'product-category');

async function addProduct() {
    const name = document.getElementById('product-name').value;
    const sku = document.getElementById('product-sku').value;
    const model = document.getElementById('product-model').value;
    const model_2 = document.getElementById('product-model-2').value;
    const model_3 = document.getElementById('product-model-3').value;
    const model_4 = document.getElementById('product-model-4').value;
    const model_5 = document.getElementById('product-model-5').value;
    const barcodeValue = document.getElementById('product-barcode').value.trim();
    const barcode = barcodeValue === '' ? null : barcodeValue
    const quantityValue = document.getElementById('product-quantity').value;
    const quantity = quantityValue === '' ? null : quantityValue
    const sell_price = document.getElementById('product-sell-price').value || 0;
    const buy_price = document.getElementById('product-buy-price').value || 0;

    const warehouse = document.getElementById('warehouse').value || null;
    const shelf = document.getElementById('shelf').value || null;
    const vendor = getSelectedValues('product-vendor');
    const manufacturer = document.getElementById('product-manufacturer').value || null;
    const category = document.getElementById('product-category').value || null;

    const productData = {
        name,
        sku,
        model,
        model_2,
        model_3,
        model_4,
        model_5,
        barcode,
        quantity,
        sell_price,
        buy_price,
        warehouse,
        shelf,
        vendor,
        manufacturer,
        category,
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(productData)
    });

    if (response.ok) {
        alert('Product added!');
        loadProducts();
        clearInputs();
    } else {
        const error = await response.json();
        alert('Error: ' + JSON.stringify(error));
    }
    clearInputs(name, sku, model, model_2, model_3, model_4, model_5, barcode, quantity, sell_price, buy_price);
}

async function loadProducts() {
    const response = await fetch(API_URL);
    const products = await response.json();
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>${product.model || ''}</td>
            <td>${product.vendor_details ? product.vendor_details.map(v => v.name).join(', ') : ''}</td>
            <td>${product.warehouse_name || ''}</td>
            <td>${product.shelf_name || ''}</td>
            <td>${product.box || ''}</td>
            <td>${product.bag || ''}</td>
            <td>${product.sell_price}</td>
        `;
        row.onclick = () => loadProductDetails(product.id);

        tableBody.appendChild(row);
    });
}

loadProducts();

async function loadProductDetails(id) {
    try {
        const response = await fetch(`${API_URL}${id}/`);
        const product = await response.json();

        // Populate fields
        document.getElementById('detail-name').textContent = product.name;
        document.getElementById('detail-sku').textContent = product.sku;
        document.getElementById('detail-model').textContent = product.model || '';
        document.getElementById('detail-barcode').textContent = product.barcode || '';
        document.getElementById('detail-quantity').textContent = product.quantity || '';
        document.getElementById('detail-category').textContent = product.category_name || '';

        document.getElementById('detail-warehouse').textContent = product.warehouse_name || '';
        document.getElementById('detail-shelf').textContent = product.shelf_name || '';
        document.getElementById('detail-box').textContent = product.box || '';
        document.getElementById('detail-bag').textContent = product.bag || '';

        document.getElementById('detail-vendors').textContent =
            product.vendor_details.map(v => v.name).join(', ') || '';
        document.getElementById('detail-manufacturer').textContent = product.manufacturer_name || '';
        document.getElementById('detail-model-2').textContent = product.model_2 || '';
        document.getElementById('detail-model-3').textContent = product.model_3 || '';
        document.getElementById('detail-model-4').textContent = product.model_4 || '';
        document.getElementById('detail-model-5').textContent = product.model_5 || '';

        document.getElementById('detail-sell-price').textContent = product.sell_price;
        document.getElementById('detail-buy-price').textContent = product.buy_price;

        document.getElementById('detail-created-at').textContent = product.created_at;
        document.getElementById('detail-updated-at').textContent = product.updated_at;
        document.getElementById('detail-additional-info').textContent = product.additional_info || '';

        // Show the details div
        document.getElementById('product-details').style.display = 'block';

    } catch (error) {
        console.error('Error loading product details:', error);
    }
}


function getSelectedValues(selectId) {
    const selected = [];
    const options = document.getElementById(selectId).selectedOptions;
    for (let option of options) {
        selected.push(option.value);
    }
    return selected;
}

function clearInputs() {
    // Clear text inputs
    document.getElementById('product-name').value = '';
    document.getElementById('product-sku').value = '';
    document.getElementById('product-model').value = '';
    document.getElementById('product-model-2').value = '';
    document.getElementById('product-model-3').value = '';
    document.getElementById('product-model-4').value = '';
    document.getElementById('product-model-5').value = '';
    document.getElementById('product-barcode').value = '';
    document.getElementById('product-quantity').value = '';
    document.getElementById('product-sell-price').value = '';
    document.getElementById('product-buy-price').value = '';
    document.getElementById('box').value = '';
    document.getElementById('bag').value = '';
    document.getElementById('additional_info').value = '';

    // Reset selects
    document.getElementById('warehouse').selectedIndex = 0;
    document.getElementById('shelf').selectedIndex = 0;
    document.getElementById('product-manufacturer').selectedIndex = 0;
    document.getElementById('product-category').selectedIndex = 0;

    const vendorSelect = document.getElementById('product-vendor');
    Array.from(vendorSelect.options).forEach(option => {
        option.selected = false;
    });
}
