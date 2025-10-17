// Initialize EmailJS
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key


let products = [];
let cart = {};
let totalCAD = 0, totalBDT = 0, totalWeight = 0;


document.addEventListener('DOMContentLoaded', async () => {
const response = await fetch('products.xlsx');
const data = await response.arrayBuffer();
const workbook = XLSX.read(data, { type: 'array' });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
products = XLSX.utils.sheet_to_json(sheet);
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
cart[idx] = {...p, qty};
totalCAD += qty * parseFloat(p['Item Price CAD']);
totalBDT += qty * parseFloat(p['Item Price CAD']) * rate;
totalWeight += qty * parseFloat(p['Item Weight']);
}
});


// Update cart panel
const cartItems = document.getElementById('cart-items');
cartItems.innerHTML = '';
Object.values(cart).forEach(p => {
const li = document.createElement('li');
li.textContent = `${p['Item Name']} x ${p.qty} = ${ (p['Item Price CAD']*p.qty).toFixed(2) } CAD`;
cartItems.appendChild(li);
});