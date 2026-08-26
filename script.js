const countries = {
  IN:{name:"India",currency:"INR",symbol:"₹",rate:1},
  US:{name:"United States",currency:"USD",symbol:"$",rate:.012},
  GB:{name:"United Kingdom",currency:"GBP",symbol:"£",rate:.0095},
  CA:{name:"Canada",currency:"CAD",symbol:"C$",rate:.016},
  AU:{name:"Australia",currency:"AUD",symbol:"A$",rate:.018},
  AE:{name:"United Arab Emirates",currency:"AED",symbol:"د.إ",rate:.044},
  SA:{name:"Saudi Arabia",currency:"SAR",symbol:"﷼",rate:.045},
  KW:{name:"Kuwait",currency:"KWD",symbol:"د.ك",rate:.0037},
  QA:{name:"Qatar",currency:"QAR",symbol:"﷼",rate:.043},
  OM:{name:"Oman",currency:"OMR",symbol:"ر.ع.",rate:.0046},
  BH:{name:"Bahrain",currency:"BHD",symbol:".د.ب",rate:.0045},
  DE:{name:"Germany",currency:"EUR",symbol:"€",rate:.0108},
  FR:{name:"France",currency:"EUR",symbol:"€",rate:.0108},
  IT:{name:"Italy",currency:"EUR",symbol:"€",rate:.0108},
  ES:{name:"Spain",currency:"EUR",symbol:"€",rate:.0108},
  CH:{name:"Switzerland",currency:"CHF",symbol:"CHF",rate:.0102},
  JP:{name:"Japan",currency:"JPY",symbol:"¥",rate:1.75},
  CN:{name:"China",currency:"CNY",symbol:"¥",rate:.086},
  SG:{name:"Singapore",currency:"SGD",symbol:"S$",rate:.016},
  MY:{name:"Malaysia",currency:"MYR",symbol:"RM",rate:.055},
  NZ:{name:"New Zealand",currency:"NZD",symbol:"NZ$",rate:.020},
  ZA:{name:"South Africa",currency:"ZAR",symbol:"R",rate:.22},
  BR:{name:"Brazil",currency:"BRL",symbol:"R$",rate:.065},
  MX:{name:"Mexico",currency:"MXN",symbol:"MX$",rate:.22}
};

const packages = [
  20000,50000,80000,120000,180000,
  200000,240000,280000,300000,320000,
  360000,400000,450000,500000,600000
];

const services = [
 ["◈","Custom Website Design","Modern responsive websites planned around your business, brand, audience and conversion goals."],
 ["⌘","Website Development","Functional websites with navigation, forms, calls to action and mobile support."],
 ["◎","Domain Registration","Professional domain setup and connection support for new or existing domains."],
 ["◉","Website Hosting","Hosting setup and website launch support for your online presence."],
 ["↗","Business Landing Pages","Focused pages for products, services, campaigns and enquiries."],
 ["✦","AI & Digital Support","AI-assisted support, content guidance and practical technology solutions."]
];

const process = [
 ["1","Share Your Requirements","Tell us about your business, preferred style, audience and features."],
 ["2","Choose Your Solution","Select a package or request a custom quotation."],
 ["3","We Build","We design and develop the agreed pages and features."],
 ["4","Review & Launch","Review, approve agreed work and launch the website."]
];

