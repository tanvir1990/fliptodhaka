# 🧾 FlipToDhaka — Version 1.15 (Stable Development Lock)

**Release Type:** Stable  
**Version:** 1.15  
**Deployment:** Vercel  

**Development:** In Progress  
**Dev Version:** 1.16  
---

## 🧩 Overview
Stable release building upon Version 1.14 with a **new refresh confirmation safeguard** to prevent accidental data loss.  
Includes all previously verified modules: **sticky cart**, **cart modal syncing**, **review order flow**, and **email integration**.  
This version enhances user experience by ensuring cart and form data aren’t lost unintentionally during page reloads.

**Key Updates from v1.14:**
- Added **refresh confirmation prompt** when user attempts to reload the page with existing cart or review data.  
- User receives alert: *“Refreshing the page will Clear the Cart and all information. Would you like to continue?”*  
- Selecting **Yes** refreshes and clears everything; selecting **No** cancels the reload.  
- Implementation uses native browser confirmation (no layout or style changes).  
- No other functions or visuals modified.

---

## 🖥️ Front-End Interface
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Responsive Layout | Adaptive container, grid support | ✅ |
| Product Display | Default **thumbnails view**, Grid / List toggle | ✅ |
| Exchange Rate Input | CAD → BDT conversion with live updates | ✅ |
| Category Filter | Dynamically populated from CSV data | ✅ |
| Sorting Options | Sort by price (CAD/BDT) and weight | ✅ |
| View Style Toggle | Switch between grid, list, or thumbnail layouts | ✅ |
| **Refresh Confirmation** | Prevents accidental data loss on reload | ✅ |

---

## 🛒 Cart System
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Live Cart Summary | Displays totals + weight in real time | ✅ |
| Collapse / Expand Cart | Smooth visibility toggle with proper triangle ▲/▼ | ✅ |
| Mobile Sticky Cart | Fixed at bottom on mobile; desktop stays top-right | ✅ |
| Add / Remove Products | Real-time updates with quantity control | ✅ |
| Cart Modal | Shows selected items + editable quantities | ✅ |
| Sync with Product List | Cart and product selectors stay in sync | ✅ |
| Auto Totals | Live recalculation of CAD, BDT, and weight | ✅ |
| Dynamic Height | Sticky cart expands/collapses based on content & window size | ✅ |
| **Reload Protection** | Prompts before page refresh when cart is not empty | ✅ |

---

## 📦 Order Review & Confirmation
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Review Modal | Summarizes order before submission | ✅ |
| Customer Info Form | Name, phone, email, delivery method, time | ✅ |
| Navigation Flow | Seamless Back ↔ Next navigation | ✅ |
| Validation | Prevents empty or invalid orders | ✅ |
| Status Feedback | Inline success/error messages | ✅ |
| **Data Loss Warning** | Warns before refresh if form contains info | ✅ |

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
