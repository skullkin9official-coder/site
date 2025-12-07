import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PLAYFAB_SECRET = process.env.PLAYFAB_SECRET;
const TITLE_ID = process.env.PLAYFAB_TITLE || "1FC26D";

async function getPayPalAccess() {
  const auth = Buffer.from(PAYPAL_CLIENT + ":" + PAYPAL_SECRET).toString("base64");
  const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { "Authorization": "Basic " + auth },
    body: "grant_type=client_credentials"
  });
  const data = await res.json();
  return data.access_token;
}

async function verifyOrder(orderID) {
  const token = await getPayPalAccess();
  const res = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}`, {
    headers: { Authorization: "Bearer " + token }
  });
  return res.json();
}

async function callCloudScript(functionName, payload, userId) {
  return fetch(`https://${TITLE_ID}.playfabapi.com/Server/ExecuteCloudScript`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-SecretKey": PLAYFAB_SECRET
    },
    body: JSON.stringify({
      FunctionName: functionName,
      FunctionParameter: payload,
      GeneratePlayStreamEvent: true,
      PlayFabId: userId
    })
  }).then(r => r.json());
}

app.post("/paypal/confirm", async (req, res) => {
  const { orderID, months } = req.body;
  const order = await verifyOrder(orderID);

  if (order.status !== "COMPLETED") {
    return res.status(400).send({ error: "Payment not completed" });
  }

  const userId = order.purchase_units[0].custom_id; 

  const result = await callCloudScript("ProcessPurchase", { months }, userId);
  res.send(result);
});

app.post("/redeem", async (req, res) => {
  const { userId, code } = req.body;

  const result = await callCloudScript("RedeemPremiumCode", { code }, userId);
  res.send(result);
});

app.listen(3000, () => console.log("Server running on port 3000"));
