/* =========================================================
   ARB GLOBLE IT SERVICE
   Abodh Raj Bhar Global Information of Technology & Service
   Frontend Business Script
   ========================================================= */

"use strict";

/* =========================================================
   BACKEND
   ========================================================= */

const API_URL =
  "https://arb-global-it-services-backend.onrender.com";

/* =========================================================
   PACKAGES
   ========================================================= */

const packages = [
  { price: 20000, name: "Starter Website" },
  { price: 50000, name: "Professional Website" },
  { price: 80000, name: "Business Website" },
  { price: 120000, name: "Advanced Business Website" },
  { price: 180000, name: "Growth Website" },
  { price: 200000, name: "Premium Website" },
  { price: 240000, name: "Professional Growth Website" },
  { price: 280000, name: "Advanced Growth Website" },
  { price: 300000, name: "Business Pro Website" },
  { price: 320000, name: "Enterprise Website" },
  { price: 360000, name: "Enterprise Growth Website" },
  { price: 400000, name: "Premium Enterprise Website" },
  { price: 450000, name: "Advanced Enterprise Website" },
  { price: 500000, name: "Global Business Website" },
  { price: 600000, name: "Global Enterprise Solution" }
];

/* =========================================================
   COUNTRIES / DISPLAY FX
   NOTE: These rates are display-only.
   Final payment amount must come from official invoice/checkout.
   ========================================================= */

const countries = {

  "India": {
    code: "INR",
    symbol: "₹",
    rate: 1
  },

  "USA": {
    code: "USD",
    symbol: "$",
    rate: 0.0118
  },

  "Canada": {
    code: "CAD",
    symbol: "C$",
    rate: 0.016
  },

  "UK": {
    code: "GBP",
    symbol: "£",
    rate: 0.0093
  },

  "UAE": {
    code: "AED",
    symbol: "AED ",
    rate: 0.0433
  },

  "Saudi Arabia": {
    code: "SAR",
    symbol: "SAR ",
    rate: 0.0443
  },

  "Kuwait": {
    code: "KWD",
    symbol: "KWD ",
    rate: 0.00362
  },

  "Qatar": {
    code: "QAR",
    symbol: "QAR ",
    rate: 0.0430
  },

  "Oman": {
    code: "OMR",
    symbol: "OMR ",
    rate: 0.00455
  },

  "Bahrain": {
    code: "BHD",
    symbol: "BHD ",
    rate: 0.00445
  },

  "Germany": {
    code: "EUR",
    symbol: "€",
    rate: 0.0101
  },

  "France": {
    code: "EUR",
    symbol: "€",
    rate: 0.0101
  },

  "Switzerland": {
    code: "CHF",
    symbol: "CHF ",
    rate: 0.0092
  },

  "Australia": {
    code: "AUD",
    symbol: "A$",
    rate: 0.0180
  },

  "New Zealand": {
    code: "NZD",
    symbol: "NZ$",
    rate: 0.0200
  },

  "Japan": {
    code: "JPY",
    symbol: "¥",
    rate: 1.76
  },

  "China": {
    code: "CNY",
    symbol: "¥",
    rate: 0.085
  },

  "Hong Kong": {
    code: "HKD",
    symbol: "HK$",
    rate: 0.092
  },

  "Singapore": {
    code: "SGD",
    symbol: "S$",
    rate: 0.0155
  },

  "Malaysia": {
    code: "MYR",
    symbol: "RM ",
    rate: 0.049
  },

  "Thailand": {
    code: "THB",
    symbol: "฿",
    rate: 0.419
  },

  "South Africa": {
    code: "ZAR",
    symbol: "R ",
    rate: 0.212
  },

  "Brazil": {
    code: "BRL",
    symbol: "R$ ",
    rate: 0.063
  },

  "Mexico": {
    code: "MXN",
    symbol: "MX$ ",
    rate: 0.220
  }

};

/* =========================================================
   HELPERS
   ========================================================= */

function formatINR(value) {

  return "₹" +
    Number(value).toLocaleString("en-IN");

}


