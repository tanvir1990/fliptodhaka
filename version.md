# 🧾 FlipToDhaka — Version 1.16 (Stable Development Lock)

**Release Type:** Stable  
**Version:** 1.16  
**Deployment:** Vercel  

**Development:** In Progress  
**Dev Version:** 1.17  
---

## 🧩 Overview
Stable release building upon Version 1.15 with **enhanced order confirmation feedback** for customers.  
This version ensures users see a **“Please wait while we confirm your order”** message while emails are being processed, improving the user experience during order submission.  
All previous modules, front-end and API integrations, remain fully verified and stable.

**Key Updates from v1.15:**
- Added **order submission feedback**:  
  - Shows temporary message *“Please wait while we confirm your order…”* after customer clicks **Submit Order**.  
  - Message is removed once both emails (owner + customer) are successfully sent.  
  - Original success alert *“Both emails sent successfully”* is retained after processing.  
- Ensures users are informed of backend activity during the short email sending delay.  
- No visual or layout changes outside of the temporary notice.  
- All previous features (cart, review modal, refresh protection, Brevo email integration) fully intact.

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
| **Order Submission Feedback** | Shows "Please wait..." during order processing | ✅ |

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
| **Order Confirmation Feedback** | Temporary notice during email processing | ✅ |

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
