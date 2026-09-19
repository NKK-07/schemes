export const DOCS = {
 inc:"Certificate of incorporation (company / LLP / partnership deed)",
 dpiit:"DPIIT recognition certificate",
 udyam:"Udyam (MSME) registration certificate",
 pan:"Company PAN and GST registration (if registered)",
 kyc:"Founders' KYC — Aadhaar and PAN",
 deck:"Pitch deck — problem, solution, market, team, traction",
 prop:"Project proposal with milestones and budget",
 dpr:"Detailed project report (DPR) with cost estimates",
 fin:"Financial statements / ITRs for the last 2–3 years (if any)",
 bank:"Bank statements for the last 6–12 months",
 ip:"Patent or IP filings, or a prior-art search (if any)",
 incub:"Letter from your incubator confirming incubation",
 proto:"Proof of prototype or PoC — photos, video, test data",
 cap:"Cap table / shareholding pattern",
 board:"Board resolution authorising the application",
 dom:"Proof that the startup is registered or operating in the state",
 student:"Student ID or bonafide certificate from your institution",
 edu:"Educational certificates of the founders",
 quote:"Quotations for machinery or equipment",
 land:"Premises proof — rent agreement or ownership papers",
 fees:"Invoices and payment receipts for costs you're claiming"
};

export const TYPES = {
 grant:"Grant", loan:"Loan", equity:"Equity", guarantee:"Credit guarantee", tax:"Tax relief", ipr:"IP support",
 procurement:"Govt buyer", incubation:"Incubation", fellowship:"Stipend", subsidy:"Subsidy", challenge:"Challenge / prize",
 compute:"Compute", infrastructure:"Labs & infra", compliance:"Registration & compliance", support:"Mentoring & network"
};
export const STAGES = { idea:"Idea / pre-revenue", early:"Early revenue", growth:"Growth / scaling" };
export const SECTORS = {
 all:"Any sector", tech:"Software & AI", deeptech:"Deep tech", manufacturing:"Manufacturing & hardware", bio:"Biotech, health & pharma",
 agri:"Agri & food", defence:"Defence", space:"Space", climate:"Energy & climate", telecom:"Telecom", rail:"Railways & mobility"
};
export const STATUS = {
 open:"Open", calls:"Periodic calls", deadline:"Closing soon", announced:"Announced", closed:"Closed", auto:"Automatic"
};
export const EASE = {1:"Simple online form", 2:"Proposal + review", 3:"Competitive selection"};

// tile-grid map positions [col,row]
export const REGIONS = [
 ["LA","Ladakh",3,0,"UT"],["JK","Jammu & Kashmir",2,1,"UT"],["HP","Himachal Pradesh",3,1],
 ["PB","Punjab",2,2],["CH","Chandigarh",3,2,"UT"],["UK","Uttarakhand",4,2],["AR","Arunachal Pradesh",9,2],
 ["RJ","Rajasthan",1,3],["HR","Haryana",2,3],["DL","Delhi",3,3,"UT"],["UP","Uttar Pradesh",4,3],["BR","Bihar",5,3],["SK","Sikkim",6,3],["AS","Assam",8,3],["NL","Nagaland",9,3],
 ["GJ","Gujarat",1,4],["MP","Madhya Pradesh",2,4],["CG","Chhattisgarh",3,4],["JH","Jharkhand",4,4],["WB","West Bengal",5,4],["ML","Meghalaya",7,4],["MN","Manipur",9,4],
 ["DH","Dadra & Nagar Haveli and Daman & Diu",1,5,"UT"],["MH","Maharashtra",2,5],["TG","Telangana",3,5],["OD","Odisha",4,5],["TR","Tripura",7,5],["MZ","Mizoram",8,5],
 ["GA","Goa",1,6],["KA","Karnataka",2,6],["AP","Andhra Pradesh",3,6],
 ["LD","Lakshadweep",0,7,"UT"],["KL","Kerala",2,7],["TN","Tamil Nadu",3,7],["PY","Puducherry",4,7,"UT"],["AN","Andaman & Nicobar Islands",6,7,"UT"]
];
// 5th States' Startup Ecosystem Ranking (released Jan 2026)
export const RANKING = {
 GJ:"Best Performer", AR:"Best Performer", GA:"Best Performer",
 KA:"Top Performer", PB:"Top Performer", TN:"Top Performer", UP:"Top Performer", HP:"Top Performer",
 RJ:"Leader", KL:"Leader", MP:"Leader", UK:"Leader", TG:"Leader", MH:"Leader", AP:"Leader", HR:"Leader", MN:"Leader", ML:"Leader", NL:"Leader",
 OD:"Aspiring Leader", AS:"Aspiring Leader", BR:"Aspiring Leader", JK:"Aspiring Leader", MZ:"Aspiring Leader", SK:"Aspiring Leader", TR:"Aspiring Leader", AN:"Aspiring Leader",
 CG:"Emerging", DL:"Emerging", PY:"Emerging", CH:"Emerging", LA:"Emerging", LD:"Emerging", DH:"Emerging"
};

