require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-webhook-signature", "x-webhook-timestamp"]
}));

/*
  ----------------------------------------------------
  RAW BODY
  Cashfree webhook signature verification के लिए
  raw request body चाहिए।
  ----------------------------------------------------
*/

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString("utf8");
    }
  })
);

/*
  ----------------------------------------------------
  BASIC ROUTES
  ----------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "ARB Global IT Services Backend",
    status: "online",
    ai: "Google Gemini",
    payment: "Cashfree"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy"
  });
});

/*
  ----------------------------------------------------
  GEMINI AI
  ----------------------------------------------------
*/

const geminiApiKey = process.env.GEMINI_API_KEY;

let ai = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey
  });
}

const BUSINESS_CONTEXT = `
You are the official AI Assistant for ARB Global IT Services.

BUSINESS INFORMATION:

Brand Name:
ARB Global IT Services

Full Business Name:
Abodh Raj Bhar Global Information of Technology & Service

Business Type:
Global Information Technology and digital services company.

Main Services:
- Custom website design
- Website development
- Business websites
- Landing pages
- Domain registration support
- Website hosting
- Website updates and support
- AI assistant integration
- Digital technology services

GLOBAL CLIENTS:
The company serves clients internationally and can communicate with clients from different countries.

CONTACT:
WhatsApp: +91 8127968129
Email: arbglobalitservice@gmail.com
YouTube:
https://youtube.com/@arb_globle_it_services

PAYMENT:
The website supports Cashfree payment integration and global payment/bank-transfer options where available.

IMPORTANT PAYMENT POLICY:
Website projects may require a 50% advance payment according to the selected package.
The remaining 50% is payable according to the project's agreed completion/approval terms.

Do not invent payment confirmation.
Do not claim that a payment has been received unless the backend/payment system confirms it.

TAX:
Do not invent or promise tax treatment.
If a client asks about taxes, explain that applicable taxes depend on the client's location, service, and current applicable regulations, and they should confirm the final amount before payment.

WEBSITE PACKAGES:
The website may display different packages and prices.
If the exact current price is not supplied in the conversation, do not invent a price.
Ask the client to select a package or contact ARB Global IT Services.

AI BEHAVIOR:
- Be professional, friendly and concise.
- Answer international clients clearly.
- Use the client's language when practical.
- You can answer in English, Hindi or Hinglish.
- Do not pretend to be a human employee.
- Identify yourself as the ARB Global IT Services AI Assistant when appropriate.
- Never invent company policies, prices, guarantees, delivery dates, refunds, payment confirmations, GST information, bank details or legal claims.
- If information is unavailable, clearly say that the client should contact ARB Global IT Services.
- Never request or expose API keys, passwords, Cashfree secrets or other private credentials.
- Never tell a client that you personally processed their payment.
- For payment/order status, direct the client to the official payment/order process or support contact.
- Do not provide legal, financial or tax advice as a definitive professional determination.

CONTACT RESPONSE:
For direct business enquiries, provide:
WhatsApp: +91 8127968129
Email: arbglobalitservice@gmail.com

The goal is to help visitors understand ARB Global IT Services and guide them toward the correct website service or contact method.
`;

/*
  ----------------------------------------------------
  AI CHAT ENDPOINT
  POST /api/ai/chat
  ----------------------------------------------------
*/

app.post("/api/ai/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: "AI service is not configured yet."
      });
    }

    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Please enter a message."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        error: "Message is too long."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction: BUSINESS_CONTEXT,
        temperature: 0.4,
        maxOutputTokens: 800
      }
    });

    const answer =
      typeof response.text === "string"
        ? response.text.trim()
        : "";

    if (!answer) {
      return res.status(502).json({
        success: false,
        error: "AI did not return a response."
      });
    }

    return res.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error("Gemini AI error:", error);

    return res.status(500).json({
      success: false,
      error: "AI service is temporarily unavailable."
    });
  }
});

/*
  ----------------------------------------------------
  CASHFREE CONFIGURATION
  ----------------------------------------------------
*/

const CASHFREE_CLIENT_ID =
  process.env.CASHFREE_CLIENT_ID;

const CASHFREE_CLIENT_SECRET =
  process.env.CASHFREE_CLIENT_SECRET;

const CASHFREE_API_VERSION =
  process.env.CASHFREE_API_VERSION || "2025-01-01";

const CASHFREE_BASE_URL =
  process.env.CASHFREE_BASE_URL ||
  "https://api.cashfree.com/pg";

/*
  ----------------------------------------------------
  CASHFREE HELPER
  ----------------------------------------------------
*/

