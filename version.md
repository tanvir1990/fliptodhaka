# 🧾 FlipToDhaka — Version 1.18 (Stable Development Lock)

**Release Type:** Stable  
**Version:** 1.18  
**Deployment:** Vercel  

**Development:** Completed  
**Dev Version:** 1.18  
---

## 🧩 Overview
Stable release building on v1.17 with **enhanced Review Order modal, delivery date restrictions, and improved totals display**.  
Key improvements include **delivery date picker restrictions**, **totals displayed in 2x2 grids for cart & review modals**, and **delivery instructions added**.  
All previous modules, including Brevo email integration and sticky cart functionality, remain fully verified and stable.

**Key Updates from v1.17:**
- **Review Order & Delivery Enhancements:**
  - Delivery date can only be selected on **Tuesday, Thursday, and Saturday**.
  - Past dates and dates beyond **two months in advance** are disabled.
  - Greyed out dates in calendar for unavailable delivery days.
  - Delivery time removed; added informational text: "Delivery currently available only to Hotel between 9pm-12am. Please contact us to arrange alternatives."

- **Cart & Review Totals Grid:**
  - Totals displayed in **2x2 grid** for both Cart Modal and Review Modal.
  - Labels bolded for better readability.
- **General Improvements:**
  - Maintained live totals updates (CAD, BDT, weight) in both cart and review modal.
  - All previous cart, filtering, sorting, and exchange rate features preserved.
  - Flatpickr library used for date picker with disabled days.

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
| Delivery Date Picker | Restricted days + max 2 months | ✅ |
| Delivery Info Text | Clear instructions for users | ✅ |

---

## 🛒 Cart System
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Live Cart Summary | Totals + weight real-time | ✅ |
| Collapse / Expand Cart | Smooth toggle with triangle | ✅ |
| Mobile Sticky Cart | Bottom of screen; desktop top-right | ✅ |
| Add / Remove Products | Quantity selectors in product & modal | ✅ |
| Cart Modal | Editable quantities, live totals in 2x2 grid | ✅ |
| Sync with Product List | Quantity updates reflected | ✅ |
| Auto Totals | CAD, BDT, weight recalculated live | ✅ |
| Dynamic Height | Adjusts with content & window size | ✅ |
| Reload Protection | Prevents accidental refresh | ✅ |

---

## 📦 Order Review & Confirmation
| Feature | Description | Status |
|:--------|:-------------|:------:|
| Review Modal | Summarizes order before submission | ✅ |
| Totals Grid | 2x2 display of items, weight, CAD & BDT | ✅ |
| Customer Info Form | Name, phone, email, delivery date | ✅ |
| Delivery Restrictions | Only Tue/Thu/Sat; no past dates; max 2 months | ✅ |
| Delivery Instructions | Text indicating delivery hours | ✅ |
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
**Dependencies:** PapaParse 5.3.2, Brevo SMTP API, Flatpickr  
**Architecture:** Static front-end + serverless email backend  

**Environment Variables**
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_RECEIVER_EMAIL`
- `BREVO_OWNER_TEMPLATE_ID`
- `BREVO_CUSTOMER_TEMPLATE_ID`
