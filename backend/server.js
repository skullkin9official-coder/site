// ===============================
// ERRORVERSE SERVER (server.js)
// PayPal + PlayFab Subscription System
// Title ID: 1FC26D
// ===============================

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// -------------------------------
// ENVIRONMENT VARIABLES
// -------------------------------
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PLAYFAB_SECRET = process.env.PLAYFAB_SECRET;
const PLAYFAB_TITLE = process.env.PLAYFAB_TITLE || "1FC26D";

// Validate Env Vars
if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET || !PLAYFAB_SECRET) {
  console.error("❌ Missing environment variables! Check your .env file.");
  process.exit(1);
}

// -------------------------------
// PayPal: Generate Access Token
// -------------------------------
async function generatePayPalToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

  const res = await axios.post(
    "https://api-m.paypal.com/v1/oauth2/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
}

// -------------------------------
// PayPal: Capture Payment
// -------------------------------
async function captureOrder(orderId) {
  const accessToken = await generatePayPalToken();

  const res = await axios.post(
    `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
}

// -------------------------------
// PlayFab: Add Subscription Days
// -------------------------------
async function giveSubscription(playfabId, days) {
  return axios.post(
    `https://${PLAYFAB_TITLE}.playfabapi.com/Server/UpdateUserData`,
    {
      PlayFabId: playfabId,
      Data: {
        subscriptionDays: String(days),
        subscriptionActive: "true",
      },
    },
    {
      headers: {
        "X-SecretKey": PLAYFAB_SECRET,
      },
    }
  );
}

// -------------------------------
// ENDPOINT: 1-Month Purchase
// -------------------------------
app.post("/purchase/1m", async (req, res) => {
  const { orderId, playfabId } = req.body;

  try {
    const capture = await captureOrder(orderId);
    const status = capture.status;

    if (status !== "COMPLETED") {
      return res.json({ success: false, message: "Payment not completed" });
    }

    await giveSubscription(playfabId, 30);
    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err);
    res.json({ success: false });
  }
});

// -------------------------------
// ENDPOINT: 3-Month Purchase
// -------------------------------
app.post("/purchase/3m", async (req, res) => {
  const { orderId, playfabId } = req.body;

  try {
    const capture = await captureOrder(orderId);
    const status = capture.status;

    if (status !== "COMPLETED") {
      return res.json({ success: false, message: "Payment not completed" });
    }

    await giveSubscription(playfabId, 90);
    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err);
    res.json({ success: false });
  }
});

// -------------------------------
// ENDPOINT: Redeem Free Code
// -------------------------------
app.post("/redeem", async (req, res) => {
  const { code, playfabId } = req.body;

  // Example: stored in PlayFab TitleData
  const CODES = {
    "FREE30": 30,
    "XTRA90": 90,
    "DEVFREE": 999,
  };

  if (!CODES[code]) {
    return res.json({ success: false, message: "Invalid code" });
  }

  const days = CODES[code];
  await giveSubscription(playfabId, days);

  res.json({ success: true, days });
});

// -------------------------------
// START SERVER
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🔥 ERRORVERSE SERVER RUNNING ON PORT " + PORT);
});