function formatLocal(value, country) {

  const currency = countries[country];

  if (!currency) {
    return formatINR(value);
  }

  const converted =
    Number(value) * currency.rate;

  return (
    currency.symbol +
    converted.toLocaleString("en-US", {
      maximumFractionDigits:
        currency.code === "JPY" ? 0 : 2
    })
  );

}


/* =========================================================
   PRICE TABLE
   ========================================================= */

const priceTable =
  document.getElementById("priceTable");

if (priceTable) {

  priceTable.innerHTML =
    packages.map(pkg => {

      return `
        <tr>
          <td>${formatINR(pkg.price)}</td>
          <td>${formatINR(pkg.price / 2)}</td>
        </tr>
      `;

    }).join("");

}


/* =========================================================
   COUNTRY SELECT
   ========================================================= */

const countrySelect =
  document.getElementById("countrySelect");

const formCountry =
  document.getElementById("formCountry");


function populateCountries(select) {

  if (!select) return;

  select.innerHTML = "";

  Object.keys(countries).forEach(country => {

    const option =
      document.createElement("option");

    option.value = country;

    option.textContent =
      `${country} — ${countries[country].code}`;

    select.appendChild(option);

  });

}


populateCountries(countrySelect);
populateCountries(formCountry);


/* =========================================================
   PACKAGE SELECT
   ========================================================= */

const packageSelect =
  document.getElementById("packageSelect");

if (packageSelect) {

  packageSelect.innerHTML =
    packages.map((pkg, index) => {

      return `
        <option value="${index}">
          ${pkg.name} —
          ${formatINR(pkg.price)} —
          50% Advance ${formatINR(pkg.price / 2)}
        </option>
      `;

    }).join("");

}


/* =========================================================
   CURRENCY DISPLAY
   ========================================================= */

let selectedPackageIndex = 0;


function updateCurrencyDisplay() {

  const country =
    countrySelect?.value || "India";

  const pkg =
    packages[selectedPackageIndex] ||
    packages[0];

  const priceElement =
    document.getElementById("convertedPrice");

  const advanceElement =
    document.getElementById("convertedAdvance");

  const packageElement =
    document.getElementById("currencyPackage");

  if (packageElement) {

    packageElement.textContent =
      pkg.name;

  }

  if (priceElement) {

    priceElement.textContent =
      formatLocal(pkg.price, country);

  }

  if (advanceElement) {

    advanceElement.textContent =
      formatLocal(
        pkg.price / 2,
        country
      );

  }

}


if (countrySelect) {

  countrySelect.addEventListener(
    "change",
    updateCurrencyDisplay
  );

}


/* =========================================================
   PACKAGE BUTTONS
   ========================================================= */

document
  .querySelectorAll(".package-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const price =
          Number(button.dataset.price);

        const index =
          packages.findIndex(
            pkg => pkg.price === price
          );

        if (index >= 0) {

          selectedPackageIndex =
            index;

        }

        if (packageSelect) {

          packageSelect.value =
            String(selectedPackageIndex);

        }

        updateCurrencyDisplay();

        document
          .getElementById("contact")
          ?.scrollIntoView({
            behavior: "smooth"
          });

      }
    );

  });


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  const toast =
    document.getElementById("toast");

  if (!toast) {

    alert(message);

    return;

  }

  toast.textContent = message;

  toast.style.display = "block";

  clearTimeout(
    window.arbToastTimer
  );

  window.arbToastTimer =
    setTimeout(() => {

      toast.style.display =
        "none";

    }, 5000);

}


/* =========================================================
   PROJECT FORM → WHATSAPP
   ========================================================= */

const projectForm =
  document.getElementById("projectForm");


