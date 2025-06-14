const csrftoken = document.getElementById('csrftoken').value;

const API_BASE_URL = window.env.API_BASE_URL;

const API_URL = `${API_BASE_URL}products/`;

let isEditMode = false;
let categories = [];

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

loadSelectOptions(`${API_BASE_URL}warehouses/`, 'warehouse');
loadSelectOptions(`${API_BASE_URL}shelves/`, 'shelf');
loadSelectOptions(`${API_BASE_URL}vendors/`, 'product-vendor');
loadSelectOptions(`${API_BASE_URL}manufacturers/`, 'product-manufacturer');
loadSelectOptions(`${API_BASE_URL}categories/`, 'product-category');

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
closeDetailsBtn.addEventListener('click', function () {
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
            <td>
                <input type="checkbox" class="form-check-input product-checkbox" 
                       data-product-id="${product.id}"
                       onchange="toggleProductSelection('${product.id}', this)">
            </td>
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
                <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteProduct('${product.id}')">
                    Delete
                </button>
            </td>
        `;

        row.onclick = () => loadProductDetails(product.id);
        tableBody.appendChild(row);
    });

    // Reset selected products
    selectedProductIds = new Set();
    document.getElementById('select-all').checked = false;
}

async function editProduct(id) {

    try {
        const response = await fetch(`${API_URL}${id}/`);
        const product = await response.json();
        populateFormForEdit(product);
        const toggleButton = document.getElementById('toggle-form');
        const formWrapper = document.querySelector('.product-form-wrapper');
        const formContainer = document.querySelector('.product-form-container');
        formWrapper.style.display = 'block';
        formContainer.style.display = 'flex';
        toggleButton.textContent = 'Hide Product Form';

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

let selectedProductIds = new Set();

function toggleProductSelection(productId, checkbox) {
    if (checkbox.checked) {
        selectedProductIds.add(productId);
    } else {
        selectedProductIds.delete(productId);
    }
    updateSelectAllCheckbox();
}

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
        const productId = checkbox.dataset.productId;
        if (selectAllCheckbox.checked) {
            selectedProductIds.add(productId);
        } else {
            selectedProductIds.delete(productId);
        }
    });
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    selectAllCheckbox.checked = checkboxes.length > 0 &&
        selectedProductIds.size === checkboxes.length;
}

async function applyBulkAction() {
    const action = document.getElementById('bulk-action').value;
    const productIds = Array.from(selectedProductIds);

    if (productIds.length === 0) {
        alert('Please select at least one product');
        return;
    }

    if (!action) {
        alert('Please select an action');
        return;
    }

    const bulkCategorySelect = document.getElementById('bulk-category');
    const bulkWarehouseSelect = document.getElementById('bulk-warehouse');
    const bulkShelfSelect = document.getElementById('bulk-shelf');
    const bulkManufacturerSelect = document.getElementById('bulk-manufacturer');
    const bulkVendorSelect = document.getElementById('bulk-vendor');

    switch (action) {
        case 'assign-category':
            // Show category dropdown
            bulkCategorySelect.style.display = 'inline-block';

            // Wait for user selection (you might want to use a modal instead)
            const assignConfirmed = confirm(`Assign ${productIds.length} selected products to a category?`);
            if (assignConfirmed) {
                if (bulkCategorySelect.value) {
                    await bulkAssignCategory(productIds, bulkCategorySelect.value);
                } else {
                    alert('Please select a category first');
                }
            }
            // Hide dropdown after operation
            bulkCategorySelect.style.display = 'none';
            break;

        case 'assign-warehouse':
            bulkWarehouseSelect.style.display = 'inline-block';

            const assignWarehouseConfirmed = confirm(`Assign ${productIds.length} selected products to a warehouse?`);
            if (assignWarehouseConfirmed) {
                if (bulkWarehouseSelect.value) {
                    await bulkAssignWarehouse(productIds, bulkWarehouseSelect.value);
                } else {
                    alert('Please select a warehouse first');
                }
            }
            // Hide dropdown after operation
            bulkWarehouseSelect.style.display = 'none';
            break;

        case 'assign-shelf':
            bulkShelfSelect.style.display = 'inline-block';

            const assignShelfConfirmed = confirm(`Assign ${productIds.length} selected products to a shelf?`);
            if (assignShelfConfirmed) {
                if (bulkShelfSelect.value) {
                    await bulkAssignShelf(productIds, bulkShelfSelect.value);
                } else {
                    alert('Please select a shelf first');
                }
            }

            bulkShelfSelect.style.display = 'none';
            break;

        case 'assign-manufacturer':
            bulkManufacturerSelect.style.display = 'inline-block';

            const assignManufacturerConfirmed = confirm(`Assign ${productIds.length} selected products to a manufacturer?`);
            if (assignManufacturerConfirmed) {
                if (bulkManufacturerSelect.value) {
                    await bulkAssignManufacturer(productIds, bulkManufacturerSelect.value);
                } else {
                    alert('Please select a manufacturer first');
                }
            }

            bulkManufacturerSelect.style.display = 'none';
            break;

        case 'assign-vendor':
            bulkVendorSelect.style.display = 'inline-block';

            const assignVendorConfirmed = confirm(`Add ${productIds.length} selected products to a vendor?`);
            if (assignVendorConfirmed) {
                if (bulkVendorSelect.value) {
                    await bulkAssignVendor(productIds, bulkVendorSelect.value);
                } else {
                    alert('Please select a vendor first');
                }
            }
            bulkVendorSelect.style.display = 'none';
            break;

        case 'remove-category':
            if (confirm(`Remove category from ${productIds.length} selected products?`)) {
                await bulkRemoveCategory(productIds);
            }
            break;

        case 'remove-warehouse':
            if (confirm(`Remove warehouse from ${productIds.length} selected products?`)) {
                await bulkRemoveWarehouse(productIds);
            }
            break;

        case 'remove-shelf':
            if (confirm(`Remove shelf from ${productIds.length} selected products?`)) {
                await bulkRemoveShelf(productIds);
            }
            break;

        case 'remove-manufacturer':
            if (confirm(`Remove manufacturer from ${productIds.length} selected products?`)) {
                await bulkRemoveManufacturer(productIds);
            }
            break;

        case 'remove-vendor':
            bulkVendorSelect.style.display = 'inline-block';

            const removeVendorConfirmed = confirm(`Remove ${productIds.length} selected products from a vendor?`);
            if (removeVendorConfirmed) {
                if (bulkVendorSelect.value) {
                    await bulkRemoveVendor(productIds, bulkVendorSelect.value);
                } else {
                    alert('Please select a vendor first');
                }
            }
            bulkVendorSelect.style.display = 'none';
            break;

        case 'delete':
            if (confirm(`Are you sure you want to delete ${productIds.length} selected products?`)) {
                await bulkDeleteProducts(productIds);
            }
            break;
    }


    document.getElementById('bulk-action').value = '';
    bulkCategorySelect.value = '';
    bulkWarehouseSelect.value = '';
    bulkShelfSelect.value = '';
    bulkManufacturerSelect.value = ''
    bulkVendorSelect.value = ''

}

async function bulkDeleteProducts(productIds) {
    try {
        const response = await fetch(`${API_URL}bulk_delete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds
            })
        });

        if (response.ok) {
            alert('Products deleted successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error deleting products:', error);
        alert('Error deleting products');
    }
}

