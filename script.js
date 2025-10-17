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
  renderProducts(products);
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
      cart[idx] = { ...p, qty }