if (projectForm) {

  projectForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();

      const name =
        document
          .getElementById("fullName")
          ?.value
          .trim() || "";

      const business =
        document
          .getElementById("businessName")
          ?.value
          .trim() || "";

      const email =
        document
          .getElementById("email")
          ?.value
          .trim() || "";

      const phone =
        document
          .getElementById("phone")
          ?.value
          .trim() || "";

      const country =
        document
          .getElementById("formCountry")
          ?.value || "India";

      const website =
        document
          .getElementById("websiteType")
          ?.value || "Business Website";

      const packageIndex =
        Number(
          document
            .getElementById("packageSelect")
            ?.value || 0
        );

      const requirements =
        document
          .getElementById("requirements")
          ?.value
          .trim() || "";

      const additional =
        document
          .getElementById("additional")
          ?.value
          .trim() || "";

      const pkg =
        packages[packageIndex] ||
        packages[0];


      const message = `
Hello ARB Globle IT & Service,

I want to start a website project.

Name: ${name}
Business: ${business}
Email: ${email}
WhatsApp: ${phone}
Country: ${country}

Website Type: ${website}

Package: ${pkg.name}
Project Value: ${formatLocal(pkg.price, country)}
50% Advance: ${formatLocal(pkg.price / 2, country)}

Requirements:
${requirements || "Not provided"}

Additional Requirements:
${additional || "Not provided"}
      `.trim();


      const whatsappURL =
        "https://wa.me/918127968129?text=" +
        encodeURIComponent(message);


      window.open(
        whatsappURL,
        "_blank",
        "noopener"
      );

    }
  );

}


/* =========================================================
   CASHFREE PAYMENT
   INDIA ONLY
   ========================================================= */

const payBtn =
  document.getElementById("payBtn");


async function startCashfreePayment() {

  const name =
    document
      .getElementById("fullName")
      ?.value
      .trim() || "";

  const email =
    document
      .getElementById("email")
      ?.value
      .trim() || "";

  const phone =
    document
      .getElementById("phone")
      ?.value
      .trim() || "";

  const country =
    document
      .getElementById("formCountry")
      ?.value || "India";

  const packageIndex =
    Number(
      document
        .getElementById("packageSelect")
        ?.value || 0
    );

  const requirements =
    document
      .getElementById("requirements")
      ?.value
      .trim() || "";

  const additional =
    document
      .getElementById("additional")
      ?.value
      .trim() || "";

  const pkg =
    packages[packageIndex] ||
    packages[0];

  const advance =
    pkg.price / 2;


  if (!name) {

    showToast(
      "Please enter your full name."
    );

    return;

  }


  if (!email) {

    showToast(
      "Please enter your email address."
    );

    return;

  }


  if (!phone) {

    showToast(
      "Please enter your WhatsApp/phone number."
    );

    return;

  }


  /*
     Cashfree India checkout.
     International clients should use
     the approved global payment/invoice
     method configured for the business.
  */

  if (country !== "India") {

    const internationalMessage = `
Hello ARB Globle IT  Service,

I want to pay the 50% advance for:

Package: ${pkg.name}
Project Value: ${formatLocal(pkg.price, country)}
50% Advance: ${formatLocal(advance, country)}

Country: ${country}

Name: ${name}
Email: ${email}
WhatsApp: ${phone}

Please provide the official secure international payment/invoice instructions.
    `.trim();

    const url =
      "https://wa.me/918127968129?text=" +
      encodeURIComponent(
        internationalMessage
      );

    window.open(
      url,
      "_blank",
      "noopener"
    );

    return;

  }


  try {

    showToast(
      "Creating secure Cashfree payment..."
    );


    const response =
      await fetch(
        API_URL +
        "/api/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            name: name,

            email: email,

            phone: phone,

            planAmount: pkg.price,

            advanceAmount: advance,

            country: country,

            packageName: pkg.name,

            projectDetails:
              [
                requirements,
                additional
              ]
              .filter(Boolean)
              .join("\n")

          })

        }
      );


    const data =
      await response.json()
        .catch(() => ({}));


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Cashfree order could not be created."
      );

    }


    if (
      !data.payment_session_id
    ) {

      throw new Error(
        "Cashfree payment session was not returned by the secure backend."
      );

    }


    if (
      typeof Cashfree ===
      "undefined"
    ) {

      throw new Error(
        "Cashfree Checkout SDK is not loaded. Add the Cashfree SDK to index.html."
      );

    }


    const cashfree =
      Cashfree({
        mode: "production"
      });


    showToast(
      "Opening secure Cashfree checkout..."
    );


    await cashfree.checkout({

      paymentSessionId:
        data.payment_session_id,

      redirectTarget:
        "_self"

    });


  } catch (error) {

    console.error(
      "Cashfree payment error:",
      error
    );

    showToast(
      error.message ||
      "Payment could not be started."
    );

  }

}


