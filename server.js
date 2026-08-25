require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;
const API_VERSION = "2025-01-01";

const CASHFREE_BASE_URL =
  process.env.CASHFREE_ENV === "PRODUCTION"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));

/*
  Keep the raw body for Cashfree webhook verification.
  Cashfree requires the exact raw payload for signature verification.
*/
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString("utf8");
    }
  })
);

/* ---------------------------
   Package Amounts
---------------------------- */

const PACKAGES = {
  Basic: 100,
  Standard: 250,
  Growth: 300,
  Premium: 350,
  Luxury: 500,
  Empire: 750
};

/* ---------------------------
   Cashfree Headers
---------------------------- */

function cashfreeHeaders() {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-api-version": API_VERSION,
    "x-client-id": process.env.CASHFREE_CLIENT_ID,
    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET
  };
}

/* ---------------------------
   Server Status
---------------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "THE ABOVERSE Cashfree Backend",
    status: "online",
    environment:
      process.env.CASHFREE_ENV === "PRODUCTION"
        ? "production"
        : "sandbox"
  });
});

/* ---------------------------
   Create Cashfree Order
---------------------------- */

app.post("/api/create-order", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      package: packageName
    } = req.body;

    if (!name || !email || !phone || !packageName) {
      return res.status(400).json({
        success: false,
        error: "Name, email, phone and package are required."
      });
    }

    if (!PACKAGES[packageName]) {
      return res.status(400).json({
        success: false,
        error: "Invalid package."
      });
    }

    const orderId =
      "abv_" +
      Date.now() +
      "_" +
      crypto.randomBytes(4).toString("hex");

    const orderAmount = PACKAGES[packageName];

    const response = await fetch(
      `${CASHFREE_BASE_URL}/orders`,
      {
        method: "POST",
        headers: {
          ...cashfreeHeaders(),
          "x-idempotency-key": crypto.randomUUID()
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: orderAmount,
          order_currency: "INR",

          customer_details: {
            customer_id:
              "customer_" +
              crypto.randomBytes(5).toString("hex"),
            customer_name: name,
            customer_email: email,
            customer_phone: phone
          },

          order_meta: {
            return_url:
              `${process.env.FRONTEND_URL}/?payment=success&order_id=${orderId}`,

            notify_url:
              `${process.env.BACKEND_URL}/api/cashfree-webhook`
          },

          order_note:
            `THE ABOVERSE - ${packageName}`,

          order_tags: {
            package: packageName
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree create order error:", data);

      return res.status(response.status).json({
        success: false,
        error: data.message || "Cashfree order creation failed.",
        details: data
      });
    }

    res.json({
      success: true,
      orderId: data.order_id,
      cfOrderId: data.cf_order_id,
      paymentSessionId: data.payment_session_id,
      amount: data.order_amount,
      currency: data.order_currency
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Unable to create Cashfree order."
    });
  }
});

/* ---------------------------
   Check Order Status
---------------------------- */

app.get("/api/order-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const response = await fetch(
      `${CASHFREE_BASE_URL}/orders/${encodeURIComponent(orderId)}`,
      {
        method: "GET",
        headers: cashfreeHeaders()
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.message || "Unable to fetch order status.",
        details: data
      });
    }

    res.json({
      success: true,
      orderId: data.order_id,
      orderStatus: data.order_status,
      amount: data.order_amount,
      currency: data.order_currency,
      paymentSessionId: data.payment_session_id
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Order status check failed."
    });
  }
});

/* ---------------------------
   Get Payments For Order
---------------------------- */

app.get("/api/payments/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const response = await fetch(
      `${CASHFREE_BASE_URL}/orders/${encodeURIComponent(orderId)}/payments`,
      {
        method: "GET",
        headers: cashfreeHeaders()
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.message || "Unable to fetch payment details.",
        details: data
      });
    }

    res.json({
      success: true,
      payments: data
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Payment status check failed."
    });
  }
});

/* ---------------------------
   Verify Cashfree Webhook
---------------------------- */

function verifyCashfreeWebhook(req) {
  const timestamp =
    req.headers["x-webhook-timestamp"];

  const signature =
    req.headers["x-webhook-signature"];

  if (!timestamp || !signature || !req.rawBody) {
    return false;
  }

  const signedPayload =
    timestamp + req.rawBody;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.CASHFREE_CLIENT_SECRET
      )
      .update(signedPayload)
      .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

/* ---------------------------
   Cashfree Webhook
---------------------------- */

app.post("/api/cashfree-webhook", (req, res) => {
  try {
    if (!verifyCashfreeWebhook(req)) {
      console.warn("Invalid Cashfree webhook signature.");

      return res.status(401).json({
        success: false,
        error: "Invalid webhook signature."
      });
    }

    const event = req.body;

    console.log(
      "Verified Cashfree webhook:",
      event.type
    );

    /*
      IMPORTANT:
      Payment is considered successful only when
      Cashfree sends a verified SUCCESS webhook
      or the server confirms order_status = PAID.
    */

    if (
      event.type ===
      "PAYMENT_SUCCESS_WEBHOOK"
    ) {
      console.log(
        "Payment SUCCESS:",
        event.data?.order?.order_id
      );
    }

    res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false
    });
  }
});

/* ---------------------------
   Start Server
---------------------------- */

app.listen(PORT, () => {
  console.log(
    `THE ABOVERSE Cashfree backend running on port ${PORT}`
  );
});
