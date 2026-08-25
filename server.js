require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const app = express();
const PORT = process.env.PORT || 3000;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));

app.use(express.json());

const PACKAGES = {
  Basic: 10000,
  Standard: 25000,
  Growth: 30000,
  Premium: 35000,
  Luxury: 50000,
  Empire: 75000
};

/* Server Status */
app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "THE ABOVERSE Payment Backend",
    status: "online"
  });
});

/* Create Razorpay Order */
app.post("/api/create-order", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      package: packageName
    } = req.body;

    if (!name || !email || !packageName) {
      return res.status(400).json({
        success: false,
        error: "Name, email and package are required."
      });
    }

    if (!PACKAGES[packageName]) {
      return res.status(400).json({
        success: false,
        error: "Invalid package."
      });
    }

    const order = await razorpay.orders.create({
      amount: PACKAGES[packageName],
      currency: "INR",
      receipt: "abv_" + Date.now(),
      notes: {
        customer_name: name,
        customer_email: email,
        customer_phone: phone || "",
        package: packageName
      }
    });

    res.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Unable to create payment order."
    });
  }
});

/* Verify Payment */
app.post("/api/verify-payment", (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        error: "Incomplete payment data."
      });
    }

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    const valid =
      expectedSignature === razorpay_signature;

    if (!valid) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: "Invalid payment signature."
      });
    }

    res.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "verified"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Payment verification failed."
    });
  }
});

/* Basic Webhook Endpoint */
app.post("/api/razorpay-webhook", (req, res) => {
  try {
    const signature =
      req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({
        success: false,
        error: "Webhook signature missing."
      });
    }

    console.log("Razorpay webhook received.");

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

app.listen(PORT, () => {
  console.log(
    `THE ABOVERSE backend running on port ${PORT}`
  );
});