if (payBtn) {

  payBtn.addEventListener(
    "click",
    startCashfreePayment
  );

}


/* =========================================================
   AI ASSISTANT
   Gemini API key stays ONLY on Render backend.
   ========================================================= */

const aiLaunch =
  document.getElementById("aiLaunch");

const aiBox =
  document.getElementById("aiBox");

const aiClose =
  document.getElementById("aiClose");

const aiInput =
  document.getElementById("aiInput");

const aiSend =
  document.getElementById("aiSend");

const aiMessages =
  document.getElementById("aiMessages");


function addAIMessage(
  text,
  type = "ai"
) {

  if (!aiMessages) return;

  const div =
    document.createElement("div");

  div.className =
    `message ${type}`;

  div.textContent = text;

  aiMessages.appendChild(div);

  aiMessages.scrollTop =
    aiMessages.scrollHeight;

}


/* =========================================================
   LOCAL AI FALLBACK
   ========================================================= */

function localAIReply(question) {

  const q =
    question
      .toLowerCase()
      .trim();


  if (!q) {

    return (
      "Please type your question. " +
      "I can help with ARB services, " +
      "packages, pricing, payment, " +
      "domain, hosting and international clients."
    );

  }


  if (
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("hey") ||
    q.includes("namaste")
  ) {

    return (
      "Hello! Welcome to ARB Globle IT & Service. " +
      "I can help you with website services, " +
      "packages, pricing, payment, domain, " +
      "hosting and international project enquiries."
    );

  }


  if (
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("package") ||
    q.includes("pricing")
  ) {

    return (
      "ARB website project options currently " +
      "range from ₹20,000 to ₹6,00,000. " +
      "The standard structure is 50% advance " +
      "and the remaining 50% according to the " +
      "agreed project milestone, review or approval."
    );

  }


  if (
    q.includes("advance") ||
    q.includes("50%")
  ) {

    return (
      "The standard project structure is 50% advance " +
      "before work starts. The remaining 50% is payable " +
      "after the agreed milestone, review or approval."
    );

  }


  if (
    q.includes("refund") ||
    q.includes("refundable") ||
    q.includes("cancel")
  ) {

    return (
      "The standard policy is that the 50% advance " +
      "is generally non-refundable after project " +
      "acceptance and commencement of work, subject " +
      "to the written agreement and applicable laws."
    );

  }


  if (q.includes("domain")) {

    return (
      "Yes. ARB can help with professional domain " +
      "registration or connect an existing domain " +
      "to your website."
    );

  }


  if (q.includes("hosting")) {

    return (
      "Yes. Website hosting setup and deployment " +
      "support can be arranged with the website project."
    );

  }


  if (
    q.includes("international") ||
    q.includes("global") ||
    q.includes("foreign")
  ) {

    return (
      "Yes. ARB Global IT & Services is designed " +
      "for India and international clients. " +
      "International clients can contact ARB for " +
      "approved payment and project arrangements."
    );

  }


  if (
    q.includes("cashfree") ||
    q.includes("upi") ||
    q.includes("card")
  ) {

    return (
      "India clients can use supported Cashfree " +
      "payment methods such as UPI/cards where enabled. " +
      "Live checkout is created through the secure backend."
    );

  }


  if (
    q.includes("ach") ||
    q.includes("bank transfer") ||
    q.includes("bank")
  ) {

    return (
      "Global ACH or bank-transfer payment can be " +
      "arranged where supported. Official payment " +
      "details should only be provided through a " +
      "verified invoice or secure payment process."
    );

  }


  if (
    q.includes("gst") ||
    q.includes("tax") ||
    q.includes("vat")
  ) {

    return (
      "Applicable GST, VAT or other taxes depend " +
      "on the transaction, customer location and " +
      "applicable law. Final tax treatment should " +
      "be confirmed on the official invoice."
    );

  }


  if (
    q.includes("delivery") ||
    q.includes("how long") ||
    q.includes("time")
  ) {

    return (
      "Delivery time depends on project scope, " +
      "pages, features, content and client feedback. " +
      "The exact timeline should be confirmed before " +
      "the project starts."
    );

  }


  if (
    q.includes("revision") ||
    q.includes("change")
  ) {

    return (
      "Revisions can be requested according to " +
      "the revision limits and project scope agreed " +
      "for the selected package."
    );

  }


  if (
    q.includes("whatsapp") ||
    q.includes("contact") ||
    q.includes("phone")
  ) {

    return (
      "You can contact ARB Globle IT & Service " +
      "on WhatsApp at +91 8127968129."
    );

  }


  if (
    q.includes("email") ||
    q.includes("gmail")
  ) {

    return (
      "Official email: arbglobalitservice@gmail.com"
    );

  }


  if (q.includes("youtube")) {

    return (
      "You can visit the ARB Global IT Services " +
      "YouTube channel from the YouTube section."
    );

  }


  return (
    "I can help with ARB services, website packages, " +
    "pricing, 50% advance, payment methods, Cashfree, " +
    "ACH/bank transfer, domain, hosting, international " +
    "clients, GST/tax information, delivery and revisions."
  );

}