//---------------------------
async function bulkAssignCategory(productIds, categoryId) {
    try {
        const response = await fetch(`${API_URL}bulk_assign_category/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds,
                category_id: categoryId
            })
        });

        if (response.ok) {
            alert('Category assigned successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error assigning category:', error);
        alert('Error assigning category');
    }
}

async function bulkRemoveCategory(productIds) {
    try {
        const response = await fetch(`${API_URL}bulk_remove_category/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds
            })
        });

        if (response.ok) {
            alert('Category removed successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error removing category:', error);
        alert('Error removing category');
    }
}

async function loadCategoriesForBulk() {
    try {
        const response = await fetch(`${API_BASE_URL}categories/`);
        categories = await response.json();
        const bulkCategorySelect = document.getElementById('bulk-category');

        // Clear existing options except the first one
        while (bulkCategorySelect.options.length > 1) {
            bulkCategorySelect.remove(1);
        }

        // Add categories to bulk select
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            bulkCategorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('Error loading categories');
    }
}

async function loadWarehouseForBulk() {
    try {
        const response = await fetch(`${API_BASE_URL}warehouses/`);
        warehouses = await response.json();
        const bulkWarehouseSelect = document.getElementById('bulk-warehouse');

        // Clear existing options except the first one
        while (bulkWarehouseSelect.options.length > 1) {
            bulkWarehouseSelect.remove(1);
        }

        // Add categories to bulk select
        warehouses.forEach(warehouse => {
            const option = document.createElement('option');
            option.value = warehouse.id;
            option.textContent = warehouse.name;
            bulkWarehouseSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading warehouses:', error);
        alert('Error loading warehouses');
    }
}

async function bulkAssignWarehouse(productIds, warehouseId) {
    try {
        const response = await fetch(`${API_URL}bulk_assign_warehouse/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds,
                warehouse_id: warehouseId
            })
        });

        if (response.ok) {
            alert('Warehouse assigned successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error assigning warehouse:', error);
        alert('Error assigning warehouse');
    }
}

async function bulkRemoveShelf(productIds) {
    try {
        const response = await fetch(`${API_URL}bulk_remove_shelf/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds
            })
        });

        if (response.ok) {
            alert('Shelf removed successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error removing shelf:', error);
        alert('Error removing shelf');
    }
}

