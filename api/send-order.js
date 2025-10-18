// Import fetch in CommonJS environment
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function handler(req, res) {
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
    const { name, email, phone, deliveryMethod, orderDetails, totalCAD, totalBDT, totalWeight } = req.body;

    if (!name || !phone || !orderDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // --- Environment variables ---
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
    const BREVO_RECEIVER_EMAIL = process.env.BREVO_RECEIVER_EMAIL;
    const OWNER_TEMPLATE_ID = process.env.BREVO_OWNER_TEMPLATE_ID;
    const CUSTOMER_TEMPLATE_ID = process.env.BREVO_CUSTOMER_TEMPLATE_ID;

    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !BREVO_RECEIVER_EMAIL || !OWNER_TEMPLATE_ID || !CUSTOMER_TEMPLATE_ID) {
      console.error("Missing Brevo environment variables.");
      return res.status(500).json({ error: "Server email configuration missing." });
    }

    const headers = {
      "accept": "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json"
    };

    // --- Send emails using templates ---
    const [ownerResp, customerResp] = await Promise.all([
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers,
        body: JSON.stringify({
          templateId: OWNER_TEMPLATE_ID,
          params: { name, phone, email, deliveryMethod, orderDetails, totalCAD, totalBDT, totalWeight },
          sender: { email: BREVO_SENDER_EMAIL, name: "Flip to Dhaka" },
          to: [{ email: BREVO_RECEIVER_EMAIL }]
        })
      }),
      email
        ? fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers,
            body: JSON.stringify({
              templateId: CUSTOMER_TEMPLATE_ID,
              params: { name, phone, email, deliveryMethod, orderDetails, totalCAD, totalBDT, totalWeight },
              sender: { email: BREVO_SENDER_EMAIL, name: "Flip to Dhaka" },
              to: [{ email }]
            })
          })
        : Promise.resolve({ ok: true, status: 200, text: async () => "Skipped" })
    ]);

    // --- Parse Brevo responses safely ---
    let err1 = { status: ownerResp.status, text: await ownerResp.text() };
    let err2 = { status: customerResp.status, text: await customerResp.text() };

    if (!ownerResp.ok || !customerResp.ok) {
      console.error("Brevo errors:", err1, err2);
      return res.status(500).json({
        error: "Failed to send one or more emails.",
        details: { owner: err1, customer: err2 }
      });
    }

    return res.status(200).json({ message: "✅ Both emails sent successfully!", details: { owner: err1, customer: err2 } });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Failed to send order.", details: err.message || err });
  }
};
