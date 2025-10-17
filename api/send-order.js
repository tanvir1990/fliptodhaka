export default async function handler(req, res) {
  // Handle CORS preflight
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

  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    // ✅ Parse JSON body
    const reqBody = await req.json();
    console.log("Received body:", reqBody); // Debugging

    const { name, email, phone, deliveryMethod, orderDetails, totalCAD, totalBDT, totalWeight } = reqBody;

    // Validate required fields
    if (!name || !phone || !orderDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Read EmailJS credentials from environment variables
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("Missing EmailJS environment variables.");
      return res.status(500).json({ error: "EmailJS credentials not configured" });
    }

    // Prepare template parameters
    const templateParams = {
      to_name: "Owner",
      from_name: name,
      phone: phone,
      delivery_method: deliveryMethod,
      order_details: orderDetails,
      total_cad: totalCAD,
      total_bdt: totalBDT,
      total_weight: totalWeight,
      user_email: email,
    };

    // Send email via EmailJS API
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("EmailJS API error:", errorText);
      throw new Error(errorText);
    }

    return res.status(200).json({ message: "Order sent successfully!" });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Failed to send order" });
  }
}