async function loadShelvesForBulk() {
    try {
        const response = await fetch(`${API_BASE_URL}shelves/`);
        let shelves = await response.json();
        const bulkShelfSelect = document.getElementById('bulk-shelf');

        // Clear existing options except the first one
        while (bulkShelfSelect.options.length > 1) {
            bulkShelfSelect.remove(1);
        }


        shelves.forEach(shelf => {
            const option = document.createElement('option');
            option.value = shelf.id;
            option.textContent = shelf.name;
            bulkShelfSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading shelves:', error);
        alert('Error loading shelves');
    }
}

async function bulkAssignShelf(productIds, shelfId) {
    try {
        const response = await fetch(`${API_URL}bulk_assign_shelf/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds,
                shelf_id: shelfId
            })
        });

        if (response.ok) {
            alert('Shelf assigned successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error assigning shelf:', error);
        alert('Error assigning shelf');
    }
}

async function bulkRemoveWarehouse(productIds) {
    try {
        const response = await fetch(`${API_URL}bulk_remove_warehouse/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds
            })
        });

        if (response.ok) {
            alert('Warehouse removed successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error removing warehouse:', error);
        alert('Error removing warehouse');
    }
}

async function loadManufacturersForBulk() {
    try {
        const response = await fetch(`${API_BASE_URL}manufacturers/`);
        let manufacturers = await response.json();
        const bulkManufacturerSelect = document.getElementById('bulk-manufacturer');

        // Clear existing options except the first one
        while (bulkManufacturerSelect.options.length > 1) {
            bulkManufacturerSelect.remove(1);
        }

        manufacturers.forEach(manufacturer => {
            const option = document.createElement('option');
            option.value = manufacturer.id;
            option.textContent = manufacturer.name;
            bulkManufacturerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading manufacturers:', error);
        alert('Error loading manufacturers');
    }
}

async function bulkAssignManufacturer(productIds, manufacturerId) {
    try {
        const response = await fetch(`${API_URL}bulk_assign_manufacturer/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds,
                manufacturer_id: manufacturerId
            })
        });

        if (response.ok) {
            alert('Manufacturer assigned successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error assigning manufacturer:', error);
        alert('Error assigning manufacturer');
    }
}

async function bulkRemoveManufacturer(productIds) {
    try {
        const response = await fetch(`${API_URL}bulk_remove_manufacturer/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                product_ids: productIds
            })
        });

        if (response.ok) {
            alert('Manufacturer removed successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error removing warehouse:', error);
        alert('Error removing warehouse');
    }
}

async function loadVendorsForBulk() {
    try {
        const response = await fetch(`${API_BASE_URL}vendors/`);
        const vendors = await response.json();
        const bulkVendorSelect = document.getElementById('bulk-vendor');

        while (bulkVendorSelect.options.length > 1) {
            bulkVendorSelect.remove(1);
        }

        vendors.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor.id;
            option.textContent = vendor.name;
            bulkVendorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading vendors:', error);
        alert('Error loading vendors');
    }
}

async function bulkAssignVendor(productIds, vendorId) {

    try {
        const response = await fetch(`${API_URL}bulk_assign_vendor/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                product_ids: productIds,
                vendor_id: vendorId
            })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.success || 'Vendor added successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error assigning vendor:', error);
        alert('Error assigning vendor');
    }
}

async function bulkRemoveVendor(productIds, vendorId) {
    try {
        const response = await fetch(`${API_URL}bulk_remove_vendor/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                product_ids: productIds,
                vendor_id: vendorId
            })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.success || 'Vendor removed successfully');
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error removing vendor:', error);
        alert('Error removing vendor');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadCategoriesForBulk();
    loadWarehouseForBulk();
    loadShelvesForBulk();
    loadManufacturersForBulk();
    loadVendorsForBulk();

    document.getElementById('bulk-action').addEventListener('change', function () {
        const bulkCategorySelect = document.getElementById('bulk-category');
        bulkCategorySelect.style.display = (this.value === 'assign-category') ? 'inline-block' : 'none';

        const bulkWarehouseSelect = document.getElementById('bulk-warehouse');
        bulkWarehouseSelect.style.display = (this.value === 'assign-warehouse') ? 'inline-block' : 'none';

        const bulkShelfSelect = document.getElementById('bulk-shelf');
        bulkShelfSelect.style.display = (this.value === 'assign-shelf') ? 'inline-block' : 'none';

        const bulkManufacturerSelect = document.getElementById('bulk-manufacturer');
        bulkManufacturerSelect.style.display = (this.value === 'assign-manufacturer') ? 'inline-block' : 'none';

        const bulkVendorSelect = document.getElementById('bulk-vendor');
        bulkVendorSelect.style.display = (this.value === 'assign-vendor') ? 'inline-block' : 'none';

        const bulkVendorRemoveSelect = document.getElementById('bulk-vendor');
        bulkVendorRemoveSelect.style.display = (this.value === 'remove-vendor') ? 'inline-block' : 'none';

    });
});
