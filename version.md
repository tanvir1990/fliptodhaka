# FlipToDhaka - Feature & Version Tracker (Checklist View)

## 🌟 Stable Development Version 1.12

**Lock Date:** 2025-10-19  
**Status:** Locked / Stable  

### ✅ Feature Checklist

| Feature | Status | Notes |
|---------|--------|-------|
| Product Loading from CSV | ✅ Working | Parses numeric fields automatically. |
| Product View Styles (Grid/List/Thumbnails) | ✅ Working | Changes layout without affecting cart. |
| Category Filter | ✅ Working | Populated dynamically from CSV. |
| Sorting (CAD/BDT/Weight) | ✅ Working | Live sorting, no page reload. |
| Exchange Rate Input (CAD → BDT) | ✅ Working | Updates BDT totals live in sticky cart & modal. |
| Quantity Selection (0–10 per product) | ✅ Working | Updates sticky cart, modal totals, and product display. |
| Sticky Cart | ✅ Working | Shows total items, weight, CAD & BDT totals; collapsible. |
| Cart Collapse/Expand | ✅ Working | Toggle with ▲/▼ icon. |
| View Cart Modal | ✅ Working | Editable quantity, delete items, live totals update. |
| Cart Modal Close Button | ✅ Working | Closes modal reliably. |
| Order Form (Name, Phone, Email, Delivery) | ✅ Working | Required field validation in place. |
| Submit Order | ✅ Working | Sends order details to `/api/send-order`. |
| Email Notifications (Owner & Customer) | ✅ Working | Sends emails via Brevo; requires proper env vars. |
| CSV Parsing & Cleanup | ✅ Working | Skips empty lines, converts numeric fields automatically. |

### Notes / Known Issues
- All features in 1.12 are **fully functional**.  
- Emails require valid Brevo environment variables:  
  `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_RECEIVER_EMAIL`, `BREVO_OWNER_TEMPLATE_ID`, `BREVO_CUSTOMER_TEMPLATE_ID`.  

---

## 📌 Version History

| Version | Key Changes | Status |
|---------|------------|--------|
| 1.12 | Stable release with working CSV, cart, exchange rate, view styles, quantity selection, order form, email notifications. | ✅ Locked |
| 1.13 | Planned: Fix BDT live price updates, sticky cart 2x2 grid, improved cart modal UX. | ⚠ In Progress |

---

## 📝 Recommendations
- Lock each stable version before adding new features.  
- Use branches for individual features for safer development.  
- Update this checklist as you test new features.  
- Test all functionalities locally before deploying to production.
