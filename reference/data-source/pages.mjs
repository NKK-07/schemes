// Landing pages for topics (what you get) and sectors, plus URL slug overrides.

const hasType = (...t) => (s) => s.type.some((x) => t.includes(x));

export const TOPICS = [
  {
    slug: "grants", short: "Grants & prizes", home: true, match: hasType("grant", "fellowship", "challenge"),
    filter: "type=grant,fellowship,challenge",
    title: "Government Grants for Startups in India (2026): Non-Dilutive Funding",
    h1: "Government grants for startups",
    description: "Non-dilutive government grants, stipends and prize challenges for Indian startups and student founders — amounts, eligibility and how to apply.",
    blurb: "Money you don't repay and that costs no equity.",
    intro: [
      "Grants don't have to be repaid and don't cost you equity. They range from ₹10,000 school awards to ₹25 crore defence R&D grants, and most are released in milestones through an incubator or the funding agency.",
      "Stipends (fellowships) pay a founder to work full time on an idea; challenges award prize money and often a first government customer."
    ]
  },
  {
    slug: "loans-and-credit-guarantees", short: "Loans & guarantees", home: true, match: hasType("loan", "guarantee"),
    filter: "type=loan,guarantee",
    title: "Collateral-Free Loans & Credit Guarantees for Startups in India (2026)",
    h1: "Loans and credit guarantees for startups",
    description: "Collateral-free loans for Indian startups and MSMEs — CGSS up to ₹20 crore, CGTMSE, Mudra, PMEGP and state soft loans — with eligibility and how to apply.",
    blurb: "Borrow without pledging assets.",
    intro: [
      "Government credit guarantees cover most of a lender's risk, so banks, NBFCs and venture-debt funds can lend to young companies without collateral. Several states also run soft-loan and interest-free schemes.",
      "Most of these need Udyam (MSME) registration or DPIIT recognition before a lender will apply for the guarantee."
    ]
  },
  {
    slug: "equity-funding", short: "Equity funding", home: true, match: hasType("equity"),
    filter: "type=equity",
    title: "Government Equity Funding & VC Funds for Startups in India (2026)",
    h1: "Equity funding backed by the government",
    description: "Where government money reaches startups as equity — Fund of Funds 2.0, the RDI Fund, space and agri funds, BIRAC and state seed funds.",
    blurb: "Government-backed venture and seed funds.",
    intro: [
      "The government rarely invests in startups directly. Most equity flows through SEBI-registered venture funds that it backs, such as those under the ₹10,000 crore Fund of Funds 2.0 — so you pitch the fund, not the ministry.",
      "A few programmes, including BIRAC's SEED and LEAP funds and several state seed funds, invest through incubators."
    ]
  },
  {
    slug: "tax-and-compliance", short: "Tax & compliance relief", home: true, match: hasType("tax", "compliance"),
    filter: "type=tax,compliance",
    title: "Startup Tax Benefits & Compliance Relief in India (2026)",
    h1: "Tax benefits and compliance relief",
    description: "The Section 140 (formerly 80-IAC) tax holiday, the end of angel tax, ESOP deferral, DPIIT recognition and self-certification — what each means for your startup.",
    blurb: "Tax holidays, fewer filings, faster exits.",
    intro: [
      "Recognised startups can pay no income tax on profits for three of their first ten years, raise equity without angel tax, and self-certify some labour and environment compliance.",
      "Almost all of this starts with free DPIIT recognition; the tax holiday also needs a separate Inter-Ministerial Board certificate."
    ]
  },
  {
    slug: "patents-and-ip", short: "Patents & IP", home: false, match: hasType("ipr"),
    filter: "type=ipr",
    title: "Patent & Trademark Support for Startups in India (2026)",
    h1: "Patent and IP support",
    description: "Cheaper patents and trademarks for Indian startups — 80% fee rebates, free facilitators, fast-track examination and state patent-cost refunds.",
    blurb: "Fee rebates, free help and refunds.",
    intro: [
      "Recognised startups pay 80% less in patent fees and 50% less for trademarks, get government-paid facilitators, and can ask for fast-track examination.",
      "Many states and the MSME Ministry also refund patent filing costs — often up to ₹10 lakh for international filings."
    ]
  },
  {
    slug: "selling-to-government", short: "Selling to government", home: false, match: hasType("procurement"),
    filter: "type=procurement",
    title: "Selling to Government as a Startup in India: Tenders, GeM & Pilots",
    h1: "Selling to government",
    description: "How startups win government customers — relaxed tender rules on GeM, iDEX and Rail Tech challenges, and state pilot work orders.",
    blurb: "Tenders, pilots and first orders.",
    intro: [
      "Recognised startups can bid in central tenders without prior turnover or experience and without an earnest money deposit.",
      "Challenge programmes in defence, railways and several states go further: solve a listed problem and you get a pilot order or a procurement pathway."
    ]
  },
  {
    slug: "incubation-and-mentoring", short: "Incubation & labs", home: false, match: hasType("incubation", "support", "infrastructure", "compute"),
    filter: "type=incubation,support,infrastructure,compute",
    title: "Government Startup Incubators, Labs & Mentoring in India (2026)",
    h1: "Incubation, labs and mentoring",
    description: "Government-backed incubators, maker labs, subsidised GPUs and mentoring networks for Indian startups — and why incubation unlocks most grants.",
    blurb: "Space, labs, compute and mentors.",
    intro: [
      "Hundreds of government-backed incubators offer cheap desks, labs and mentors — and being incubated is the entry ticket to PRAYAS, EIR, NIDHI-SSP, TIDE and many state grants.",
      "This page also covers subsidised AI compute and national mentoring platforms."
    ]
  },
  {
    slug: "students", short: "For students", home: true, match: (s) => !!s.student,
    filter: "student=1",
    title: "Government Schemes for Student Entrepreneurs in India (2026)",
    h1: "Schemes for student founders",
    description: "Grants, stipends, hackathons and campus programmes for student entrepreneurs in India — most need no registered company. Eligibility and how to apply.",
    blurb: "Most need no registered company.",
    intro: [
      "Students can use most early-stage programmes before incorporating: prototype grants, founder stipends, hackathons and state student-innovation schemes.",
      "Start with your college's innovation cell — many schemes are routed through campus incubators."
    ]
  }
];

