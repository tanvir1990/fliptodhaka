export default async function handler(req, res) {
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
    const reqBody = await req.json();
    const { name, email, phone, deliveryMethod, orderDetails, totalCAD, totalBDT, totalWeight } = reqBody;

    if (!name || !phone || !orderDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
    const BREVO_RECEIVER_EMAIL = process.env.BREVO_RECEIVER_EMAIL;

    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !BREVO_RECEIVER_EMAIL) {
      console.error("Missing Brevo environment variables.");
      return res.status(500).json({ error: "Server email configuration missing." });
    }

    // 🧾 Email 1: To Shop Owner
    const subjectOwner = `🛍️ New Order from ${name}`;
    const htmlContentOwner = `
      <h2>New Order Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Delivery:</strong> ${deliveryMethod}</p>
      <p><strong>Total:</strong> ${totalCAD} CAD / ${totalBDT} BDT</p>
      <p><strong>Weight:</strong> ${totalWeight} kg</p>
      <h3>Order Details:</h3>
      <pre>${orderDetails}</pre>
    `;

    // 📬 Email 2: Confirmation to Customer
    const subjectCustomer = `✅ Your Order Confirmation - Flip to Dhaka`;
    const htmlContentCustomer = `
      <h2>Thank you for your order, ${name}!</h2>
      <p>We’ve received your order and will contact you soon for confirmation.</p>
      <p><strong>Delivery:</strong> ${deliveryMethod}</p>
      <p><strong>Total:</strong> ${totalCAD} CAD / ${totalBDT} BDT</p>
      <p><strong>Total Weight:</strong> ${totalWeight} kg</p>
      <h3>Order Summary:</h3>
      <pre>${orderDetails}</pre>
      <p>Need help? Reply to this email or call us at our support number.</p>
      <p>— Flip to Dhaka Team</p>
    `;

    const headers = {
      "accept": "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json"
    };

    // Send both emails in parallel
    const [ownerResp, customerResp] = await Promise.all([
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers,
        body: JSON.stringify({
          sender: { email: BREVO_SENDER_EMAIL },
          to: [{ email: BREVO_RECEIVER_EMAIL }],
          subject: subjectOwner,
          htmlContent: htmlContentOwner
        })
      }),
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers,
        body: JSON.stringify({
          sender: { email: BREVO_SENDER_EMAIL, name: "Flip to Dhaka" },
          to: [{ email }],
          subject: subjectCustomer,
          htmlContent: htmlContentCustomer
        })
      })
    ]);

    if (!ownerResp.ok || !customerResp.ok) {
      const err1 = await ownerResp.text();
      const err2 = await customerResp.text();
      console.error("Brevo errors:", err1, err2);
      throw new Error("Failed to send one or more emails.");
    }

    return res.status(200).json({ message: "✅ Both emails sent successfully!" });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Failed to send order." });
  }
}
