let products = [];
let originalProducts = [];
let cart = {};
let totalCAD = 0, totalBDT = 0, totalWeight = 0;
let viewStyle = 'thumbnail';

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('products.csv');
  const text = await response.text();
  products = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
  originalProducts = [...products];

  products.forEach(p => {
    p['Item Price CAD'] = parseFloat(p['Item Price CAD']) || 0;
    p['Item Price BDT'] = parseFloat(p['Item Price BDT']) || 0;
    p['Item Weight'] = parseFloat(p['Item Weight']) || 0;
  });

  populateCategoryFilter();
  applyFilterSortView();
});

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

function getRate() { return parseFloat(document.getElementById('rate').value) || 1; }

function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  container.className = `product-list ${viewStyle}`;

  list.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'product';

    // dropdown for quantity 0-10
    let options = '';
    for (let q = 0; q <= 10; q++) {
      const selected = (cart[i]?.qty === q) ? 'selected' : '';
      options += `<option value="${q}" ${selected}>${q}</option>`;
    }

    div.innerHTML = `
      <img src="${p['Item Image']}" alt="${p['Item Name']}">
      <h3>${p['Item Name']}</h3>
      <p>${p['Item Category']}</p>
      <p>${p['Item Price CAD'].toFixed(2)} CAD / ${(p['Item Price CAD']*getRate()).toFixed(2)} BDT</p>
      <label>Qty: <select data-idx="${i}" onchange="updateTotals()">${options}</select></label>
    `;
    container.appendChild(div);
  });
}

function updateTotals() {
  const rate = getRate();
  totalCAD = 0; totalBDT = 0; totalWeight = 0;
  cart = {};

  document.querySelectorAll('select[data-idx]').forEach(sel => {
    const qty = parseInt(sel.value) || 0;
    const idx = sel.dataset.idx;
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

function renderCart() {
  const countEl = document.getElementById('cart-count');
  const cadEl = document.getElementById('cart-total-cad');
  const bdtEl = document.getElementById('cart-total-bdt');
  const weightEl = document.getElementById('cart-total-weight');

  [countEl, cadEl, bdtEl, weightEl].forEach(el => {
    el.classList.remove('cart-value-updated');
    void el.offsetWidth;
    el.classList.add('cart-value-updated');
  });

  countEl.innerText = Object.keys(cart).length;
  cadEl.innerText = totalCAD.toFixed(2);
  bdtEl.innerText = totalBDT.toFixed(2);
  weightEl.innerText = totalWeight.toFixed(2);
}

function applyFilterSortView() {
  const cat = document.getElementById('filter-category').value;
  let list = cat === 'all' ? [...originalProducts] : originalProducts.filter(p => p['Item Category'] === cat);

  const sort = document.getElementById('sort-criteria').value;
  const rate = getRate();
  if (sort === 'weight-asc') list.sort((a,b)=> a['Item Weight']-b['Item Weight']);
  if (sort === 'weight-desc') list.sort((a,b)=> b['Item Weight']-a['Item Weight']);
  if (sort === 'priceCAD-asc') list.sort((a,b)=> a['Item Price CAD']-b['Item Price CAD']);
  if (sort === 'priceCAD-desc') list.sort((a,b)=> b['Item Price CAD']-a['Item Price CAD']);
  if (sort === 'priceBDT-asc') list.sort((a,b)=> a['Item Price CAD']*rate - b['Item Price CAD']*rate);
  if (sort === 'priceBDT-desc') list.sort((a,b)=> b['Item Price CAD']*rate - a['Item Price CAD']*rate);

  viewStyle = document.getElementById('view-style').value;
  renderProducts(list);
}

// Event listeners for filter, sort, view style
document.getElementById('filter-category').addEventListener('change', applyFilterSortView);
document.getElementById('sort-criteria').addEventListener('change', applyFilterSortView);
document.getElementById('view-style').addEventListener('change', applyFilterSortView);
document.getElementById('rate').addEventListener('input', updateTotals);

// Form submission
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
      updateTotals();
      applyFilterSortView();
    } else {
      console.error(data);
      alert('❌ Failed to send order. Please try again.');
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Something went wrong. Please try again later.');
  }
});
