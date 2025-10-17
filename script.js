let products = [];
let cart = {};
let totalCAD = 0, totalBDT = 0, totalWeight = 0;

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

  renderProducts();
});

function renderProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p['Item Image']}" alt="${p['Item Name']}">
      <h3>${p['Item Name']}</h3>
      <p>${p['Item Category']}</p>
      <p>${p['Item Price CAD']} CAD / ${p['Item Price BDT']} BDT</p>
      <label>Qty: <input type="number" min="0" max="20" value="0" data-idx="${i}" onchange="updateTotals()"></label>
    `;
    list.appendChild(div);
  });
}

function updateTotals() {
  const rate = parseFloat(document.getElementById('rate').value) || 1;
  totalCAD = 0; totalBDT = 0; totalWeight = 0;
  cart = {};

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

  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  Object.values(cart).forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p['Item Name']} x ${p.qty} = ${(p['Item Price CAD']*p.qty).toFixed(2)} CAD`;
    cartItems.appendChild(li);
  });

  document.getElementById('cart-total-cad').innerText = totalCAD.toFixed(2);
  document.getElementById('cart-total-bdt').innerText = totalBDT.toFixed(2);
  document.getElementById('cart-total-weight').innerText = totalWeight.toFixed(2);
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
