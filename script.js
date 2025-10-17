let products = [];
let cart = {};
let totalCAD = 0, totalBDT = 0, totalWeight = 0;

// Load products from CSV
document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('products.csv');
  const text = await response.text();
  products = Papa.parse(text, { header: true, skipEmptyLines: true }).data;

  // Convert numeric values
  products.forEach(p => {
    p['Item Price CAD'] = parseFloat(p['Item Price CAD']) || 0;
    p['Item Price BDT'] = parseFloat(p['Item Price BDT']) || 0;
    p['Item Weight'] = parseFloat(p['Item Weight']) || 0;
  });

  populateCategoryFilter();
  applyFilterAndSort();
});

// Populate category filter
function populateCategoryFilter() {
  const categories = [...new Set(products.map(p => p['Item Category']))];
  const select = document.getElementById('filter-category');
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Render products
function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  list.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p['Item Image']}" alt="${p['Item Name']}">
      <h3>${p['Item Name']}</h3>
      <p>${p['Item Category']}</p>
      <p>${p['Item Price CAD'].toFixed(2)} CAD / ${(p['Item Price CAD']*getRate()).toFixed(2)} BDT</p>
      <label>Qty: <input type="number" min="0" max="20" value="${cart[i]?.qty || 0}" data-idx="${i}" onchange="updateTotals()"></label>
    `;
    container.appendChild(div);
  });
}

// Get exchange rate
function getRate() {
  return parseFloat(document.getElementById('rate').value) || 1;
}

// Update totals
function updateTotals() {
  totalCAD = 0; totalBDT = 0; totalWeight = 0;
  cart = {};
  const rate = getRate();

  document.querySelectorAll('input[type=number][data-idx]').forEach(input => {
    const qty = parseInt(input.value) || 0;
    const idx = input.dataset.idx;
    if (qty > 0) {
      const p = products[idx];
      cart[idx] = { ...p, qty };
      totalCAD += qty * p['Item Price CAD'];
      totalBDT += qty * p['Item Price CAD'] * rate;
      totalWeight += qty * p['Item Weight'];
    }
  });

  renderCart();
}

// Render sticky bottom cart totals
function renderCart() {
  document.getElementById('cart-count').innerText = Object.keys(cart).length;
  document.getElementById('cart-total-cad').innerText = totalCAD.toFixed(2);
  document.getElementById('cart-total-bdt').innerText = totalBDT.toFixed(2);
  document.getElementById('cart-total-weight').innerText = totalWeight.toFixed(2);
}

// Apply filter and sort (live)
function applyFilterAndSort() {
  let filtered = [...products];

  // Filter by category
  const category = document.getElementById('filter-category').value;
  if (category !== 'all') filtered = filtered.filter(p => p['Item Category'] === category);

  // Sort
  const sort = document.getElementById('sort-criteria').value;
  switch(sort) {
    case 'weight-asc':
      filtered.sort((a,b) => a['Item Weight'] - b['Item Weight']);
      break;
    case 'weight-desc':
      filtered.sort((a,b) => b['Item Weight'] - a['Item Weight']);
      break;
    case 'priceCAD-asc':
      filtered.sort((a,b) => a['Item Price CAD'] - b['Item Price CAD']);
      break;
    case 'priceCAD-desc':
      filtered.sort((a,b) => b['Item Price CAD'] - a['Item Price CAD']);
      break;
    case 'priceBDT-asc':
      filtered.sort((a,b) => (a['Item Price CAD']*getRate()) - (b['Item Price CAD']*getRate()));
      break;
    case 'priceBDT-desc':
      filtered.sort((a,b) => (b['Item Price CAD']*getRate()) - (a['Item Price CAD']*getRate()));
      break;
    default:
      break;
  }

  renderProducts(filtered);
}

// Event listeners for live filter/sort updates
document.getElementById('filter-category').addEventListener('change', applyFilterAndSort);
document.getElementById('sort-criteria').addEventListener('change', applyFilterAndSort);
document.getElementById('rate').addEventListener('input', applyFilterAndSort);

// Order form submission
document.getElementById('order-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (Object.keys(cart).length === 0) {
    alert('Please select at least one product.');
    return;
  }

  const form = e.target;
  const orderData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    deliveryMethod: form.delivery.value,
    totalCAD: totalCAD.toFixed(2),
    totalBDT: totalBDT.toFixed(2),
    totalWeight: totalWeight.toFixed(2),
    orderDetails: JSON.stringify(Object.values(cart), null, 2)
  };

  try {
    const res = await fetch('/api/send-order', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Order submitted! You will receive confirmation via email.');
      form.reset();
      updateTotals();
    } else {
      console.error(data);
      alert('❌ Failed to send order. Please try again.');
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Something went wrong. Please try again later.');
  }
});