export const SECTOR_PAGES = [
  { key: "deeptech", slug: "deep-tech", short: "Deep tech", blurb: "R&D capital, chips, quantum, AI hardware.",
    title: "Government Schemes for Deep-Tech Startups in India (2026)", h1: "Deep-tech startup schemes",
    description: "Government funding for Indian deep-tech startups — the ₹1 lakh crore RDI Fund, Semicon 2.0, TDB, iDEX, NIDHI and state deep-tech grants.",
    intro: ["Deep-tech startups get the longest-horizon support: low-interest R&D loans, equity from the RDI Fund, chip-design incentives and defence challenges. The February 2026 DPIIT framework also lets deep-tech startups stay recognised for up to 20 years."] },
  { key: "tech", slug: "software-and-ai", short: "Software & AI", blurb: "SaaS, AI, IT product startups.",
    title: "Government Schemes for Software & AI Startups in India (2026)", h1: "Software and AI startup schemes",
    description: "Government support for Indian software, SaaS and AI startups — MeitY SAMRIDH, TIDE 2.0, GENESIS, subsidised IndiaAI GPUs and state grants.",
    intro: ["MeitY runs most of the support for software and AI products — accelerators, incubator grants and subsidised GPU compute — alongside the any-sector schemes every startup can use."] },
  { key: "manufacturing", slug: "manufacturing-and-hardware", short: "Manufacturing & hardware", blurb: "Hardware, electronics, industrial.",
    title: "Government Schemes for Manufacturing & Hardware Startups in India (2026)", h1: "Manufacturing and hardware startup schemes",
    description: "Support for Indian hardware and manufacturing startups — prototype grants, PMEGP, equipment-loan guarantees, ZED, TDB and chip-design incentives.",
    intro: ["Hardware needs money earlier and in larger amounts. These schemes cover prototypes, machinery, quality certification and equipment loans, with Fund of Funds 2.0 now earmarking capital for tech-led manufacturing."] },
  { key: "bio", slug: "biotech-and-health", short: "Biotech & health", blurb: "Biotech, medtech, pharma.",
    title: "Government Schemes for Biotech, Medtech & Pharma Startups in India (2026)", h1: "Biotech, health and pharma schemes",
    description: "Funding for Indian biotech, medtech and pharma startups — BIRAC BIG up to ₹50 lakh, SEED, LEAP, PRIP up to ₹5 crore, Biopharma SHAKTI and more.",
    intro: ["BIRAC (under the Department of Biotechnology) funds most early-stage life-science startups, with the Department of Pharmaceuticals backing later-stage drug and device R&D."] },
  { key: "agri", slug: "agriculture-and-food", short: "Agri & food", blurb: "Agritech, food processing, rural.",
    title: "Government Schemes for Agritech & Food Startups in India (2026)", h1: "Agriculture and food startup schemes",
    description: "Support for Indian agritech and food startups — RKVY grants up to ₹25 lakh, the NABARD AgriSURE fund, Agriculture Infrastructure Fund loans and PMFME subsidies.",
    intro: ["Agri and food startups have their own grant pipeline through agribusiness incubators at agricultural universities, plus dedicated funds and cheaper infrastructure loans."] },
  { key: "climate", slug: "energy-and-climate", short: "Energy & climate", blurb: "Clean energy, EV, climate tech.",
    title: "Government Schemes for Climate & Clean-Energy Startups in India (2026)", h1: "Energy and climate startup schemes",
    description: "Government support for Indian climate-tech and clean-energy startups — RDI Fund loans, TDB, BioE3 and state green-tech grants.",
    intro: ["Energy transition and climate tech is a priority sector for the RDI Fund and several state programmes, which offer higher grants for green-tech startups."] },
  { key: "space", slug: "space-tech", short: "Space tech", blurb: "Satellites, launch, space data.",
    title: "Government Schemes for Space-Tech Startups in India (2026)", h1: "Space-tech startup schemes",
    description: "Support for Indian space startups — IN-SPACe seed fund, Technology Adoption Fund up to ₹25 crore, the ₹1,000 crore space VC fund and more.",
    intro: ["IN-SPACe, the space regulator and promoter, runs most support for private space companies — from seed grants and ISRO facility access to a dedicated venture fund."] },
  { key: "defence", slug: "defence-and-aerospace", short: "Defence & aerospace", blurb: "Defence tech and dual-use.",
    title: "Government Schemes for Defence-Tech Startups in India (2026)", h1: "Defence and aerospace startup schemes",
    description: "Defence-tech funding for Indian startups — iDEX grants up to ₹1.5 crore, ADITI up to ₹25 crore, DRDO's Technology Development Fund and more.",
    intro: ["The Ministry of Defence funds startups through problem-led challenges: solve a need set by the armed forces and you get a grant, user trials and a route to procurement."] }
];

// Friendlier URLs for a few long scheme names.
export const SLUG_OVERRIDES = {
  sec140: "startup-tax-holiday-section-140-80-iac",
  taxrelief: "startup-tax-reliefs-esop-loss-carry-forward",
  sipp: "startup-patent-trademark-fee-rebates-sipp",
  procure: "selling-to-government-gem-startup-runway",
  iic: "institutions-innovation-council-nisp",
  idex: "idex-defence-startup-challenges",
  selfcert: "self-certification-labour-environment-laws",
  network: "startup-india-hub-investor-connect-maarg",
  incubators: "government-startup-incubators",
  "birac-student": "birac-student-programmes-sitare-e-yuva",
  "tg-tsic": "telangana-innovation-cell-student-programmes",
  "dh-ips": "investment-promotion-scheme-2022-27"
};
