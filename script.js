// Initialize EmailJS
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


document.getElementById('cart-total-cad').innerText = totalCAD.toFixed(2);
document.getElementById('cart-total-bdt').innerText = totalBDT.toFixed(2);
document.getElementById('cart-total-weight').innerText = totalWeight.toFixed(2);
}


const form = document.getElementById('order-form');
form.addEventListener('submit', e => {
e.preventDefault();
if(Object.keys(cart).length === 0){
alert('Please select at least one product');
return;
}


const templateParams = {
customer_name: form.name.value,
customer_email: form.email.value,
customer_phone: form.phone.value,
delivery_method: form.delivery.value,
total_cad: totalCAD.toFixed(2),
total_bdt: totalBDT.toFixed(2),
total_weight: totalWeight.toFixed(2),
order_items: JSON.stringify(Object.values(cart), null, 2)
};


emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
.then(response => {
alert('Order submitted! Confirmation sent via email.');
form.reset();
updateTotals();
}, error => {
console.error('EmailJS error:', error);
alert('Failed to send order. Please try again later.');
});
});