/* =========================================================
   ARB Global IT Services
   Global Website Business Script
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

/* ================= COUNTRIES ================= */

const countries = {
  "India": { code: "INR", symbol: "₹", rate: 1 },
  "USA": { code: "USD", symbol: "$", rate: 0.0118 },
  "Canada": { code: "CAD", symbol: "C$", rate: 0.016 },
  "UK": { code: "GBP", symbol: "£", rate: 0.0093 },
  "UAE": { code: "AED", symbol: "AED ", rate: 0.0433 },
  "Saudi Arabia": { code: "SAR", symbol: "SAR ", rate: 0.0443 },
  "Kuwait": { code: "KWD", symbol: "KWD ", rate: 0.00362 },
  "Qatar": { code: "QAR", symbol: "QAR ", rate: 0.0430 },
  "Oman": { code: "OMR", symbol: "OMR ", rate: 0.00455 },
  "Bahrain": { code: "BHD", symbol: "BHD ", rate: 0.00445 },
  "Germany": { code: "EUR", symbol: "€", rate: 0.0101 },
  "France": { code: "EUR", symbol: "€", rate: 0.0101 },
  "Switzerland": { code: "CHF", symbol: "CHF ", rate: 0.0092 },
  "Australia": { code: "AUD", symbol: "A$", rate: 0.0180 },
  "New Zealand": { code: "NZD", symbol: "NZ$", rate: 0.0200 },
  "Japan": { code: "JPY", symbol: "¥", rate: 1.76 },
  "China": { code: "CNY", symbol: "¥", rate: 0.085 },
  "Hong Kong": { code: "HKD", symbol: "HK$", rate: 0.092 },
  "Singapore": { code: "SGD", symbol: "S$", rate: 0.0155 },
  "Malaysia": { code: "MYR", symbol: "RM ", rate: 0.049 },
  "Thailand": { code: "THB", symbol: "฿", rate: 0.419 },
  "South Africa": { code: "ZAR", symbol: "R ", rate: 0.212 },
  "Brazil": { code: "BRL", symbol: "R$ ", rate: 0.063 },
  "Mexico": { code: "MXN", symbol: "MX$ ", rate: 0.220 }
};

/* ================= HELPERS ================= */

function formatINR(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

function formatLocal(value, country) {
  const currency = countries[country];

  if (!currency) return formatINR(value);

  const converted = value * currency.rate;

  return (
    currency.symbol +
    converted.toLocaleString("en-US", {
      maximumFractionDigits: currency.code === "JPY" ? 0 : 2
    })
  );
}

/* ================= PRICE TABLE ================= */

const priceTable = document.getElementById("priceTable");

if (priceTable) {
  priceTable.innerHTML = packages.map(pkg => {
    const advance = pkg.price / 2;

    return `
      <tr>
        <td>${formatINR(pkg.price)}</td>
        <td>${formatINR(advance)}</td>
      </tr>
    `;
  }).join("");
}

/* ================= COUNTRY SELECT ================= */

const countrySelect = document.getElementById("countrySelect");
const formCountry = document.getElementById("formCountry");

function populateCountries(select) {
  if (!select) return;

  select.innerHTML = "";

  Object.keys(countries).forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent =
      `${country} — ${countries[country].code}`;
    select.appendChild(option);
  });
}

populateCountries(countrySelect);
populateCountries(formCountry);

/* ================= PACKAGE SELECT ================= */

const packageSelect = document.getElementById("packageSelect");

if (packageSelect) {
  packageSelect.innerHTML = packages.map((pkg, index) => {
    return `
      <option value="${index}">
        ${pkg.name} — ${formatINR(pkg.price)} — 50% Advance ${formatINR(pkg.price / 2)}
      </option>
    `;
  }).join("");
}

/* ================= LOCAL CURRENCY DISPLAY ================= */

let selectedPackageIndex = 0;

function updateCurrencyDisplay() {
  const country =
    countrySelect?.value || "India";

  const pkg =
    packages[selectedPackageIndex] || packages[0];

  const priceElement =
    document.getElementById("convertedPrice");

  const advanceElement =
    document.getElementById("convertedAdvance");

  const packageElement =
    document.getElementById("currencyPackage");

  if (packageElement) {
    packageElement.textContent = pkg.name;
  }

  if (priceElement) {
    priceElement.textContent =
      formatLocal(pkg.price, country);
  }

  if (advanceElement) {
    advanceElement.textContent =
      formatLocal(pkg.price / 2, country);
  }
}