/* =========================================================
   GEMINI AI → SECURE RENDER BACKEND
   ========================================================= */

async function getGeminiReply(question) {

  try {

    const response =
      await fetch(
        API_URL + "/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            message: question
          })

        }
      );


    const data =
      await response.json()
        .catch(() => ({}));


    if (!response.ok) {

      throw new Error(
        data.error ||
        "AI service unavailable."
      );

    }


    if (
      data.reply &&
      typeof data.reply === "string"
    ) {

      return data.reply;

    }


    if (
      data.text &&
      typeof data.text === "string"
    ) {

      return data.text;

    }


    throw new Error(
      "No AI response received."
    );


  } catch (error) {

    console.warn(
      "Gemini backend unavailable:",
      error
    );

    /*
      Safe fallback:
      Gemini API key is never exposed
      to the browser.
    */

    return localAIReply(question);

  }

}


/* =========================================================
   SEND AI
   ========================================================= */

async function sendAI() {

  if (
    !aiInput ||
    !aiMessages
  ) {
    return;
  }


  const question =
    aiInput.value.trim();


  if (!question) {

    return;

  }


  addAIMessage(
    question,
    "user"
  );


  aiInput.value = "";


  addAIMessage(
    "Please wait...",
    "ai"
  );


  const loadingMessage =
    aiMessages.lastElementChild;


  try {

    const reply =
      await getGeminiReply(
        question
      );


    if (loadingMessage) {

      loadingMessage.remove();

    }


    addAIMessage(
      reply,
      "ai"
    );


  } catch (error) {

    if (loadingMessage) {

      loadingMessage.remove();

    }


    addAIMessage(
      localAIReply(question),
      "ai"
    );

  }

}


/* =========================================================
   AI OPEN / CLOSE
   ========================================================= */

if (aiLaunch) {

  aiLaunch.addEventListener(
    "click",
    () => {

      if (aiBox) {

        aiBox.classList.add(
          "open"
        );

      }

      aiInput?.focus();

    }
  );

}


if (aiClose) {

  aiClose.addEventListener(
    "click",
    () => {

      if (aiBox) {

        aiBox.classList.remove(
          "open"
        );

      }

    }
  );

}


if (aiSend) {

  aiSend.addEventListener(
    "click",
    sendAI
  );

}


if (aiInput) {

  aiInput.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendAI();

      }

    }
  );

}


/* =========================================================
   REVIEWS
   ========================================================= */

let selectedRating = 0;


function setRating(value) {

  selectedRating =
    Number(value);


  const buttons =
    document.querySelectorAll(
      "#ratingStars button"
    );


  buttons.forEach(
    (button, index) => {

      button.classList.toggle(
        "active",
        index < selectedRating
      );

    }
  );


  const message =
    document.getElementById(
      "ratingMessage"
    );


  if (message) {

    message.textContent =
      `${selectedRating}/5 rating selected.`;

  }

}


