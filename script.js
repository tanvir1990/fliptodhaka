let products = [];
let cart = {};
let totalCAD = 0, totalBDT = 0, totalWeight = 0;

// Load products from CSV
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("products.csv");
  const text = await response.text();
  products = Papa.parse(text, { header: true, skipEmptyLines: true }).data;

  products.forEach((p) => {
    p["Item Price CAD"] = parseFloat(p["Item Price CAD"]) || 0;
    p["Item Price BDT"] = parseFloat(p["Item Price BDT"]) || 0;
    p["Item Weight"] = parseFloat(p["Item Weight"]) || 0;
  });

  populateCategories();
  renderProducts();
  setupFilters();
  setupViewCartModal();
});

// Populate category filter dropdown
function populateCategories() {
  const categories = [...new Set(products.map((p) => p["Item Category"]))];
  const select = document.getElementById("filter-category");
  select.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Render products
function renderProducts() {
  const list = document.getElementById("product-list");
  const rate = parseFloat(document.getElementById("rate").value) || 1;
  const categoryFilter = document.getElementById("filter-category").value;
  const sortOption = document.getElementById("sort-option").value;
  const viewOption = document.getElementById("view-option").value;

  let filtered = [...products];

  if (categoryFilter) {
    filtered = filtered.filter((p) => p["Item Category"] === categoryFilter);
  }

  // Sorting logic
  switch (sortOption) {
    case "priceCADHigh":
      filtered.sort((a, b) => b["Item Price CAD"] - a["Item Price CAD"]);
      break;
    case "priceCADLow":
      filtered.sort((a, b) => a["Item Price CAD"] - b["Item Price CAD"]);
      break;
    case "priceBDTHigh":
      filtered.sort(
        (a, b) =>
          b["Item Price CAD"] * rate - a["Item Price CAD"] * rate
      );
      break;
    case "priceBDTLow":
      filtered.sort(
        (a, b) =>
          a["Item Price CAD"] * rate - b["Item Price CAD"] * rate
      );
      break;
    case "weightHigh":
      filtered.sort((a, b) => b["Item Weight"] - a["Item Weight"]);
      break;
    case "weightLow":
      filtered.sort((a, b) => a["Item Weight"] - b["Item Weight"]);
      break;
  }

  list.className = `product-list ${viewOption}`;
  list.innerHTML = "";

  filtered.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p["Item Image"]}" alt="${p["Item Name"]}">
      <h3>${p["Item Name"]}</h3>
      <p>${p["Item Category"]}</p>
      <p>${p["Item Price CAD"]} CAD / ${(p["Item Price CAD"] * rate).toFixed(
      2
    )} BDT</p>
      <label>Qty: 
        <select data-idx="${i}" onchange="updateTotals()">
          ${Array.from({ length: 11 }, (_, n) => `<option value="${n}">${n}</option>`).join("")}
        </select>
      </label>
    `;
    list.appendChild(div);
  });
}

function setupFilters() {
  document.getElementById("filter-category").addEventListener("change", renderProducts);
  document.getElementById("sort-option").addEventListener("change", renderProducts);
  document.getElementById("view-option").addEventListener("change", renderProducts);
  document.getElementById("rate").addEventListener("input", renderProducts);
}

// Update totals and cart data
function updateTotals() {
  const rate = parseFloat(document.getElementById("rate").value) || 1;
  totalCAD = 0;
  totalBDT = 0;
  totalWeight = 0;
  cart = {};

  document.querySelectorAll("select[data-idx]").forEach((input) => {
    const qty = parseInt(input.value) || 0;
    const idx = input.dataset.idx;
    if (qty > 0) {
      const p = products[idx];
      cart[idx] = { ...p, qty };
      totalCAD += qty * p["Item Price CAD"];
      totalBDT += qty * p["Item Price CAD"] * rate;
      totalWeight += qty * p["Item Weight"];
    }
  });

  updateCartDisplay();
}

// Update sticky cart display
function updateCartDisplay() {
  const rate = parseFloat(document.getElementById("rate").value) || 1;
  const totalItems = Object.values(cart).reduce((sum, p) => sum + p.qty, 0);

  document.getElementById("cart-items-count").innerText = totalItems;
  document.getElementById("cart-total-weight").innerText = totalWeight.toFixed(2);
  document.getElementById("cart-total-cad").innerText = totalCAD.toFixed(2);
  document.getElementById("cart-total-bdt").innerText = totalBDT.toFixed(2);

  renderCartModal(); // live update inside modal
}

// Setup modal logic
function setupViewCartModal() {
  const viewCartBtn = document.getElementById("view-cart-btn");
  const modal = document.getElementById("cart-modal");
  const closeModalBtn = document.getElementById("close-cart");

  viewCartBtn.addEventListener("click", () => {
    renderCartModal();
    modal.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// Render cart modal contents
function renderCartModal() {
  const modalItems = document.getElementById("cart-modal-items");
  const modalTotals = document.getElementById("cart-modal-totals");

  modalItems.innerHTML = "";

  if (Object.keys(cart).length === 0) {
    modalItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    Object.entries(cart).forEach(([idx, p]) => {
      const div = document.createElement("div");
      div.className = "modal-item";
      div.innerHTML = `
        <span>${p["Item Name"]} (${p.qty} × ${p["Item Price CAD"]} CAD)</span>
        <button class="delete-btn" data-idx="${idx}">❌</button>
      `;
      modalItems.appendChild(div);
    });
  }

  modalTotals.innerHTML = `
    <p><strong>Total Items:</strong> ${Object.values(cart).reduce((sum, p) => sum + p.qty, 0)}</p>
    <p><strong>Total Weight:</strong> ${totalWeight.toFixed(2)} kg</p>
    <p><strong>Total Price (CAD):</strong> ${totalCAD.toFixed(2)}</p>
    <p><strong>Total Price (BDT):</strong> ${totalBDT.toFixed(2)}</p>
  `;

  // Attach delete listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.idx;
      delete cart[idx];
      // Reset the corresponding dropdown to 0
      const select = document.querySelector(`select[data-idx='${idx}']`);
      if (select) select.value = "0";
      updateTotals(); // instantly refresh cart totals & modal
    });
  });
}

// Submit order
const form = document.getElementById("order-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (Object.keys(cart).length === 0) {
    alert("Please select at least one product.");
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
    orderDetails: JSON.stringify(Object.values(cart), null, 2),
  };

  try {
    const res = await fetch("/api/send-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Order submitted! You will receive confirmation via email.");
      form.reset();
      cart = {};
      updateTotals();
    } else {
      console.error(data);
      alert("❌ Failed to send order. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Something went wrong. Please try again later.");
  }
});