async function cashfreeRequest(
  path,
  options = {}
) {
  if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
    throw new Error(
      "Cashfree credentials are not configured."
    );
  }

  const response = await fetch(
    `${CASHFREE_BASE_URL}${path}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",

        "x-api-version":
          CASHFREE_API_VERSION,

        "x-client-id":
          CASHFREE_CLIENT_ID,

        "x-client-secret":
          CASHFREE_CLIENT_SECRET,

        ...(options.headers || {})
      }
    }
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = {
      raw: text
    };
  }

  if (!response.ok) {
    const error = new Error(
      "Cashfree API request failed."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

/*
  ----------------------------------------------------
  CREATE CASHFREE ORDER
  ----------------------------------------------------
*/

app.post("/api/cashfree/create-order", async (req, res) => {
  try {
    const {
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      returnUrl
    } = req.body || {};

    const numericAmount =
      Number(amount);

    if (
      !orderId ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid order information."
      });
    }

    const safeReturnUrl =
      returnUrl ||
      "https://theaboverse.github.io/thank-you.html";

    const order = {
      order_id: String(orderId),

      order_amount:
        Number(numericAmount.toFixed(2)),

      order_currency: "INR",

      customer_details: {
        customer_id:
          String(orderId),

        customer_name:
          String(customerName),

        customer_email:
          String(customerEmail),

        customer_phone:
          String(customerPhone)
      },

      order_meta: {
        return_url:
          safeReturnUrl +
          "?order_id={order_id}",

        notify_url:
          `${process.env.BACKEND_PUBLIC_URL || ""}/api/cashfree-webhook`
      },

      order_note:
        "ARB Global IT Services website project payment"
    };

    const result =
      await cashfreeRequest(
        "/orders",
        {
          method: "POST",
          body: JSON.stringify(order)
        }
      );

    return res.json({
      success: true,
      orderId:
        result.order_id,

      paymentSessionId:
        result.payment_session_id,

      orderStatus:
        result.order_status
    });

  } catch (error) {
    console.error(
      "Cashfree create order error:",
      error
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,
      error:
        error.data ||
        error.message ||
        "Unable to create payment order."
    });
  }
});

/*
  ----------------------------------------------------
  VERIFY CASHFREE ORDER
  ----------------------------------------------------
*/

app.get(
  "/api/cashfree/order/:orderId",
  async (req, res) => {
    try {
      const orderId =
        String(req.params.orderId || "")
          .trim();

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: "Order ID is required."
        });
      }

      const result =
        await cashfreeRequest(
          `/orders/${encodeURIComponent(orderId)}`,
          {
            method: "GET"
          }
        );

      return res.json({
        success: true,
        order: result
      });

    } catch (error) {
      console.error(
        "Cashfree order verification error:",
        error
      );

      return res.status(
        error.status || 500
      ).json({
        success: false,
        error:
          error.data ||
          error.message ||
          "Unable to verify order."
      });
    }
  }
);

/*
  ----------------------------------------------------
  CASHFREE WEBHOOK VERIFICATION
  ----------------------------------------------------
*/

function verifyCashfreeWebhook(req) {
  const timestamp =
    req.headers["x-webhook-timestamp"];

  const signature =
    req.headers["x-webhook-signature"];

  if (
    !timestamp ||
    !signature ||
    !req.rawBody ||
    !CASHFREE_CLIENT_SECRET
  ) {
    return false;
  }

  const signedPayload =
    timestamp + req.rawBody;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        CASHFREE_CLIENT_SECRET
      )
      .update(signedPayload)
      .digest("base64");

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      "utf8"
    );

  const receivedBuffer =
    Buffer.from(
      String(signature),
      "utf8"
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}

/*
  ----------------------------------------------------
  CASHFREE WEBHOOK
  ----------------------------------------------------
*/

app.post(
  "/api/cashfree-webhook",
  (req, res) => {
    try {
      if (!verifyCashfreeWebhook(req)) {
        console.warn(
          "Invalid Cashfree webhook signature."
        );

        return res.status(401).json({
          success: false,
          error:
            "Invalid webhook signature."
        });
      }

      const event =
        req.body || {};

      console.log(
        "Verified Cashfree webhook:",
        event.type ||
        event.event ||
        "UNKNOWN"
      );

      /*
        IMPORTANT:
        Webhook को verify किया गया है।
        Payment को PAID मानने से पहले
        order status भी server से verify किया जा सकता है।
      */

      return res.status(200).json({
        success: true,
        received: true
      });

    } catch (error) {
      console.error(
        "Webhook processing error:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Webhook processing failed."
      });
    }
  }
);

/*
  ----------------------------------------------------
  ERROR HANDLER
  ----------------------------------------------------
*/

app.use(
  (err, req, res, next) => {
    console.error(
      "Server error:",
      err
    );

    res.status(500).json({
      success: false,
      error: "Internal server error."
    });
  }
);

/*
  ----------------------------------------------------
  START SERVER
  ----------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(
    `ARB Global IT Services backend running on port ${PORT}`
  );
});