export const UPDATES = [
 {d:"2026-09-09", t:"Semicon 2.0 revamps chip-design support", x:"MeitY notified new DLI terms: VC co-investment, royalty financing and a 9% deployment incentive (up to ₹30 crore).", id:"dli"},
 {d:"2026-07-16", t:"Delhi approves ₹400 crore Start-up Policy 2026", x:"Runs through universities, colleges, polytechnics and ITIs; targets 10,000 startups.", id:"dl-policy"},
 {d:"2026-06-09", t:"Punjab raises seed grant to ₹5 lakh", x:"Up from ₹3 lakh under the Punjab Startup & Industrial Policy 2026.", id:"pb-policy"},
 {d:"2026-05-31", t:"Startup India Seed Fund closes", x:"SISFS stopped taking startup applications after two extensions; no successor announced yet.", id:"sisfs"},
 {d:"2026-05-13", t:"First RDI Fund cheques released", x:"Five deep-tech startups funded through TDB and BIRAC, including ₹105 crore to a space startup.", id:"rdi"},
 {d:"2026-04-25", t:"Fund of Funds 2.0 guidelines issued", x:"₹10,000 crore for deep tech, micro-VC, manufacturing and sector-agnostic funds; SIDBI implements.", id:"fof2"},
 {d:"2026-04-01", t:"80-IAC becomes Section 140", x:"The Income-tax Act, 2025 took effect; the startup tax holiday continues under a new section number.", id:"sec140"},
 {d:"2026-03-21", t:"Mutual credit guarantee eased for manufacturers", x:"MCGS-MSME now covers 75% for exporters and needs equipment to be only 60% of project cost.", id:"mcgs"},
 {d:"2026-02-27", t:"Railways launches Rail Tech Policy", x:"iDEX-style portal; up to 50% funding and bigger prototype and scale-up grants.", id:"rail"},
 {d:"2026-02-04", t:"New DPIIT startup definition", x:"Turnover limit doubled to ₹200 crore; new Deep Tech Startup category (20 years, ₹300 crore); co-ops eligible.", id:"dpiit"},
 {d:"2026-02-01", t:"Budget 2026-27 for small firms", x:"₹10,000 crore SME Growth Fund, ₹2,000 crore SRI Fund top-up, Biopharma SHAKTI, TReDS push and Corporate Mitras.", id:"sme-growth"},
 {d:"2026-01-19", t:"Karnataka Startup Policy 2025-30 launched", x:"₹675 crore outlay; ELEVATE NxT deep-tech grants up to ₹1 crore.", id:"ka-policy"},
 {d:"2026-01-16", t:"5th States' Startup Ranking released", x:"Gujarat best among large states; Arunachal Pradesh and Goa best among small states and UTs.", id:""},
 {d:"2025-10-01", t:"PRIP opens for pharma and medtech", x:"Startups can get up to ₹5 crore for early-stage projects.", id:"prip"},
 {d:"2025-09-26", t:"Goa rolls out Startup Policy 2025", x:"Adds a Campus Innovation Scheme for students.", id:"ga-policy"},
 {d:"2025-08-06", t:"Maharashtra approves 2025 startup policy", x:"₹500 crore Maha-Fund and ₹25 lakh pilot orders via Startup Week.", id:"mh-policy"},
 {d:"2025-05-09", t:"CGSS cover doubled to ₹20 crore", x:"Lower 1% fee for startups in 27 champion sectors.", id:"cgss"}
];