const aiRules = [
 {
  keys:["service","website","design","development","domain","hosting","landing","ai"],
  answer:"ARB Globle IT & Service provides custom website design, website development, domain setup, hosting, landing pages, AI-assisted digital support and website updates."
 },
 {
  keys:["50%","advance","payment","pay","start"],
  answer:"The standard project policy requires 50% advance before project work begins. The remaining 50% is payable after the agreed work approval/milestone or according to the written invoice."
 },
 {
  keys:["refund","cancel","cancellation"],
  answer:"The standard 50% advance is non-refundable after project work or reserved project resources have started, subject to the written agreement and applicable law."
 },
 {
  keys:["india","cashfree","upi","card"],
  answer:"For India, supported Cashfree checkout, UPI and card methods can be used when enabled. Payment secrets must remain on the secure backend."
 },
 {
  keys:["international","global","ach","bank transfer","usa","uk","uae","kuwait","germany"],
  answer:"Yes. ARB Globle IT & Service serves international clients. ACH or bank-transfer instructions should only be supplied through a verified official invoice."
 },
 {
  keys:["currency","usd","eur","gbp","aed","sar","kwd","inr"],
  answer:"The website supports country-based currency display. The displayed conversion is indicative; the final invoice/payment amount should be confirmed before payment."
 },
 {
  keys:["domain"],
  answer:"Yes. We can help with a new professional domain or connect an existing domain, subject to registrar and DNS settings."
 },
 {
  keys:["hosting"],
  answer:"Yes. Hosting setup can be arranged with the website project. The exact hosting plan depends on traffic, technology and features."
 },
 {
  keys:["delivery","timeline","days","quick","how long"],
  answer:"Delivery time depends on project scope, pages, features, content and feedback. The confirmed timeline is stated in the quotation/project agreement."
 },
 {
  keys:["revision","changes"],
  answer:"Yes. Revisions are handled according to the selected package and written project scope."
 },
 {
  keys:["gst","tax","taxes"],
  answer:"For India, applicable GST/taxes are charged according to the business's actual tax status and applicable law and are shown on the invoice. International tax treatment depends on applicable law."
 },
 {
  keys:["privacy","policy","terms","condition"],
  answer:"The website provides Payment Policy, Refund/Cancellation Policy, India Tax Policy, International Client Policy, Privacy, Terms & Conditions and Payment Security information."
 },
 {
  keys:["price","pricing","package","packages","cost"],
  answer:"Available project values are ₹20,000, ₹50,000, ₹80,000, ₹1.2 lakh, ₹1.8 lakh, ₹2 lakh, ₹2.4 lakh, ₹2.8 lakh, ₹3 lakh, ₹3.2 lakh, ₹3.6 lakh, ₹4 lakh, ₹4.5 lakh, ₹5 lakh and ₹6 lakh. Every standard package requires 50% advance."
 },
 {
  keys:["whatsapp","contact","email"],
  answer:"WhatsApp: +91 81279 68129. Email: arbglobalitservice@gmail.com. You can also contact ARB Globle IT & Service through the website."
 }
];

function esc(text){
 const d=document.createElement("div");
 d.textContent=String(text ?? "");
 return d.innerHTML;
}

function getCountry(){
 let saved=localStorage.getItem("arb_country");
 if(saved && countries[saved]) return saved;

 const lang=(navigator.language||"en-IN").toUpperCase();
 const code=lang.split("-")[1];
 if(code && countries[code]) return code;

 return "IN";
}

let currentCountry=getCountry();
let selectedPackage=null;

function money(inr){
 const c=countries[currentCountry];
 let value=inr*c.rate;
 return c.symbol + value.toLocaleString(undefined,{
  maximumFractionDigits:c.currency==="JPY"?0:2
 })+" "+c.currency;
}

function setupCountries(){
 const select=document.getElementById("countrySelect");

 Object.entries(countries).forEach(([code,c])=>{
  const option=document.createElement("option");
  option.value=code;
  option.textContent=c.name+" — "+c.currency;
  select.appendChild(option);
 });

 select.value=currentCountry;

 select.addEventListener("change",()=>{
  currentCountry=select.value;
  localStorage.setItem("arb_country",currentCountry);
  renderPackages();
  updateSelected();
 });
}

function renderServices(){
 const box=document.getElementById("servicesGrid");

 box.innerHTML=services.map(s=>`
 <article class="card">
   <div style="font-size:28px;margin-bottom:10px">${s[0]}</div>
   <h3>${esc(s[1])}</h3>
   <p>${esc(s[2])}</p>
 </article>
 `).join("");
}

function renderProcess(){
 const box=document.getElementById("processGrid");

 box.innerHTML=process.map(p=>`
 <article class="card">
   <div class="num">${p[0]}</div>
   <h3>${esc(p[1])}</h3>
   <p>${esc(p[2])}</p>
 </article>
 `).join("");
}

function renderPackages(){
 const box=document.getElementById("packagesGrid");

 box.innerHTML=packages.map((price,index)=>{
  const advance=price/2;

  return `
  <article class="card package">
    <small>ARB Website Package ${index+1}</small>
    <h3 style="margin-top:8px">${money(price)}</h3>
    <div class="price">${money(price)}</div>
    <div class="advance">50% Advance: ${money(advance)}</div>
    <p>Professional website solution with scope and features according to the selected package.</p>
    <button class="btn primary" onclick="selectPackage(${price})">
      Choose Package
    </button>
  </article>`;
 }).join("");
}

function selectPackage(price){
 selectedPackage=price;
 updateSelected();

 document.getElementById("payment").scrollIntoView({
  behavior:"smooth"
 });
}

