# FlipToDhaka - Feature & Version Tracker

This document tracks all features of the FlipToDhaka project, their status, and notes per stable version.  

---

## 🌟 Stable Development Version 1.12

<details>
<summary>View Details (click to expand)</summary>

**Lock Date:** 2025-10-19  
**Status:** Locked / Stable  

### Features

| Feature | Description | Status | Notes |
|---------|-------------|--------|-------|
| Product Loading | Products loaded from `products.csv` via PapaParse. | ✅ Working | Automatically parses numeric fields. |
| Product View Styles | Grid / List / Thumbnails selectable via dropdown. | ✅ Working | Layout changes without affecting cart. |
| Category Filter | Filter products by category from CSV. | ✅ Working | Populated dynamically. |
| Sorting | Sort by Price (CAD/BDT) and Weight. | ✅ Working | Live sorting, no reload needed. |
| Exchange Rate Input | User inputs CAD → BDT exchange rate. | ⚠ In Progress | BDT totals update live. |
| Quantity Selection | Quantity (0–10) selection per product. | ✅ Working | Updates sticky cart and totals. |
| Sticky Cart | Shows total items, weight, CAD & BDT totals. | ✅ Working | Collapsible, initially expanded. |
| View Cart Modal | Shows cart items in detail with editable quantity and delete buttons. | ✅ Working | Totals update live. |
| Cart Modal Close | Close button closes modal. | ✅ Working | Bottom close button. |
| Cart Collapse/Expand | Sticky cart can collapse/expand. | ✅ Working | Toggle button with ▲/▼ icon. |
| Order Form | Customer input: name, phone, email, delivery method. | ✅ Working | Required field validation. |
| Submit Order | Sends order details to `/api/send-order`. | ✅ Working | Sends both owner & customer emails via Brevo. |
| Email Notifications | Owner & customer receive order emails via Brevo. | ✅ Working | Requires env vars: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_RECEIVER_EMAIL`, `BREVO_OWNER_TEMPLATE_ID`, `BREVO_CUSTOMER_TEMPLATE_ID`. |
| CSV Parsing | Parses numeric values automatically from CSV. | ✅ Working | Skips empty lines. |

### Notes / Known Issues
- BDT live price updates correctly according to exchange rate.  
- Cart and modal fully functional with quantity updates.  
- Emails require proper Brevo env configuration.  

</details>

---

## 📌 Versioning & Future Features

<details>
<summary>View Version History</summary>

| Version | Key Changes | Status |
|---------|------------|--------|
| 1.12 | Initial stable release with working CSV, cart, view styles, exchange rate, order form, email sending. | ✅ Locked |
| 1.13 | Planned: Fix BDT prices live update, sticky cart 2x2 grid, better view cart modal. | ⚠ In Progress |

</details>

---

## 📝 Recommendations for Tracking
- Create a new branch for each feature.  
- Lock each stable version before adding new features.  
- Update this markdown with feature status (✅ Working, ⚠ In Progress, ❌ Broken).  
- Test all functionalities locally before deploying.