export const GLOSSARY = {
 "DPIIT":"Department for Promotion of Industry and Internal Trade — the central department that recognises startups and runs Startup India.",
 "IMB":"Inter-Ministerial Board — the panel that certifies startups for the income-tax holiday.",
 "TBI":"Technology Business Incubator — an incubator, usually at an academic institution, supported by DST.",
 "AIF":"Alternative Investment Fund — a SEBI-registered pooled fund, such as a venture capital fund.",
 "AIFs":"Alternative Investment Funds — SEBI-registered pooled funds, such as venture capital funds.",
 "SEBI":"Securities and Exchange Board of India — the markets regulator that registers VC funds.",
 "SIDBI":"Small Industries Development Bank of India — the lead development bank for MSMEs and the manager of several startup funds.",
 "NABARD":"National Bank for Agriculture and Rural Development.",
 "NCGTC":"National Credit Guarantee Trustee Company — runs government credit guarantee schemes such as CGSS.",
 "CGTMSE":"Credit Guarantee Fund Trust for Micro and Small Enterprises — guarantees collateral-free loans to small firms.",
 "BIRAC":"Biotechnology Industry Research Assistance Council — DBT's funding arm for biotech startups.",
 "DST":"Department of Science and Technology.",
 "DBT":"Department of Biotechnology.",
 "NIDHI":"National Initiative for Developing and Harnessing Innovations — DST's umbrella programme for startup support.",
 "MeitY":"Ministry of Electronics and Information Technology.",
 "AIM":"Atal Innovation Mission, run by NITI Aayog.",
 "TDB":"Technology Development Board — a DST body that lends to and invests in technology companies.",
 "ANRF":"Anusandhan National Research Foundation — manages the RDI Fund.",
 "TRL":"Technology Readiness Level — a 1–9 scale; TRL 4 means a technology validated in the lab.",
 "PoC":"Proof of concept — evidence that your core idea works.",
 "MVP":"Minimum viable product — the simplest version customers can use.",
 "DPR":"Detailed project report — a costed plan banks and agencies use to appraise a project.",
 "SGST":"State Goods and Services Tax — the state's share of GST, which some states refund to startups.",
 "GeM":"Government e-Marketplace — the online portal through which government departments buy.",
 "EMD":"Earnest money deposit — a security deposit normally required to bid in tenders.",
 "TReDS":"Trade Receivables Discounting System — platforms where small firms sell invoices for early payment.",
 "Udyam":"The official MSME registration, done online with Aadhaar and PAN.",
 "MSME":"Micro, small and medium enterprise.",
 "KVIC":"Khadi and Village Industries Commission — implements PMEGP.",
 "DIC":"District Industries Centre — the district office for industry schemes.",
 "SLFM":"Second Level Fund Manager — an agency (like TDB or BIRAC) that deploys RDI Fund money to companies.",
 "EIR":"Entrepreneur in Residence — a stipend to work full time on a startup idea.",
 "IPR":"Intellectual property rights — patents, trademarks, designs, copyright.",
 "SPOC":"Single point of contact — the coordinator at your institution.",
 "EDA":"Electronic design automation — software used to design chips.",
 "NBFC":"Non-banking financial company — an RBI-regulated lender that isn't a bank.",
 "R-ABI":"RKVY Agribusiness Incubator — agri incubators that run the RKVY startup grants.",
 "IIC":"Institution's Innovation Council — the innovation cell in a college.",
 "QRate":"iStart Rajasthan's startup rating, needed for larger state incentives.",
 "KSUM":"Kerala Startup Mission — Kerala's startup agency.",
 "MSInS":"Maharashtra State Innovation Society — Maharashtra's startup agency.",
 "CPSE":"Central public sector enterprise — a company owned by the central government.",
 "venture debt":"Loans to startups, usually alongside equity rounds, from specialised lenders.",
 "sustenance allowance":"A monthly stipend some states pay founders so they can work on their startup full time.",
 "angel tax":"The old tax on share premium above fair value, abolished from AY 2025-26.",
 "convertible debentures":"Debt that can later convert into equity shares."
};

export const ROADMAP = {
 founder:[
  {t:"Incorporate the company", x:"Register a private limited company or LLP through the MCA portal. Most schemes need an incorporated entity.", ids:[]},
  {t:"Get DPIIT recognition and Udyam registration", x:"Both are free and online. DPIIT unlocks central startup benefits; Udyam unlocks MSME loans, guarantees and procurement preferences.", ids:["dpiit","udyam"]},
  {t:"Register with your state's startup portal", x:"State allowances, seed grants and reimbursements need state registration. Open the map to find yours.", ids:[]},
  {t:"Join an incubator", x:"Incubators are the doorway to PRAYAS, EIR, NIDHI-SSP, TIDE and many state grants.", ids:["incubators"]},
  {t:"Protect your IP cheaply", x:"File patents and trademarks as a recognised startup to get the fee rebates.", ids:["sipp"]},
  {t:"Fund the prototype with grants", x:"Idea-stage grants don't dilute you. Pick those that match your sector.", ids:["prayas","tide","big","rkvy"]},
  {t:"Take the product to market", x:"Seed grants, accelerators and challenges for startups with a working product.", ids:["ssp","samridh","anic","idex"]},
  {t:"Add debt without collateral", x:"Guaranteed loans let you borrow for working capital and equipment without pledging assets.", ids:["cgss","cgtmse","mudra"]},
  {t:"Raise equity", x:"Pitch VC funds backed by the government's Fund of Funds, or sector funds for space and agri.", ids:["fof2","agrisure","space-vc"]},
  {t:"Sell to government and claim the tax holiday", x:"Use procurement relaxations on GeM, and apply for the IMB certificate once you're profitable.", ids:["procure","sec140"]}
 ],
 student:[
  {t:"Start with your campus", x:"Join your college's innovation cell and ask about startup credits, leave and IP policy.", ids:["iic"]},
  {t:"Compete", x:"Hackathons and challenges build a team, a prototype and credibility.", ids:["sih","bioe3","d2d"]},
  {t:"Get a stipend to go full time", x:"Fellowships pay you to work on your idea instead of taking a job.", ids:["eir","tide"]},
  {t:"Build the prototype with a grant", x:"No company needed at this stage for most of these.", ids:["prayas","birac-student","msme-innov"]},
  {t:"Use your state's student scheme", x:"Several states fund student prototypes directly.", ids:["gj-ssip","ka-nain","kl-iedc","ap-policy","dl-policy"]},
  {t:"Incorporate and get recognised", x:"When you're ready for customers or investors, form a company and get DPIIT recognition.", ids:["dpiit","sipp"]}
 ]
};
