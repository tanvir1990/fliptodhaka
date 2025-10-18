let products = [];
let cart = {};
let totalCAD = 0, totalBDT = 0, totalWeight = 0, totalItems = 0;

// Load products from CSV
document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('products.csv');
  const text = await response.text();
  products = Papa.parse(text, { header: true, skipEmptyLines: true }).data;

  products.forEach(p => {
    p['Item Price CAD'] = parseFloat(p['Item Price CAD']) || 0;
    p['Item Price BDT'] = parseFloat(p['Item Price BDT']) || 0;
    p['Item Weight'] = parseFloat(p['Item Weight']) || 0;
  });

  populateCategoryFilter();
  renderProducts();
  attachEventListeners();
});

function populateCategoryFilter() {
  const uniqueCategories = [...new Set(products.map(p => p['Item Category']))];
  const filter = document.getElementById('category-filter');
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
}

function attachEventListeners() {
  document.getElementById('rate').addEventListener('input', () => {
    renderProducts();
    updateTotals();
  });

  document.getElementById('category-filter').addEventListener('change', renderProducts);
  document.getElementById('sort-by').addEventListener('change', renderProducts);
  document.getElementById('view-style').addEventListener('change', updateViewStyle);

  document.getElementById('view-cart-btn').addEventListener('click', openCartModal);
  document.getElementById('close-cart-btn').addEventListener('click', closeCartModal);
}

function renderProducts() {
  const rate = parseFloat(document.getElementById('rate').value) || 1;
  const list = document.getElementById('product-list');
  const category = document.getElementById('category-filter').value;
  const sortBy = document.getElementById('sort-by').value;

  let filtered = [...products];
  if (category !== 'all') {
    filtered = filtered.filter(p => p['Item Category'] === category);
  }

  switch (sortBy) {
    case 'price-cad-low':
      filtered.sort((a, b) => a['Item Price CAD'] - b['Item Price CAD']);
      break;
    case 'price-cad-high':
      filtered.sort((a, b) => b['Item Price CAD'] - a['Item Price CAD']);
      break;
    case 'price-bdt-low':
      filtered.sort((a, b) => (a['Item Price CAD'] * rate) - (b['Item Price CAD'] * rate));
      break;
    case 'price-bdt-high':
      filtered.sort((a, b) => (b['Item Price CAD'] * rate) - (a['Item Price CAD'] * rate));
      break;
    case 'weight-low':
      filtered.sort((a, b) => a['Item Weight'] - b['Item Weight']);
      break;
    case 'weight-high':
      filtered.sort((a, b) => b['Item Weight'] - a['Item Weight']);
      break;
  }

  list.innerHTML = '';
  filtered.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'product';
    const priceBDT = (p['Item Price CAD'] * rate).toFixed(2);

    div.innerHTML = `
      <img src="${p['Item Image']}" alt="${p['Item Name']}">
      <h3>${p['Item Name']}</h3>
      <p>${p['Item Category']}</p>
      <p>${p['Item Price CAD']} CAD / ${priceBDT} BDT</p>
      <label>Qty:
        <select data-idx="${i}">
          <option value="0">0</option>
          ${Array.from({ length: 10 }, (_, j) => `<option value="${j + 1}">${j + 1}</option>`).join('')}
        </select>
      </label>
    `;

    const qtySelect = div.querySelector('select');
    qtySelect.value = cart[i]?.qty || 0;
    qtySelect.addEventListener('change', updateTotals);
    list.appendChild(div);
  });
}

function updateViewStyle() {
  const style = document.getElementById('view-style').value;
  const list = document.getElementById('product-list');
  list.className = `product-list ${style}`;
}

function updateTotals() {
  const rate = parseFloat(document.getElementById('rate').value) || 1;
  totalCAD = 0; totalBDT = 0; totalWeight = 0; totalItems = 0;
  cart = {};

  document.querySelectorAll('#product-list select[data-idx]').forEach(select => {
    const qty = parseInt(select.value) || 0;
    const idx = select.dataset.idx;
    if (qty > 0) {
      const p = products[idx];
      cart[idx] = { ...p, qty };
      totalCAD += qty * p['Item Price CAD'];
      totalBDT += qty * p['Item Price CAD'] * rate;
      totalWeight += qty * p['Item Weight'];
      totalItems += qty;
    }
  });

  // Update sticky cart
  document.getElementById('cart-total-items').innerText = totalItems;
  document.getElementById('cart-total-cad').innerText = totalCAD.toFixed(2);
  document.getElementById('cart-total-bdt').innerText = totalBDT.toFixed(2);
  document.getElementById('cart-total-weight').innerText = totalWeight.toFixed(2);
}

function openCartModal() {
  const modal = document.getElementById('cart-modal');
  const itemsContainer = document.getElementById('cart-modal-items');
  const rate = parseFloat(document.getElementById('rate').value) || 1;

  itemsContainer.innerHTML = '';

  Object.entries(cart).forEach(([idx, p]) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${p['Item Name']} (x${p.qty})</span>
      <span>${(p['Item Price CAD'] * p.qty).toFixed(2)} CAD</span>
      <span>${(p['Item Price CAD'] * p.qty * rate).toFixed(2)} BDT</span>
      <button data-idx="${idx}">Delete</button>
    `;
    div.querySelector('button').addEventListener('click', () => {
      delete cart[idx];
      renderProducts();
      updateTotals();
      openCartModal();
    });
    itemsContainer.appendChild(div);
  });

  document.getElementById('modal-total-items').innerText = totalItems;
  document.getElementById('modal-total-cad').innerText = totalCAD.toFixed(2);
  document.getElementById('modal-total-bdt').innerText = totalBDT.toFixed(2);
  document.getElementById('modal-total-weight').innerText = totalWeight.toFixed(2);

  modal.style.display = 'flex';
}

function closeCartModal() {
  document.getElementById('cart-modal').style.display = 'none';
}

const form = document.getElementById('order-form');
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (Object.keys(cart).length === 0) {
    alert('Please select at least one product.');
    return;
  }

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
      cart = {};
      updateTotals();
      renderProducts();
    } else {
      console.error(data);
      alert('❌ Failed to send order. Please try again.');
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Something went wrong. Please try again later.');
  }
});
