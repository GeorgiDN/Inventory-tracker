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
    const sell_price = document.getElementById('product-sell-price').value;
    const buy_price = document.getElementById('product-buy-price').value;

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
    } else {
        const error = await response.json();
        alert('Error: ' + JSON.stringify(error));
    }
}

async function loadProducts() {
    debugger
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
            <td>${(product.vendor || []).map(v => v.name).join(', ')}</td>
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
        document.getElementById('detail-category').textContent = product.category || '';

        document.getElementById('detail-warehouse').textContent = product.warehouse || '';
        document.getElementById('detail-shelf').textContent = product.shelf || '';
        document.getElementById('detail-box').textContent = product.box || '';
        document.getElementById('detail-bag').textContent = product.bag || '';

        document.getElementById('detail-vendors').textContent = (product.vendor || []).map(v => v.name).join(', ');
        document.getElementById('detail-manufacturer').textContent = product.manufacturer || '';
        document.getElementById('detail-model-2').textContent = product.model_2 || '';
        document.getElementById('detail-model-3').textContent = product.model_3 || '';
        document.getElementById('detail-model-4').textContent = product.model_4 || '';
        document.getElementById('detail-model-5').textContent = product.model_5 || '';

        document.getElementById('detail-sell-price').textContent = product.sell_price;
        document.getElementById('detail-buy-price').textContent = product.buy_price;

        document.getElementById('detail-created-at').textContent = product.created_at;
        document.getElementById('detail-updated-at').textContent = product.updated_at;
        document.getElementById('detail-additional-info').textContent = product.additional_info;

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