function updateSelected(){
 const p=document.getElementById("selectedPackage");
 const price=document.getElementById("selectedPrice");
 const advance=document.getElementById("selectedAdvance");

 if(!selectedPackage){
  p.textContent="Choose a package above.";
  price.textContent="—";
  advance.textContent="50% Advance: —";
  return;
 }

 p.textContent="Selected Project: "+money(selectedPackage);
 price.textContent=money(selectedPackage);
 advance.textContent="50% Advance: "+money(selectedPackage/2);
}

function addAI(text,type){
 const box=document.getElementById("aiMessages");
 const div=document.createElement("div");

 div.className="ai-msg "+type;
 div.innerHTML=esc(text).replace(/\n/g,"<br>");

 box.appendChild(div);
 box.scrollTop=box.scrollHeight;
}

function localAI(question){
 const q=question.toLowerCase().trim();

 if(!q){
  return "Please type your question.";
 }

 let best=null;
 let score=0;

 for(const rule of aiRules){
  let s=0;

  for(const key of rule.keys){
   if(q.includes(key.toLowerCase())) s++;
  }

  if(s>score){
   score=s;
   best=rule.answer;
  }
 }

 if(best) return best;

 return "I can help with ARB Globle IT & Service information including services, website packages, 50% advance, remaining payment, Cashfree, international ACH/bank transfer, currencies, domain, hosting, delivery, revisions, GST/tax, refund, privacy, terms and contact details. For a custom requirement, please contact us on WhatsApp or email.";
}

function setupAI(){
 const input=document.getElementById("aiInput");
 const send=document.getElementById("aiSend");
 const quick=document.getElementById("quickPrompts");

 addAI(
  "Hello! I am the ARB Global AI Assistant. Ask me about services, packages, 50% advance, payment, global clients, domain, hosting, delivery or policies.",
  "bot"
 );

 const prompts=[
  "What services do you offer?",
  "How does 50% advance work?",
  "Do you support international clients?",
  "How can I pay from India?",
  "What is the refund policy?",
  "What are your packages?"
 ];

 quick.innerHTML=prompts.map(x=>`
 <button type="button">${esc(x)}</button>
 `).join("");

 quick.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("click",()=>{
   input.value=btn.textContent;
   send.click();
  });
 });

 send.addEventListener("click",async()=>{
  const q=input.value.trim();

  if(!q)return;

  input.value="";
  addAI(q,"user");

  const answer=localAI(q);

  setTimeout(()=>{
   addAI(answer,"bot");
  },180);
 });

 input.addEventListener("keydown",e=>{
  if(e.key==="Enter"){
   e.preventDefault();
   send.click();
  }
 });
}

function sendRequirements(){
 const name=document.getElementById("fullName").value.trim();
 const business=document.getElementById("businessName").value.trim();
 const email=document.getElementById("email").value.trim();
 const whatsapp=document.getElementById("whatsapp").value.trim();
 const requirements=document.getElementById("requirements").value.trim();

 let message=
`Hello ARB Globle IT & Service,

I want to start a website project.

Name: ${name||"Not provided"}
Business: ${business||"Not provided"}
Email: ${email}
WhatsApp: ${whatsapp}
Country/Currency: ${countries[currentCountry].name} / ${countries[currentCountry].currency}
Package: ${selectedPackage ? money(selectedPackage) : "Custom / Not selected"}
50% Advance: ${selectedPackage ? money(selectedPackage/2) : "To be quoted"}

Requirements:
${requirements||"Please contact me to discuss my requirements."}`;

 window.open(
  "https://wa.me/918127968129?text="+encodeURIComponent(message),
  "_blank"
 );
}

function createFallingRings(){
 const count=innerWidth<600?7:14;

 for(let i=0;i<count;i++){
  const ring=document.createElement("div");

  ring.className="falling-ring";
  ring.style.setProperty("--x",Math.random()*100+"vw");
  ring.style.setProperty("--r",Math.random()*180+"deg");
  ring.style.setProperty("--d",(7+Math.random()*10).toFixed(1)+"s");
  ring.style.setProperty("--delay",(-Math.random()*12).toFixed(1)+"s");

  ring.style.width=(55+Math.random()*100)+"px";
  ring.style.height=(18+Math.random()*35)+"px";

  document.body.appendChild(ring);
 }
}

document.addEventListener("DOMContentLoaded",()=>{
 document.getElementById("year").textContent=new Date().getFullYear();

 setupCountries();
 renderServices();
 renderProcess();
 renderPackages();
 updateSelected();
 setupAI();
 createFallingRings();
});
