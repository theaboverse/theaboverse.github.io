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
      ---
   Start Server
---------------------------- */

app.listen(PORT, () => {
  console.log(
    `THE ABOVERSE Cashfree backend running on port ${PORT}`
  );
});
