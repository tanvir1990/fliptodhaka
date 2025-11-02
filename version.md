# 🧾 FlipToDhaka — Version 1.17 (Stable Development Lock)

**Release Type:** Stable  
**Version:** 1.17  
**Deployment:** Vercel  

**Development:** In Progress  
**Dev Version:** 1.18  
---

## 🧩 Overview
Stable release building on v1.16 with **full front-end/cart enhancements and live exchange rate updates**.  
Key improvements include **compact CSS**, **live product filtering & sorting**, **sticky cart collapse/expand logic**, and **refresh protection**.  
All previous modules, including Brevo email integration, remain fully verified and stable.

**Key Updates from v1.16:**
- **Cart & UI Enhancements:**
  - Sticky cart auto-expands to content height, collapses to 40px with triangle toggle.
  - Mobile-friendly sticky cart; desktop shows in corner.
  - Cart modal & product selectors remain in sync on quantity changes.
  - Cart totals live update CAD, BDT, and weight dynamically.
- **Product Rendering & Filtering:**
  - Live exchange rate updates both CAD→BDT pricing in real time.
  - Category filter dynamically populated from CSV.
  - Sorting by CAD/BDT price & weight functional.
  - View style toggle between thumbnails, grid, and list.
- **Order Review & Submission:**
  - Review modal shows complete cart summary with totals.
  - Inline quantity updates reflected in both cart and review modal.
  - Order submission triggers **temporary “Please wait…” notice**.
  - Successful submission resets cart and products seamlessly.
- **Refresh Protection:**
  - Warns user before page reload if cart or form data exists.
- **Compact & Optimized CSS:**
  - Clean, lightweight, responsive styles for all components.
- **API Integration:**
  - `/api/send-order.js` handles CORS, validation, and Brevo emails to both owner & customer.

---

## 🖥️ Front-End Interface
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Responsive Layout | Adaptive container, grid support | ✅ |
| Product Display | Default thumbnails view, toggle grid/list | ✅ |
| Exchange Rate Input | CAD → BDT live updates | ✅ |
| Category Filter | Dynamic from CSV | ✅ |
| Sorting Options | By CAD/BDT price & weight | ✅ |
| View Style Toggle | Switch grid/list/thumbnail | ✅ |
| Sticky Cart | Collapsible, mobile-friendly, dynamic height | ✅ |
| Refresh Confirmation | Warns before data loss | ✅ |
| Order Submission Feedback | Shows "Please wait..." | ✅ |

---

## 🛒 Cart System
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Live Cart Summary | Totals + weight real-time | ✅ |
| Collapse / Expand Cart | Smooth toggle with triangle | ✅ |
| Mobile Sticky Cart | Bottom of screen; desktop top-right | ✅ |
| Add / Remove Products | Quantity selectors in product & modal | ✅ |
| Cart Modal | Editable quantities, live totals | ✅ |
| Sync with Product List | Quantity updates reflected | ✅ |
| Auto Totals | CAD, BDT, weight recalculated live | ✅ |
| Dynamic Height | Adjusts with content & window size | ✅ |
| Reload Protection | Prevents accidental refresh | ✅ |

---

## 📦 Order Review & Confirmation
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Review Modal | Summarizes order before submission | ✅ |
| Customer Info Form | Name, phone, email, delivery method/date/time | ✅ |
| Navigation Flow | Seamless Back ↔ Next | ✅ |
| Validation | Prevents empty/invalid orders | ✅ |
| Status Feedback | Inline success/error messages | ✅ |
| Data Loss Warning | Refresh prompts if data exists | ✅ |
| Order Confirmation Feedback | Temporary "Please wait…" notice | ✅ |

---

## ✉️ Email & API Integration
| Feature | Description | Status |
|:--------|:-------------|:------:|
| `/api/send-order.js` | Handles POST order submissions | ✅ |
| CORS Handling | Preflight support (OPTIONS) | ✅ |
| Brevo Integration | Emails to Owner + Customer | ✅ |
| Template Variables | Injects order details & totals | ✅ |
| Env Validation | Safe checks for missing config | ✅ |
| Structured Responses | JSON success/error returns | ✅ |

---

## 🧮 Data & Performance
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Product Data Import | CSV parsed via PapaParse | ✅ |
| Sanitization | Numeric fields converted safely | ✅ |
| Efficient DOM Render | Dynamic injection of products | ✅ |
| Exchange Rate Binding | Live update on input change | ✅ |
| Lightweight CSS | Compact ~1 KB optimized styles | ✅ |

---

## ⚙️ Technical Details
**Languages:** HTML + CSS + JavaScript (front-end), Node.js (API)  
**Dependencies:** PapaParse 5.3.2, Brevo SMTP API  
**Architecture:** Static front-end + serverless email backend  

**Environment Variables**
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_RECEIVER_EMAIL`
- `BREVO_OWNER_TEMPLATE_ID`
- `BREVO_CUSTOMER_TEMPLATE_ID`