if (countrySelect) {
  countrySelect.addEventListener(
    "change",
    updateCurrencyDisplay
  );
}

/* ================= PACKAGE BUTTONS ================= */

document.querySelectorAll(".package-btn").forEach(button => {

  button.addEventListener("click", () => {

    const price =
      Number(button.dataset.price);

    const index =
      packages.findIndex(
        pkg => pkg.price === price
      );

    if (index >= 0) {
      selectedPackageIndex = index;
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
  });

});

/* ================= FORM ================= */

const projectForm =
  document.getElementById("projectForm");

if (projectForm) {

  projectForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();

      const name =
        document.getElementById("fullName").value.trim();

      const business =
        document.getElementById("businessName").value.trim();

      const email =
        document.getElementById("email").value.trim();

      const phone =
        document.getElementById("phone").value.trim();

      const country =
        document.getElementById("formCountry").value;

      const website =
        document.getElementById("websiteType").value;

      const packageIndex =
        Number(document.getElementById("packageSelect").value);

      const requirements =
        document.getElementById("requirements").value.trim();

      const additional =
        document.getElementById("additional").value.trim();

      const pkg =
        packages[packageIndex] || packages[0];

      const message = `
Hello ARB Global IT Services,

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
        "https://wa.me/91+918127968129?text=" +
        encodeURIComponent(message);

      window.open(
        whatsappURL,
        "_blank"
      );

    }
  );
}

/* ================= PAYMENT BUTTON ================= */

const payBtn =
  document.getElementById("payBtn");

if (payBtn) {

  payBtn.addEventListener("click", () => {

    const packageIndex =
      Number(
        document.getElementById("packageSelect")?.value || 0
      );

    const pkg =
      packages[packageIndex] || packages[0];

    const country =
      document.getElementById("formCountry")?.value ||
      "India";

    const message = `
Hello ARB Global IT Services,

I want to pay the 50% advance for:

Package: ${pkg.name}
Project Value: ${formatLocal(pkg.price, country)}
50% Advance: ${formatLocal(pkg.price / 2, country)}

Country: ${country}

Please provide the official secure payment checkout/invoice.
    `.trim();

    const url =
      "https://wa.me/91+918127968129?text=" +
      encodeURIComponent(message);

    window.open(url, "_blank");

  });

}

/* ================= AI ASSISTANT ================= */

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

function addAIMessage(text, type = "ai") {

  const div =
    document.createElement("div");

  div.className =
    `message ${type}`;

  div.textContent = text;

  aiMessages.appendChild(div);

  aiMessages.scrollTop =
    aiMessages.scrollHeight;
}

function aiReply(question) {

  const q =
    question.toLowerCase().trim();

  if (!q) {
    return "Please type your question. I can help with ARB services, packages, prices, payment, domain, hosting, policies and international clients.";
  }

  if (
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("hey") ||
    q.includes("namaste")
  ) {
    return "Hello! Welcome to ARB Global IT Services. I can help you with website services, packages, pricing, 50% advance, payment methods, domain, hosting, global currencies and project process.";
  }

  if (
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("package") ||
    q.includes("pricing")
  ) {
    return "ARB currently offers project options from ₹20,000 to ₹6,00,000. Every listed project option has a 50% advance. The remaining 50% is payable according to the agreed project milestone, review or approval.";
  }

  if (
    q.includes("20,000") ||
    q.includes("20000")
  ) {
    return "The ₹20,000 Starter Website has a 50% advance of ₹10,000.";
  }

  if (
    q.includes("50,000") ||
    q.includes("50000")
  ) {
    return "The ₹50,000 project option has a 50% advance of ₹25,000.";
  }

  if (
    q.includes("80,000") ||
    q.includes("80000")
  ) {
    return "The ₹80,000 Business Website option has a 50% advance of ₹40,000.";
  }

  if (
    q.includes("1.2 lakh") ||
    q.includes("120000") ||
    q.includes("1,20,000")
  ) {
    return "The ₹1,20,000 project option has a 50% advance of ₹60,000.";
  }

  if (
    q.includes("1.8 lakh") ||
    q.includes("180000") ||
    q.includes("1,80,000")
  ) {
    return "The ₹1,80,000 Growth Website option has a 50% advance of ₹90,000.";
  }

  if (
    q.includes("2 lakh") ||
    q.includes("200000") ||
    q.includes("2,00,000")
  ) {
    return "The ₹2,00,000 project option has a 50% advance of ₹1,00,000.";
  }

  if (
    q.includes("2.4 lakh") ||
    q.includes("240000") ||
    q.includes("2,40,000")
  ) {
    return "The ₹2,40,000 project option has a 50% advance of ₹1,20,000.";
  }

  if (
    q.includes("2.8 lakh") ||
    q.includes("280000") ||
    q.includes("2,80,000")
  ) {
    return "The ₹2,80,000 project option has a 50% advance of ₹1,40,000.";
  }

  if (
    q.includes("3 lakh") ||
    q.includes("300000") ||
    q.includes("3,00,000")
  ) {
    return "The ₹3,00,000 project option has a 50% advance of ₹1,50,000.";
  }

  if (
    q.includes("3.2 lakh") ||
    q.includes("320000") ||
    q.includes("3,20,000")
  ) {
    return "The ₹3,20,000 project option has a 50% advance of ₹1,60,000.";
  }

  if (
    q.includes("3.6 lakh") ||
    q.includes("360000") ||
    q.includes("3,60,000")
  ) {
    return "The ₹3,60,000 project option has a 50% advance of ₹1,80,000.";
  }

  if (
    q.includes("4 lakh") ||
    q.includes("400000") ||
    q.includes("4,00,000")
  ) {
    return "The ₹4,00,000 project option has a 50% advance of ₹2,00,000.";
  }

  if (
    q.includes("4.5 lakh") ||
    q.includes("450000") ||
    q.includes("4,50,000")
  ) {
    return "The ₹4,50,000 project option has a 50% advance of ₹2,25,000.";
  }

  if (
    q.includes("5 lakh") ||
    q.includes("500000") ||
    q.includes("5,00,000")
  ) {
    return "The ₹5,00,000 project option has a 50% advance of ₹2,50,000.";
  }

  if (
    q.includes("6 lakh") ||
    q.includes("600000") ||
    q.includes("6,00,000")
  ) {
    return "The ₹6,00,000 Global Enterprise Solution has a 50% advance of ₹3,00,000.";
  }

  if (
    q.includes("advance") ||
    q.includes("50%")
  ) {
    return "ARB's standard project structure is 50% advance before work starts, with the remaining 50% payable after the agreed project milestone, review or approval.";
  }

  if (
    q.includes("refund") ||
    q.includes("refundable") ||
    q.includes("cancel")
  ) {
    return "The standard policy is that the 50% advance is generally non-refundable after project acceptance and work commencement, subject to the written agreement and applicable laws.";
  }

  if (
    q.includes("domain")
  ) {
    return "Yes. ARB can help with professional domain registration or connect an existing domain to your website.";
  }

  if (
    q.includes("hosting")
  ) {
    return "Yes. Website hosting setup and deployment support can be arranged with the website project.";
  }

  if (
    q.includes("website")
  ) {
    return "ARB provides custom website design, development, landing pages, domain setup, hosting support, website updates and digital technology services.";
  }

  if (
    q.includes("service")
  ) {
    return "ARB Global IT Services provides custom website design, website development, domain registration, hosting setup, landing pages and website support.";
  }

  if (
    q.includes("international") ||
    q.includes("global") ||
    q.includes("foreign") ||
    q.includes("outside india")
  ) {
    return "Yes. ARB Global IT Services is designed for India and international clients. You can select your country to see an indicative local-currency display.";
  }

  if (
    q.includes("currency") ||
    q.includes("usd") ||
    q.includes("dollar") ||
    q.includes("pound") ||
    q.includes("euro") ||
    q.includes("aed") ||
    q.includes("sar") ||
    q.includes("kwd") ||
    q.includes("qar")
  ) {
    return "The website supports indicative currency display for INR, USD, GBP, EUR, AED, SAR, KWD, QAR, OMR, BHD, CAD, AUD, JPY and several other currencies.";
  }

  if (
    q.includes("cashfree") ||
    q.includes("upi") ||
    q.includes("card")
  ) {
    return "India clients can use supported Cashfree payment methods such as UPI/cards where enabled. Live payment checkout must be connected through a secure backend.";
  }

  if (
    q.includes("ach") ||
    q.includes("bank transfer") ||
    q.includes("bank")
  ) {
    return "Global ACH / bank-transfer payment can be arranged where supported. Official bank/payment details should only be provided through a verified invoice or secure payment process.";
  }

  if (
    q.includes("gst") ||
    q.includes("tax") ||
    q.includes("vat")
  ) {
    return "Applicable GST, VAT or other taxes depend on the transaction, customer location and applicable law. The final tax treatment should be confirmed on the invoice.";
  }

  if (
    q.includes("delivery") ||
    q.includes("how long") ||
    q.includes("time")
  ) {
    return "Delivery time depends on the project scope, pages, features, content and feedback. The exact timeline should be confirmed before the project starts.";
  }

  if (
    q.includes("revision") ||
    q.includes("change")
  ) {
    return "Yes. Clients can request revisions according to the revision limits and scope agreed for the selected project.";
  }

  if (
    q.includes("whatsapp") ||
    q.includes("contact") ||
    q.includes("phone")
  ) {
    return "You can contact ARB on WhatsApp at +91 +918127968129.";
  }

  if (
    q.includes("email") ||
    q.includes("gmail")
  ) {
    return "ARB's official contact email is arbglobalitservice@gmail.com.";
  }

  if (
    q.includes("youtube")
  ) {
    return "You can visit the ARB Globle IT Services YouTube channel from the YouTube section of this website.";
  }

  if (
    q.includes("who are you") ||
    q.includes("your name")
  ) {
    return "I am the ARB AI Assistant, created to help global clients understand ARB Global IT Services, its website services, packages, payment structure and project process.";
  }

  if (
    q.includes("start") ||
    q.includes("order") ||
    q.includes("buy") ||
    q.includes("purchase")
  ) {
    return "To start, select a package, submit your requirements and contact ARB on WhatsApp. The official payment process should be completed only through the verified payment/invoice method.";
  }

  return "I can help with ARB services, website packages, prices from ₹20,000 to ₹6,00,000, 50% advance, domain, hosting, currencies, Cashfree, ACH/bank transfer, GST/tax information, delivery, revisions and contact details. Please ask your question in a little more detail.";
}

function sendAI() {

  if (!aiInput || !aiMessages) return;

  const question =
    aiInput.value.trim();

  if (!question) return;

  addAIMessage(
    question,
    "user"
  );

  aiInput.value = "";

  setTimeout(() => {

    addAIMessage(
      aiReply(question),
      "ai"
    );

  }, 250);
}

if (aiLaunch) {
  aiLaunch.addEventListener(
    "click",
    () => {
      aiBox.classList.add("open");
      aiInput?.focus();
    }
  );
}

if (aiClose) {
  aiClose.addEventListener(
    "click",
    () => {
      aiBox.classList.remove("open");
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
      if (event.key === "Enter") {
        sendAI();
      }
    }
  );
}

/* ================= MOBILE MENU ================= */

const menuBtn =
  document.getElementById("menuBtn");

const mainNav =
  document.getElementById("mainNav");

if (menuBtn && mainNav) {

  menuBtn.addEventListener(
    "click",
    () => {
      mainNav.classList.toggle("open");
    }
  );

  mainNav.querySelectorAll("a")
    .forEach(link => {
      link.addEventListener(
        "click",
        () => {
          mainNav.classList.remove("open");
        }
      );
    });
}

/* ================= YEAR ================= */

const year =
  document.getElementById("year");

if (year) {
  year.textContent =
    new Date().getFullYear();
}

/* ================= DEFAULT ================= */

if (countrySelect) {
  countrySelect.value = "India";
}

if (formCountry) {
  formCountry.value = "India";
}

if (packageSelect) {
  packageSelect.value = "0";
}

updateCurrencyDisplay();
