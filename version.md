# 🧾 FlipToDhaka — Version 1.13.1 (Stable Development Lock)

**Release Type:** Stable  
**Version:** 1.13.1  
**Deployment:** Vercel  

---

## 🧩 Overview
Stable release consolidating all verified modules from previous builds.  
Includes the finalized **Review Order Modal**, working **email delivery**, fully tested **cart logic**, and **UI/UX improvements** for mobile and product display.

**Key Updates from v1.13:**
- Sticky cart repositioned to bottom of the screen on mobile devices (Android / iOS browsers) while preserving collapse/expand and live totals.
- Product list default view set to **thumbnail grid** on page load. Other view toggles (grid/list) remain functional.

---

## 🖥️ Front-End Interface
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Responsive Layout | Adaptive container, grid support | ✅ |
| Product Display | **Default thumbnails view**, Grid / List toggle | ✅ |
| Exchange Rate Input | CAD → BDT conversion with live updates | ✅ |
| Category Filter | Dynamically populated from CSV data | ✅ |
| Sorting Options | Sort by price (CAD/BDT) and weight | ✅ |
| View Style Toggle | Switch between grid and list layouts | ✅ |

---

## 🛒 Cart System
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Live Cart Summary | Displays totals + weight in real time | ✅ |
| Collapse / Expand Cart | Smooth visibility toggle | ✅ |
| **Mobile Sticky Cart** | Fixed at bottom on mobile; desktop stays top-right | ✅ |
| Add / Remove Products | Real-time updates with quantity control | ✅ |
| Cart Modal | Shows selected items + editable quantities | ✅ |
| Sync with Product List | Cart and product selectors stay in sync | ✅ |
| Auto Totals | Live recalculation of CAD, BDT, and weight | ✅ |

---

## 📦 Order Review & Confirmation
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Review Modal | Summarizes order before submission | ✅ |
| Customer Info Form | Name, phone, email, delivery method, time | ✅ |
| Navigation Flow | Seamless Back ↔ Next navigation | ✅ |
| Validation | Prevents empty or invalid orders | ✅ |
| Status Feedback | Inline success/error messages | ✅ |

---

## ✉️ Email & API Integration
| Feature | Description | Status |
|:--------|:-------------|:------:|
| `/api/send-order.js` | Handles POST order submissions | ✅ |
| CORS Handling | Preflight support (OPTIONS) | ✅ |
| Brevo Integration | Sends emails to Owner + Customer | ✅ |
| Template Variables | Injects order details and totals | ✅ |
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
| Lightweight CSS | Compact ≈ 1 KB optimized styles | ✅ |

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
