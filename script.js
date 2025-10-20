// --- version log: v1.12 + Review Order Modal ---

let products = [];
let cart = {};
let totalCAD = 0, totalBDT = 0, totalWeight = 0;

// --- Load products ---
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('products.csv');
    const text = await response.text();
    products = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
    products.forEach(p => {
      p['Item Price CAD'] = parseFloat(p['Item Price CAD']) || 0;
      p['Item Price BDT'] = parseFloat(p['Item Price BDT']) || 0;
      p['Item Weight'] = parseFloat(p['Item Weight']) || 0;
    });
    console.log("📦 Products loaded:", products);
    populateCategoryFilter();
    renderProducts();
    updateTotals();
  } catch(err) {
    console.error("❌ Failed to load products:", err);
    alert("Failed to load products. Check console for details.");
  }
});

// --- Populate category filter ---
function populateCategoryFilter() {
  const categorySet = new Set(products.map(p => p['Item Category']));
  const filter = document.getElementById('category-filter');
  categorySet.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
}

// --- Render products ---
function renderProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  const rate = parseFloat(document.getElementById('rate').value) || 1;
  const selectedQuantities = {};
  Object.entries(cart).forEach(([idx, p]) => selectedQuantities[idx] = p.qty);

  products.forEach((p,i) => {
    const div = document.createElement('div');
    div.className='product';
    div.dataset.idx=i;
    div.innerHTML=`
      <img src="${p['Item Image']}" alt="${p['Item Name']}">
      <h3>${p['Item Name']}</h3>
      <p>${p['Item Category']}</p>
      <p>${p['Item Price CAD']} CAD / ${(p['Item Price CAD']*rate).toFixed(2)} BDT</p>
      <label>Qty: 
        <select data-idx="${i}">
          ${[...Array(11).keys()].map(q => `<option value="${q}" ${q===selectedQuantities[i]?'selected':''}>${q}</option>`).join('')}
        </select>
      </label>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll('.product select').forEach(sel => sel.addEventListener('change', updateTotals));
}

// --- Update totals ---
function updateTotals() {
  const rate = parseFloat(document.getElementById('rate').value) || 1;
  totalCAD=0; totalBDT=0; totalWeight=0; cart={};

  document.querySelectorAll('.product select').forEach(sel => {
    const qty=parseInt(sel.value)||0;
    const idx=sel.dataset.idx;
    if(qty>0){
      const p=products[idx];
      cart[idx]={...p, qty};
      totalCAD += qty*p['Item Price CAD'];
      totalBDT += qty*p['Item Price CAD']*rate;
      totalWeight += qty*p['Item Weight'];
    }
  });

  document.getElementById('cart-total-items').innerText=Object.values(cart).reduce((a,p)=>a+p.qty,0);
  document.getElementById('cart-total-cad').innerText=totalCAD.toFixed(2);
  document.getElementById('cart-total-bdt').innerText=totalBDT.toFixed(2);
  document.getElementById('cart-total-weight').innerText=totalWeight.toFixed(2);

  renderCartModal();
  console.log("🛒 Cart updated:", cart, { totalCAD, totalBDT, totalWeight });
}

// --- Render Cart Modal ---
function renderCartModal() {
  const container=document.getElementById('cart-modal-items');
  container.innerHTML='';
  const rate=parseFloat(document.getElementById('rate').value)||1;

  Object.entries(cart).forEach(([idx,p]) => {
    const div=document.createElement('div');
    div.className='cart-item';
    div.innerHTML=`
      <div>${p['Item Name']}</div>
      <select data-idx="${idx}">
        ${[...Array(11).keys()].map(q => `<option value="${q}" ${q==p.qty?'selected':''}>${q}</option>`).join('')}
      </select>
      <div>${(p['Item Price CAD']*p.qty).toFixed(2)} CAD</div>
      <div>${(p['Item Price CAD']*rate*p.qty).toFixed(2)} BDT</div>
      <button data-idx="${idx}">Delete</button>
    `;
    container.appendChild(div);
  });

  document.getElementById('modal-total-items').innerText=Object.values(cart).reduce((a,p)=>a+p.qty,0);
  document.getElementById('modal-total-cad').innerText=totalCAD.toFixed(2);
  document.getElementById('modal-total-bdt').innerText=totalBDT.toFixed(2);
  document.getElementById('modal-total-weight').innerText=totalWeight.toFixed(2);

  // Quantity change in modal
  container.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', e => {
      const idx=e.target.dataset.idx;
      const newQty=parseInt(e.target.value);
      if(newQty===0) delete cart[idx];
      else cart[idx].qty=newQty;
      const prodSelect=document.querySelector(`.product select[data-idx="${idx}"]`);
      if(prodSelect) prodSelect.value=newQty;
      updateTotals();
    });
  });

  // Delete button
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx=e.target.dataset.idx;
      delete cart[idx];
      const prodSelect=document.querySelector(`.product select[data-idx="${idx}"]`);
      if(prodSelect) prodSelect.value=0;
      updateTotals();
    });
  });
}

// --- Cart modal open/close ---
document.getElementById('view-cart-btn').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display='flex';
});
document.getElementById('close-cart-btn').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display='none';
});

// --- Proceed to Review Order ---
document.getElementById('proceed-order-btn').addEventListener('click', () => {
  if(Object.keys(cart).length===0){ alert("Cart is empty!"); return; }
  populateReviewModal();
  document.getElementById('cart-modal').style.display='none';
  document.getElementById('review-modal').style.display='flex';
});

// --- Back to Cart from Review ---
document.getElementById('back-to-cart-btn').addEventListener('click', () => {
  document.getElementById('review-modal').style.display='none';
  document.getElementById('cart-modal').style.display='flex';
});

// --- Populate Review Modal ---
function populateReviewModal() {
  const reviewItems=document.getElementById('review-items');
  reviewItems.innerHTML='';
  const rate=parseFloat(document.getElementById('rate').value)||1;
  Object.entries(cart).forEach(([idx,p],i) => {
    const div=document.createElement('div');
    div.className='review-item';
    div.innerHTML=`
      <div>${p['Item Name']}</div>
      <div>${p.qty}</div>
      <div>${(p['Item Price CAD']*p.qty).toFixed(2)} CAD</div>
      <div>${(p['Item Price CAD']*rate*p.qty).toFixed(2)} BDT</div>
    `;
    reviewItems.appendChild(div);
  });

  document.getElementById('review-total-items').innerText=Object.values(cart).reduce((a,p)=>a+p.qty,0);
  document.getElementById('review-total-cad').innerText=totalCAD.toFixed(2);
  document.getElementById('review-total-bdt').innerText=totalBDT.toFixed(2);
  document.getElementById('review-total-weight').innerText=totalWeight.toFixed(2);
}

// --- Submit order from Review Modal ---
document.getElementById('review-order-form').addEventListener('submit', async e => {
  e.preventDefault();
  if(Object.keys(cart).length===0){ alert("Cart is empty!"); return; }

  const name=document.getElementById('review-name').value.trim();
  const phone=document.getElementById('review-phone').value.trim();
  const email=document.getElementById('review-email').value.trim();
  const deliveryMethod=document.getElementById('review-delivery').value;

  const orderDetails=Object.values(cart).map((p,i) => `${i+1}. ${p['Item Name']} — Qty: ${p.qty} — ${p['Item Price CAD']} CAD — ${(p['Item Price CAD']*parseFloat(document.getElementById('rate').value)).toFixed(2)} BDT`).join("\n");

  const payload={ name, phone, email, deliveryMethod, orderDetails, totalCAD: totalCAD.toFixed(2), totalBDT: totalBDT.toFixed(2), totalWeight: totalWeight.toFixed(2) };
  console.log("📝 Sending order:", payload);

  try {
    const resp = await fetch('/api/send-order', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const text = await resp.text();
    let result;
    try{ result = JSON.parse(text); } catch(e){ result={error: text}; }

    if(!resp.ok){
      console.error("❌ Network/server error while sending order:", result);
      alert("Failed to send order. Check console for details.");
      return;
    }

    console.log("✅ Order response:", result);
    alert(result.message || "Order sent successfully!");
    document.getElementById('review-modal').style.display='none';
  } catch(err){
    console.error("💥 Error sending order:", err);
    alert("Failed to send order. Check console for details.");
  }
});

// --- Filter & sort ---
document.getElementById('category-filter').addEventListener('change', filterProducts);
document.getElementById('sort-by').addEventListener('change', filterProducts);
document.getElementById('view-style').addEventListener('change', changeViewStyle);

function filterProducts() {
  const cat=document.getElementById('category-filter').value;
  const sortBy=document.getElementById('sort-by').value;
  const rate=parseFloat(document.getElementById('rate').value)||1;
  let filtered=products;
  if(cat!=='all') filtered=filtered.filter(p => p['Item Category']===cat);

  switch(sortBy){
    case 'price-cad-low': filtered.sort((a,b)=>a['Item Price CAD']-b['Item Price CAD']); break;
    case 'price-cad-high': filtered.sort((a,b)=>b['Item Price CAD']-a['Item Price CAD']); break;
    case 'price-bdt-low': filtered.sort((a,b)=>a['Item Price CAD']*rate-b['Item Price CAD']*rate); break;
    case 'price-bdt-high': filtered.sort((a,b)=>b['Item Price CAD']*rate-a['Item Price CAD']*rate); break;
    case 'weight-low': filtered.sort((a,b)=>a['Item Weight']-b['Item Weight']); break;
    case 'weight-high': filtered.sort((a,b)=>b['Item Weight']-a['Item Weight']); break;
  }

  const list=document.getElementById('product-list');
  const selectedQuantities={};
  Object.entries(cart).forEach(([idx,p])=>selectedQuantities[idx]=p.qty);
  list.innerHTML='';
  filtered.forEach(p=>{
    const idx=products.indexOf(p);
    const div=document.createElement('div');
    div.className='product';
    div.dataset.idx=idx;
    div.innerHTML=`
      <img src="${p['Item Image']}" alt="${p['Item Name']}">
      <h3>${p['Item Name']}</h3>
      <p>${p['Item Category']}</p>
      <p>${p['Item Price CAD']} CAD / ${(p['Item Price CAD']*rate).toFixed(2)} BDT</p>
      <label>Qty: 
        <select data-idx="${idx}">
          ${[...Array(11).keys()].map(q=>`<option value="${q}" ${q===selectedQuantities[idx]?'selected':''}>${q}</option>`).join('')}
        </select>
      </label>
    `;
    list.appendChild(div);
  });
  document.querySelectorAll('.product select').forEach(sel=>sel.addEventListener('change', updateTotals));
}

function changeViewStyle(){
  const view=document.getElementById('view-style').value;
  const list=document.getElementById('product-list');
  list.className='product-list '+view;
}

// --- Cart collapse/expand ---
const cartSummary=document.getElementById('cart-summary');
const collapseBtn=document.getElementById('collapse-cart-btn');
collapseBtn.addEventListener('click', ()=>{
  cartSummary.classList.toggle('collapsed');
  collapseBtn.textContent=cartSummary.classList.contains('collapsed')?'▲':'▼';
});

// --- Live exchange rate update ---
document.getElementById('rate').addEventListener('input', ()=>{
  renderProducts(); // update product BDT prices live
  updateTotals();   // update cart totals live
});
