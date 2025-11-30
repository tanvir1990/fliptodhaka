module.exports = async (req, res) => {
  // --- CORS preflight ---
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    // --- Parse request body ---
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const bodyString = Buffer.concat(buffers).toString();
    const reqBody = JSON.parse(bodyString);
    console.log("📥 Incoming order Details From User Input:", reqBody);

    const { name, email, phone, deliveryDate, orderDetails, totalCAD, totalBDT, totalWeight } = reqBody;

    if (!name || !phone || !orderDetails) {
      console.warn("⚠️ Missing required fields:", { name, phone, orderDetails });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // --- Generate Order ID ---
    function generateOrderId(customerName) {
      const estDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
      const yyyy = estDate.getFullYear();
      const mm = String(estDate.getMonth() + 1).padStart(2, "0");
      const dd = String(estDate.getDate()).padStart(2, "0");

      let hours = estDate.getHours();
      const minutes = String(estDate.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const hh = String(hours).padStart(2, "0");

      const cleanName = customerName.replace(/\s+/g, "").toLowerCase();
      return `${cleanName}-${yyyy}-${mm}-${dd}-${hh}-${minutes}-${ampm}`;
    }

    const orderId = generateOrderId(name);

    // --- Brevo Environment Variables ---
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
    const BREVO_RECEIVER_EMAIL = process.env.BREVO_RECEIVER_EMAIL;
    const OWNER_TEMPLATE_ID = Number(process.env.BREVO_OWNER_TEMPLATE_ID);
    const CUSTOMER_TEMPLATE_ID = Number(process.env.BREVO_CUSTOMER_TEMPLATE_ID);

    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !BREVO_RECEIVER_EMAIL || !OWNER_TEMPLATE_ID || !CUSTOMER_TEMPLATE_ID) {
      console.error("❌ Missing Brevo env variables");
      return res.status(500).json({ error: "Server email configuration missing." });
    }

    const headers = {
      accept: "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
    };

    // --- Owner Email Data (Updated with Order ID & Customer Info) ---
    const ownerEmailData = {
      templateId: OWNER_TEMPLATE_ID,
      params: {
        orderId,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        deliveryDate: deliveryDate,
        orderDetails,
        totalCAD,
        totalBDT,
        totalWeight
      },
      sender: { email: BREVO_SENDER_EMAIL, name: "Flip to Dhaka" },
      to: [{ email: BREVO_RECEIVER_EMAIL }],
    };

    // --- Customer Email Data (unchanged for now) ---
    const customerEmailData = {
      templateId: CUSTOMER_TEMPLATE_ID,
      params: { name, phone, email, deliveryDate, orderDetails, totalCAD, totalBDT, totalWeight },
      sender: { email: BREVO_SENDER_EMAIL, name: "Flip to Dhaka" },
      to: [{ email }],
    };

    // --- Send Owner Email ---
    console.log("📤 Sending ownerEmailData:", JSON.stringify(ownerEmailData, null, 2)); //Log Before Sending
    const ownerResp = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers, body: JSON.stringify(ownerEmailData) });
    const ownerText = await ownerResp.text();

    // --- Send Customer Email ---
    let customerResp, customerText;
    if (email) {
      customerResp = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers, body: JSON.stringify(customerEmailData) });
      customerText = await customerResp.text();
    } else { customerResp = { ok: true }; customerText = "skipped"; }

    if (!ownerResp.ok || (email && !customerResp.ok)) {
      return res.status(500).json({ error: "Failed to send emails", details: { ownerText, customerText } });
    }

    return res.status(200).json({ success: true, message: "✅ Both emails sent successfully!" });

  } catch (err) {
    console.error("💥 Server error:", err);
    return res.status(500).json({ error: "Server error occurred", details: err.message || err });
  }
};