window.setRating =
  setRating;


function submitReview() {

  const name =
    document
      .getElementById("reviewName")
      ?.value
      .trim() || "";

  const text =
    document
      .getElementById("reviewText")
      ?.value
      .trim() || "";


  if (!selectedRating) {

    showToast(
      "Please select a rating."
    );

    return;

  }


  if (!name || !text) {

    showToast(
      "Please enter your name and review."
    );

    return;

  }


  let reviews = [];


  try {

    reviews =
      JSON.parse(
        localStorage.getItem(
          "abodhReviews"
        ) || "[]"
      );

  } catch (error) {

    reviews = [];

  }


  reviews.unshift({

    name: name,

    text: text,

    rating: selectedRating,

    date:
      new Date()
        .toLocaleDateString()

  });


  localStorage.setItem(
    "abodhReviews",
    JSON.stringify(reviews)
  );


  const reviewName =
    document.getElementById(
      "reviewName"
    );

  const reviewText =
    document.getElementById(
      "reviewText"
    );


  if (reviewName) {

    reviewName.value = "";

  }


  if (reviewText) {

    reviewText.value = "";

  }


  selectedRating = 0;


  document
    .querySelectorAll(
      "#ratingStars button"
    )
    .forEach(
      button =>
        button.classList.remove(
          "active"
        )
    );


  const ratingMessage =
    document.getElementById(
      "ratingMessage"
    );


  if (ratingMessage) {

    ratingMessage.textContent =
      "Thank you for your review!";

  }


  renderReviews();

}


window.submitReview =
  submitReview;


function renderReviews() {

  const reviewsList =
    document.getElementById(
      "reviewsList"
    );


  if (!reviewsList) {

    return;

  }


  let reviews = [];


  try {

    reviews =
      JSON.parse(
        localStorage.getItem(
          "abodhReviews"
        ) || "[]"
      );

  } catch (error) {

    reviews = [];

  }


  if (!reviews.length) {

    reviewsList.innerHTML =
      "<p>No reviews yet.</p>";

    return;

  }


  reviewsList.innerHTML =
    reviews
      .map(review => {

        const stars =
          "★".repeat(
            Number(review.rating) || 0
          );


        return `
          <div class="card review-card"
               style="margin-bottom:15px">

            <strong>
              ${escapeHTML(review.name)}
            </strong>

            <div
              style="margin:6px 0"
              aria-label="${review.rating}/5"
            >
              ${stars}
            </div>

            <p>
              ${escapeHTML(review.text)}
            </p>

            <small>
              ${escapeHTML(review.date)}
            </small>

          </div>
        `;

      })
      .join("");

}


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


renderReviews();


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn =
  document.getElementById(
    "menuBtn"
  );

const mainNav =
  document.getElementById(
    "mainNav"
  );


if (
  menuBtn &&
  mainNav
) {

  menuBtn.addEventListener(
    "click",
    () => {

      mainNav.classList.toggle(
        "open"
      );

    }
  );


  mainNav
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          mainNav.classList.remove(
            "open"
          );

        }
      );

    });

}


/* =========================================================
   YEAR
   ========================================================= */

const year =
  document.getElementById(
    "year"
  );


if (year) {

  year.textContent =
    new Date().getFullYear();

}


/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

if (countrySelect) {

  countrySelect.value =
    "India";

}


if (formCountry) {

  formCountry.value =
    "India";

}


if (packageSelect) {

  packageSelect.value =
    "0";

}


updateCurrencyDisplay();


/* =========================================================
   WHATSAPP DIRECT BUTTON
   ========================================================= */

document
  .querySelectorAll(
    '[data-whatsapp]'
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        window.open(
          "https://wa.me/918127968129",
          "_blank",
          "noopener"
        );

      }
    );

  });


/* =========================================================
   ARB WEBSITE READY
   ========================================================= */

console.log(
  "ARB Global IT & Services frontend loaded successfully."
);

console.log(
  "Secure backend:",
  API_URL
);
