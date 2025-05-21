const csrftoken = document.getElementById('csrftoken').value;
const API_URL = 'http://127.0.0.1:8000/api/products/';

let isEditMode = false;

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

const closeDetailsBtn = document.querySelector('.close-details-btn');
const productDetails = document.querySelector('#product-details');
closeDetailsBtn.addEventListener('click',function () {
    productDetails.style.display = 'none'
})


function getSelectedValues(selectId) {
    const selected = [];
    const options = document.getElementById(selectId).selectedOptions;
    for (let option of options) {
        selected.push(option.value);
    }
    return selected;
}


async function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const url = productId ? `${API_URL}${productId}/` : API_URL;
    const method = productId ? 'PUT' : 'POST';

    const productData = {
        name: document.getElementById('product-name').value,
        sku: document.getElementById('product-sku').value,
        model: document.getElementById('product-model').value,
        model_2: document.getElementById('product-model-2').value,
        model_3: document.getElementById('product-model-3').value,
        model_4: document.getElementById('product-model-4').value,
        model_5: document.getElementById('product-model-5').value,
        barcode: document.getElementById('product-barcode').value.trim() || null,
        quantity: document.getElementById('product-quantity').value || null,
        sell_price: document.getElementById('product-sell-price').value || 0,
        buy_price: document.getElementById('product-buy-price').value || 0,
        warehouse: document.getElementById('warehouse').value || null,
        shelf: document.getElementById('shelf').value || null,
        vendor: getSelectedValues('product-vendor'),
        manufacturer: document.getElementById('product-manufacturer').value || null,
        category: document.getElementById('product-category').value || null,
        box: document.getElementById('box').value,
        bag: document.getElementById('bag').value,
        additional_info: document.getElementById('additional_info').value
    };

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(productData)
    });

    if (response.ok) {
        alert(`Product ${productId ? 'updated' : 'added'} successfully!`);
        loadProducts();
        resetForm();
    } else {
        const error = await response.json();
        alert('Error: ' + JSON.stringify(error));
    }
}

function populateFormForEdit(product) {
    isEditMode = true;
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-sku').value = product.sku;
    document.getElementById('product-model').value = product.model || '';
    document.getElementById('product-model-2').value = product.model_2 || '';
    document.getElementById('product-model-3').value = product.model_3 || '';
    document.getElementById('product-model-4').value = product.model_4 || '';
    document.getElementById('product-model-5').value = product.model_5 || '';
    document.getElementById('product-barcode').value = product.barcode || '';
    document.getElementById('product-quantity').value = product.quantity || '';
    document.getElementById('product-sell-price').value = product.sell_price || '';
    document.getElementById('product-buy-price').value = product.buy_price || '';
    document.getElementById('box').value = product.box || '';
    document.getElementById('bag').value = product.bag || '';
    document.getElementById('additional_info').value = product.additional_info || '';

    if (product.warehouse) {
        document.getElementById('warehouse').value = product.warehouse;
    }
    if (product.shelf) {
        document.getElementById('shelf').value = product.shelf;
    }
    if (product.manufacturer) {
        document.getElementById('product-manufacturer').value = product.manufacturer;
    }
    if (product.category) {
        document.getElementById('product-category').value = product.category;
    }

    // Set multi-select vendors
    const vendorSelect = document.getElementById('product-vendor');
    if (product.vendor_details && product.vendor_details.length > 0) {
        Array.from(vendorSelect.options).forEach(option => {
            option.selected = product.vendor_details.some(v => v.id.toString() === option.value);
        });
    }

    document.getElementById('save-product-btn').textContent = 'Update Product';
    document.querySelector('.product-form-container h2').textContent = 'Edit Product';
    document.querySelector('.product-form-container').style.display = 'block';
}

function resetForm() {
    document.getElementById('product-id').value = '';
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

    document.getElementById('warehouse').selectedIndex = 0;
    document.getElementById('shelf').selectedIndex = 0;
    document.getElementById('product-manufacturer').selectedIndex = 0;
    document.getElementById('product-category').selectedIndex = 0;

    const vendorSelect = document.getElementById('product-vendor');
    Array.from(vendorSelect.options).forEach(option => {
        option.selected = false;
    });

    document.getElementById('save-product-btn').textContent = 'Add Product';
    document.querySelector('.product-form-container h2').textContent = 'Add Product';
    isEditMode = false;
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
            <td>
                <button class="btn btn-sm btn-info" onclick="event.stopPropagation(); editProduct('${product.id}')">
                    Edit
                </button>
            </td>
            <td>    
                <button class="btn btn-sm btn-danger" id="delete-btn" onclick="deleteProduct('${product.id}')">
                    Delete
                </button>
            </td>
        `;

        row.onclick = () => loadProductDetails(product.id);
        tableBody.appendChild(row);
    });
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}${id}/`);
        const product = await response.json();
        populateFormForEdit(product);
    } catch (error) {
        console.error('Error loading product for edit:', error);
        alert('Error loading product for editing');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}${productId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrftoken
            }
        });

        if (response.ok) {
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error))
        }

    } catch (error) {
        console.log('Error deleting product', error);
        alert('Error deleting product')
    }

}

