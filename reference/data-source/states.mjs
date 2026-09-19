// State & UT schemes — researched Sept 2026
export const STATE = [
// ---------- KARNATAKA ----------
{
 id:"ka-policy", st:"KA", name:"Karnataka Startup Policy 2025-30", abbr:"KA Policy", body:"Dept of Electronics, IT & BT, Govt of Karnataka",
 type:["grant","equity","procurement"], stage:["idea","early","growth"], sector:["all","deeptech"], amt:"₹675 cr outlay", amtL:0,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2026-01",
 sum:"Launched 19 January 2026 with a ₹675 crore outlay and a goal of 25,000 new startups by 2030 — at least 10,000 from outside Bengaluru. It bundles ELEVATE grants, a new ₹150 crore deep-tech programme, cluster seed funds and 'Government First' procurement.",
 ben:["ELEVATE grants up to ₹50 lakh; ELEVATE NxT up to ₹1 crore for deep tech","Beyond Bengaluru Cluster Seed Fund (₹75 crore) for Mysuru, Mangaluru and Hubballi-Dharwad","'Government First': state departments as a startup's first customer","Incubation, mentoring, market access and global connects"],
 elig:["Startups registered in Karnataka and recognised under the state's startup definition"],
 docs:["inc","dpiit","deck","dom"],
 steps:["Register on the Startup Karnataka portal","Apply to the specific programme (ELEVATE, NxT, cluster fund) when its call opens"],
 link:"https://eitbt.karnataka.gov.in/startup/public/policy/en",
 stacks:["ka-elevate","ka-nxt","ka-bb"], verified:"Verified Sep 2026 (launch coverage, Jan 2026)"
},
{
 id:"ka-elevate", st:"KA", name:"ELEVATE (Idea2PoC) Grant", abbr:"ELEVATE", body:"Startup Karnataka / K-tech",
 type:["grant","challenge"], stage:["idea","early"], sector:["all"], amt:"Up to ₹50 lakh", amtL:50,
 student:false, dpiit:false, status:"calls", ease:3, tier:"top", since:"2025-01",
 sum:"Karnataka's flagship grant-in-aid challenge for early startups. The 2025 edition picked 146 winners with ₹38.85 crore of grants; 43% were women-led and 43% from beyond Bengaluru.",
 ben:["Grant-in-aid up to ₹50 lakh, milestone-linked","Mentoring and visibility through Startup Karnataka"],
 elig:["Karnataka-registered startups with an innovative product or idea","Turnover below ₹100 crore"],
 docs:["inc","deck","prop","dom","kyc"],
 steps:["Apply on the Startup Karnataka portal when the ELEVATE call opens","Screening, then pitch to the jury (Elevate Unnati is a parallel track for SC/ST founders)"],
 link:"https://eitbt.karnataka.gov.in/startup/public/policy/en",
 stacks:["ka-nxt","sipp","ssp"], verified:"Verified Sep 2026 (ELEVATE 2025 results)"
},
{
 id:"ka-nxt", st:"KA", name:"ELEVATE NxT (deep tech)", abbr:"ELEVATE NxT", body:"Govt of Karnataka",
 type:["grant"], stage:["early","growth"], sector:["deeptech","bio","climate","space"], amt:"Up to ₹1 crore", amtL:100,
 student:false, dpiit:false, status:"calls", ease:3, tier:"major", since:"2026-01",
 sum:"A new ₹150 crore programme under the 2025-30 policy for deep-tech startups in AI, IoT, robotics, biotech, quantum, green energy and space tech, with milestone-based support up to ₹1 crore.",
 ben:["Up to ₹1 crore per startup, released against milestones"],
 elig:["Karnataka deep-tech startups"],
 docs:["inc","dpr","ip","deck"],
 steps:["Watch the Startup Karnataka portal for the NxT call"],
 link:"https://eitbt.karnataka.gov.in/startup/public/policy/en",
 stacks:["ka-elevate","rdi"], verified:"Verified Sep 2026"
},
{
 id:"ka-bb", st:"KA", name:"Beyond Bengaluru Cluster Seed Fund", abbr:"Cluster Seed Fund", body:"Govt of Karnataka with private partners",
 type:["equity"], stage:["early"], sector:["all"], amt:"₹75 cr fund; ~₹50 L per startup", amtL:50,
 student:false, dpiit:false, status:"open", ease:3, tier:"more", since:"2026-01",
 sum:"A ₹75 crore seed fund (₹20 crore from the state plus private capital) investing in startups from Mysuru, Mangaluru and Hubballi-Dharwad clusters.",
 ben:["Seed investment of about ₹50 lakh per startup (capped at 10% of the fund)"],
 elig:["Startups based in the designated Karnataka clusters"],
 docs:["inc","deck","cap"],
 steps:["Pitch the fund through the cluster's startup hub"],
 link:"https://eitbt.karnataka.gov.in/startup/public/policy/en",
 stacks:["ka-elevate"], verified:"Verified Sep 2026"
},
{
 id:"ka-nain", st:"KA", name:"NAIN — New Age Incubation Network (colleges)", abbr:"NAIN", body:"K-tech, Govt of Karnataka",
 type:["grant","incubation"], stage:["idea"], sector:["all"], amt:"Around ₹4–5 lakh per student project", amtL:5,
 student:true, dpiit:false, status:"calls", ease:2, tier:"major", since:"2016-01",
 sum:"Innovation centres in engineering and other colleges across Karnataka that fund student teams to build prototypes over six months.",
 ben:["Project grants (recent college rounds: ₹4–5 lakh per project) for materials and prototyping","Mentoring through the college NAIN centre"],
 elig:["Full-time students of a college with a NAIN centre, in teams of 3–5"],
 docs:["student","prop"],
 steps:["Check if your college hosts a NAIN centre","Submit a proposal during its annual ideathon"],
 link:"https://k-tech.karnataka.gov.in/new-age-incubation-network/",
 stacks:["ka-elevate","prayas"], verified:"Amounts from a 2024-26 college round"
},
// ---------- KERALA ----------
{
 id:"kl-grants", st:"KL", name:"KSUM Innovation Grants (Idea, Productisation, Scale-up)", abbr:"KSUM grants", body:"Kerala Startup Mission",
 type:["grant"], stage:["idea","early","growth"], sector:["all"], amt:"₹3 L idea · ₹7 L product · ₹15 L scale-up", amtL:15,
 student:true, dpiit:false, status:"open", ease:2, tier:"top", since:"2024-01",
 sum:"Kerala's staged grants follow a startup from idea to revenue: an Idea Grant for prototypes, a Productisation Grant to finish the product, and a Scale-up Grant once you have revenue or investment.",
 ben:["Idea Grant up to ₹3 lakh","Productisation Grant up to ₹7 lakh (₹12 lakh for women-led startups)","Scale-up Grant up to ₹15 lakh"],
 elig:["Kerala-based startups with a KSUM Unique ID; incorporation needed before disbursement","Scale-up: ₹10 lakh product revenue in the last 6 months or ₹30 lakh external equity","Margin money: 20% (productisation) to 50% (scale-up)"],
 docs:["inc","dom","deck","prop","kyc"],
 steps:["Get a KSUM Unique ID","Apply on the KSUM grants portal","Pitch to the evaluation panel; funds released in tranches"],
 link:"https://startupmission.kerala.gov.in/schemes/idea-grant",
 stacks:["kl-seed","kl-iedc","sipp"], verified:"Verified Sep 2026 (KSUM scheme pages)"
},
{
 id:"kl-seed", st:"KL", name:"KSUM Seed Fund (soft loan)", abbr:"KSUM Seed", body:"Kerala Startup Mission",
 type:["loan"], stage:["early"], sector:["all","tech"], amt:"Up to ₹15 lakh at 6%", amtL:15,
 student:false, dpiit:true, status:"open", ease:2, tier:"major", since:"2023-01",
 sum:"A soft loan of up to ₹15 lakh at 6% simple interest for product startups, with a 12-month moratorium and 36 monthly repayments.",
 ben:["Up to ₹15 lakh at 6% simple interest","12-month moratorium, no prepayment penalty"],
 elig:["Kerala LLP or private limited company with a KSUM ID and DPIIT recognition","Innovative product or technology (not pure services or trading)"],
 docs:["inc","dpiit","dom","fin","kyc"],
 steps:["Apply on the KSUM portal","Evaluation and loan agreement"],
 link:"https://startupmission.kerala.gov.in/schemes/seed-fund",
 stacks:["kl-grants"], verified:"Verified Sep 2026"
},
{
 id:"kl-iedc", st:"KL", name:"KSUM IEDC Student Innovation Grants", abbr:"IEDC", body:"Kerala Startup Mission (Innovation & Entrepreneurship Development Centres)",
 type:["grant","incubation"], stage:["idea"], sector:["all"], amt:"Up to ₹2 lakh per student idea", amtL:2,
 student:true, dpiit:false, status:"open", ease:1, tier:"major", since:"2014-01",
 sum:"IEDCs in colleges across Kerala run bootcamps and fund student prototypes, with a path to KSUM's larger grants and patent support for student inventors.",
 ben:["Idea grant up to ₹2 lakh for student projects","Patent support and pre-incubation"],
 elig:["Students of Kerala colleges with an IEDC"],
 docs:["student","prop"],
 steps:["Join your college IEDC","Apply for the student idea grant through it"],
 link:"https://startupmission.kerala.gov.in",
 stacks:["kl-grants","prayas"], verified:"Verified Sep 2026 (IEDC schemes page)"
},
// ---------- TAMIL NADU ----------
{
 id:"tn-tanseed", st:"TN", name:"TANSEED", abbr:"TANSEED", body:"StartupTN (Tamil Nadu Startup and Innovation Mission)",
 type:["equity","incubation"], stage:["early"], sector:["all","climate"], amt:"₹10 L (₹15 L for green, rural, women-led)", amtL:15,
 student:false, dpiit:true, status:"calls", statusNote:"8.0 applications closed 30 Jan 2026; watch for 9.0", ease:3, tier:"top", since:"2026-01",
 sum:"Tamil Nadu's seed programme: an equity-linked grant plus a year-long accelerator. StartupTN takes a small support stake.",
 ben:["₹10 lakh seed support; ₹15 lakh for green-tech, rural-impact and women-led startups","One-year accelerator programme"],
 elig:["StartupTN-registered, DPIIT-recognised startups with a prototype or traction","About 3% support stake to StartupTN"],
 docs:["dpiit","inc","deck","cap","dom"],
 steps:["Register on StartupTN","Apply when the next TANSEED edition opens","Pitch rounds, then onboarding to the accelerator"],
 link:"https://startuptn.in",
 stacks:["tn-policy","ssp"], verified:"Verified Sep 2026"
},
{
 id:"tn-policy", st:"TN", name:"Tamil Nadu Startup & Innovation Policy (StartupTN)", abbr:"StartupTN", body:"MSME Dept, Govt of Tamil Nadu",
 type:["incubation","equity","support"], stage:["idea","early","growth"], sector:["all"], amt:"Seed, investor matching, regional hubs", amtL:0,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2023-01",
 sum:"StartupTN is the state's nodal agency: TANSEED seed support, TANFUND investor-matching platform, regional startup hubs across districts, and pitch events. Tamil Nadu was a Top Performer in the 2026 state startup rankings.",
 ben:["TANFUND platform connecting startups with investors","Regional hubs and incubators outside Chennai","Events, mentoring and market access"],
 elig:["Startups registered in Tamil Nadu"],
 docs:["inc","dom","deck"],
 steps:["Register your startup on the StartupTN portal","Apply to programmes as they open"],
 link:"https://startuptn.in",
 stacks:["tn-tanseed","tn-ivp"], verified:"Ranking verified Jan 2026"
},
{
 id:"tn-ivp", st:"TN", name:"Innovation Voucher Programme (EDII-TN)", abbr:"IVP", body:"EDII-Tamil Nadu, MSME Dept",
 type:["grant"], stage:["idea","early"], sector:["all","manufacturing"], amt:"₹3 L (Voucher A) · ₹7 L (Voucher B)", amtL:7,
 student:false, dpiit:false, status:"closed", statusNote:"Last round closed 10 Dec 2025; runs in periodic rounds", ease:2, tier:"more", since:"2025-12",
 sum:"Vouchers that pay for R&D collaboration with knowledge institutions (Voucher A) and for taking a product to market (Voucher B).",
 ben:["Voucher A: ₹3 lakh for research collaboration","Voucher B: ₹7 lakh for market entry"],
 elig:["Tamil Nadu startups and MSMEs at idea or product stage"],
 docs:["inc","prop","udyam"],
 steps:["Apply on the EDII-TN portal when the next round opens"],
 link:"https://startuptn.in",
 stacks:["tn-tanseed"], verified:"Verified Sep 2026 (closed)"
},
// ---------- TELANGANA ----------
{
 id:"tg-policy", st:"TG", name:"Telangana Startup Incentives (Innovation Policy)", abbr:"TG Incentives", body:"ITE&C Dept, Govt of Telangana",
 type:["subsidy","tax","ipr"], stage:["early","growth"], sector:["all","tech"], amt:"SGST refunds, patent costs, hiring support", amtL:10,
 student:false, dpiit:false, status:"open", ease:2, tier:"major", since:"2016-01",
 sum:"Reimbursements for Telangana startups: state GST refunds, patent costs, international marketing and hiring local staff, plus a performance grant for fast-growing startups.",
 ben:["100% SGST reimbursement for 3 years (on turnover up to ₹1 crore a year)","Patent costs: up to ₹2 lakh (Indian) and ₹10 lakh (foreign)","30% of international trade-show costs, up to ₹5 lakh","₹10,000 per Telangana-domiciled employee hired in the first year","Performance grant: 5% of turnover (up to ₹10 lakh) for 15% year-on-year growth"],
 elig:["Startups registered in Telangana, usually within 3–5 years of incorporation","Some incentives need endorsement from a state-supported incubator"],
 docs:["inc","dom","fees","fin","pan"],
 steps:["Register on the Startup Telangana portal","File reimbursement claims with receipts"],
 link:"https://startup.telangana.gov.in/funding-incentives/",
 stacks:["tg-hubs","sipp"], verified:"Per Startup Telangana incentives page; check current validity of each G.O."
},
{
 id:"tg-hubs", st:"TG", name:"T-Hub, T-Works & T-Fund", abbr:"T-Hub", body:"Govt of Telangana",
 type:["incubation","equity","infrastructure"], stage:["idea","early","growth"], sector:["all","manufacturing","tech"], amt:"Incubation, prototyping labs, early equity", amtL:0,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2015-11",
 sum:"T-Hub is one of India's largest startup incubators; T-Works is a large public hardware prototyping centre; T-Fund makes early-stage equity investments; T-Spark gives grants and go-to-market support to early startups.",
 ben:["Incubation and corporate innovation programmes (T-Hub)","Low-cost access to machines for hardware prototyping (T-Works)","Early-stage equity (T-Fund) and grants via T-Spark"],
 elig:["Varies by programme; T-Works is open to students and makers"],
 docs:["deck","inc"],
 steps:["Apply to T-Hub programmes or book T-Works facilities online"],
 link:"https://startup.telangana.gov.in",
 stacks:["tg-policy","tg-tsic"], verified:"Standing institutions"
},
{
 id:"tg-tsic", st:"TG", name:"Telangana Innovation Cell student & grassroots programmes", abbr:"TGIC", body:"Telangana Innovation Cell",
 type:["challenge","grant"], stage:["idea"], sector:["all","agri"], amt:"Recognition, seed & prototype support", amtL:0,
 student:true, dpiit:false, status:"calls", ease:1, tier:"more", since:"2017-01",
 sum:"The School Innovation Challenge (with UNICEF) for school students, Intinta Innovator for grassroots innovators, and TSIRI grants for rural-impact innovation.",
 ben:["School and grassroots innovation challenges","Seed, prototype and pilot support for rural-impact innovators (TSIRI)"],
 elig:["School students, grassroots innovators and early rural-impact startups in Telangana"],
 docs:["student","prop"],
 steps:["Register for the current challenge on the TGIC site"],
 link:"https://teamtsic.telangana.gov.in/",
 stacks:["tg-hubs"], verified:"Standing programmes"
},
// ---------- ANDHRA PRADESH ----------
{
 id:"ap-policy", st:"AP", name:"AP Innovation & Startup Policy 4.0 (2024-29)", abbr:"AP Policy 4.0", body:"ITE&C Dept, Govt of Andhra Pradesh",
 type:["grant","equity","ipr"], stage:["idea","early","growth"], sector:["all","deeptech"], amt:"₹2 L prototype · ₹15–20 L scale-up · up to ₹2 cr seed", amtL:200,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2025-03",
 sum:"Aims for 20,000 startups and 10 unicorns by 2029 through the Ratan Tata Innovation Hub network, 10 centres of excellence and staged grants from student prototypes to seed investment.",
 ben:["Prototype grant up to ₹2 lakh (open to students)","Scale-up grant up to ₹15 lakh (₹20 lakh for women-led)","RTIH incubation support up to ₹30 lakh","RTIH–SIDBI seed fund (₹22 crore; up to ₹2 crore per startup) and a ₹20 crore deep-tech seed fund","50% of international patent costs, up to ₹10 lakh"],
 elig:["Startups and student innovators based in Andhra Pradesh"],
 docs:["inc","dom","deck","prop","kyc"],
 steps:["Register on the AP innovation portal","Apply for the relevant grant; pitch to the technical committee"],
 link:"https://rtih.co.in/",
 stacks:["ap-rtih","sipp"], verified:"Amounts per policy summaries (2025); verify on the portal"
},
{
 id:"ap-rtih", st:"AP", name:"Ratan Tata Innovation Hub", abbr:"RTIH", body:"Govt of Andhra Pradesh",
 type:["incubation"], stage:["idea","early"], sector:["all"], amt:"Free plug-and-play space + programmes", amtL:0,
 student:true, dpiit:false, status:"open", ease:2, tier:"more", since:"2025-01",
 sum:"A hub-and-spoke innovation network with its main hub in Amaravati and five regional centres, offering workspace, mentoring and access to AP's startup grants.",
 ben:["Free plug-and-play office space","Mentors, investor connects and policy grants"],
 elig:["AP-based startups and innovators"],
 docs:["deck"],
 steps:["Apply on the RTIH website"],
 link:"https://rtih.co.in/",
 stacks:["ap-policy"], verified:"Verified Sep 2026"
},
// ---------- MAHARASHTRA ----------
{
 id:"mh-policy", st:"MH", name:"Maharashtra Startup, Entrepreneurship & Innovation Policy 2025", abbr:"MH Policy 2025", body:"Maharashtra State Innovation Society (MSInS)",
 type:["grant","ipr","procurement","incubation"], stage:["idea","early","growth"], sector:["all"], amt:"₹500 cr Maha-Fund; ₹25 L pilot orders", amtL:25,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2025-08",
 sum:"Approved 6 August 2025 to create 1.25 lakh entrepreneurs and 50,000 startups in five years. Every state department must set aside 0.5% of its budget for innovation, and startups get help with patents, certifications and exhibitions.",
 ben:["Maha-Fund (₹500 crore) for 25,000 early-stage entrepreneurs","Startup Week: pilot work orders up to ₹25 lakh with state departments","Reimbursement for patents, quality certification and exhibitions","Micro-incubators in ITIs and polytechnics; regional hubs; a 300-acre Innovation City"],
 elig:["Startups and entrepreneurs based in Maharashtra"],
 docs:["inc","dom","deck","fees"],
 steps:["Register on the MSInS portal","Apply to the relevant programme or claim reimbursements"],
 link:"https://msins.in",
 stacks:["mh-week","mh-mahafund"], verified:"Verified Sep 2026 (policy approval coverage)"
},
{
 id:"mh-week", st:"MH", name:"Maharashtra Startup Week", abbr:"MH Startup Week", body:"MSInS",
 type:["procurement","challenge"], stage:["early","growth"], sector:["all","tech"], amt:"Work orders up to ₹25 lakh", amtL:25,
 student:false, dpiit:false, status:"calls", ease:3, tier:"top", since:"2025-08",
 sum:"Startups pitch solutions to state departments; winners get a pilot work order worth up to ₹25 lakh — often a startup's first government customer.",
 ben:["Pilot work order up to ₹25 lakh with a state department"],
 elig:["Startups with a working product relevant to governance"],
 docs:["inc","deck","proto"],
 steps:["Apply on the MSInS portal when the edition opens","Pitch to the jury of department heads"],
 link:"https://msins.in",
 stacks:["mh-policy","procure"], verified:"Verified Sep 2026"
},
{
 id:"mh-mahafund", st:"MH", name:"Maha-Fund for early entrepreneurs", abbr:"Maha-Fund", body:"Govt of Maharashtra",
 type:["grant","incubation"], stage:["idea"], sector:["all"], amt:"₹500 cr corpus", amtL:0,
 student:true, dpiit:false, status:"open", ease:2, tier:"more", since:"2025-08",
 sum:"Selects 25,000 early-stage entrepreneurs from a pool of 5 lakh youth in three stages, then supports them with mentoring, incubation and funding.",
 ben:["Mentoring, incubation and early funding for selected entrepreneurs"],
 elig:["Youth and early entrepreneurs in Maharashtra"],
 docs:["kyc","prop"],
 steps:["Apply through MSInS channels when selection rounds open"],
 link:"https://msins.in",
 stacks:["mh-policy"], verified:"Verified Sep 2026"
},
// ---------- GUJARAT ----------
{
 id:"gj-startup", st:"GJ", name:"Gujarat Scheme for Assistance to Startups & Innovation", abbr:"Startup Gujarat", body:"Industries Commissionerate, Govt of Gujarat (via nodal institutes)",
 type:["grant","fellowship"], stage:["idea","early"], sector:["all"], amt:"Up to ₹30 L seed + ₹20–25k/month", amtL:30,
 student:true, dpiit:false, status:"calls", ease:2, tier:"top", since:"2020-08",
 sum:"Gujarat — ranked the best state for startups for the fifth time running — funds startups through approved nodal institutes such as GUSEC and iHub: seed grants for prototypes and patents, a monthly allowance for founders, and marketing support.",
 ben:["Seed grant up to ₹30 lakh","Sustenance allowance ₹20,000/month for a year (₹25,000 for women founders)","Marketing support up to ₹10 lakh"],
 elig:["Startups registered in Gujarat, incubated at an approved nodal institute"],
 docs:["inc","dom","deck","incub","prop"],
 steps:["Join an approved nodal institute (e.g., GUSEC, iHub Gujarat)","Apply through the institute when applications open"],
 link:"https://gusec.edu.in/startup-gujarat-scheme/",
 stacks:["gj-ssip","sipp"], verified:"Amounts per nodal-institute page (2026)"
},
{
 id:"gj-ssip", st:"GJ", name:"Student Startup & Innovation Policy (SSIP 2.0)", abbr:"SSIP 2.0", body:"Education Dept, Govt of Gujarat",
 type:["grant","ipr"], stage:["idea"], sector:["all"], amt:"Up to ₹2.5 L per prototype + IPR costs", amtL:2.5,
 student:true, dpiit:false, status:"calls", ease:1, tier:"top", since:"2022-01",
 sum:"Funds students from school to university: prototype grants through their institutions and up to 100% of IP filing costs.",
 ben:["Up to ₹2.5 lakh per PoC/prototype (higher education); ₹20,000 for Classes 9–12","IPR support: up to ₹75,000 (domestic patent), ₹1.5 lakh (international patent), plus trademark, copyright and design costs"],
 elig:["Students and recent graduates of Gujarat institutions"],
 docs:["student","prop"],
 steps:["Contact your institute's SSIP coordinator","Submit the proposal on the SSIP portal"],
 link:"https://www.ssipgujarat.in/",
 stacks:["gj-startup","prayas"], verified:"Verified Sep 2026 (currently between rounds)"
},
// ---------- RAJASTHAN ----------
{
 id:"rj-istart", st:"RJ", name:"iStart Rajasthan", abbr:"iStart", body:"Dept of IT & Communication, Govt of Rajasthan",
 type:["grant","fellowship","equity"], stage:["idea","early","growth"], sector:["all"], amt:"Seed up to ₹10 L; ₹10–25k/month allowance", amtL:10,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2017-01",
 sum:"Rajasthan's startup platform: a QRate rating unlocks sustenance allowances, idea and seed grants, marketing support and investment from the ₹500 crore Bhamashah Startup Promotion Fund.",
 ben:["Sustenance allowance ₹25,000/month (urban) or ₹10,000/month (rural)","Idea-stage funding up to ₹2.5 lakh; seed funding up to ₹10 lakh","Marketing grants up to ₹10 lakh","Equity via the Bhamashah Startup Promotion Fund"],
 elig:["Rajasthan-based startups up to 7 years old (10 for biotech), turnover up to ₹25 crore","A valid QRate rating for funding above ₹5 lakh"],
 docs:["inc","dom","deck","kyc"],
 steps:["Create a Rajasthan SSO ID and register on iStart","Get a QRate rating","Apply for the relevant incentive"],
 link:"https://istart.rajasthan.gov.in",
 stacks:["sipp","ssp"], verified:"Amounts per secondary sources; confirm on iStart"
},
// ---------- UTTAR PRADESH ----------
{
 id:"up-policy", st:"UP", name:"UP Startup Policy 2020 (amended 2022)", abbr:"UP Policy", body:"Dept of IT & Electronics, Govt of UP (StartinUP)",
 type:["grant","fellowship","ipr"], stage:["idea","early"], sector:["all"], amt:"₹17,500/month + ₹5 L prototype + ₹7.5 L seed", amtL:12.5,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2022-01",
 sum:"Incubator-routed support for Uttar Pradesh startups, with 50% extra for women, transgender and differently-abled co-founders and for startups in Purvanchal and Bundelkhand.",
 ben:["Sustenance allowance ₹17,500/month for a year","Prototype grant up to ₹5 lakh","Seed capital / marketing assistance up to ₹7.5 lakh","Patent reimbursement: ₹2 lakh (Indian), ₹10 lakh (international)","Event participation support"],
 elig:["UP-based startups incubated at a state-supported incubator"],
 docs:["inc","dom","incub","deck"],
 steps:["Register on the StartinUP portal","Apply through your incubator"],
 link:"https://startinup.up.gov.in",
 stacks:["sipp","prayas"], verified:"Per 2022 amendment; policy valid 5 years from notification — check for a successor"
},
// ---------- MADHYA PRADESH ----------
{
 id:"mp-policy", st:"MP", name:"MP Startup Policy & Implementation Scheme 2025", abbr:"MP Policy 2025", body:"MSME Dept, Govt of Madhya Pradesh",
 type:["grant","equity"], stage:["early","growth"], sector:["all"], amt:"Seed up to ₹30 L; 15% of funds raised (up to ₹60 L)", amtL:60,
 student:false, dpiit:true, status:"open", ease:2, tier:"major", since:"2025-03",
 sum:"A 2025 policy with a ₹100 crore Startup Capital Fund, seed support through empanelled incubators, and a cash top-up whenever a startup raises money from banks or investors.",
 ben:["Seed assistance up to ₹30 lakh via empanelled incubators","15% of funds raised, up to ₹15 lakh each time, four times (₹60 lakh total)","₹100 crore Startup Capital Fund, up to ₹50 crore routed through AIFs"],
 elig:["DPIIT-recognised startups based in Madhya Pradesh"],
 docs:["dpiit","inc","dom","cap","bank"],
 steps:["Register on the MP startup portal","Claim investment-linked assistance after each funding round"],
 link:"https://invest.mp.gov.in/policy-notifications-sp-implementation-scheme/",
 stacks:["fof2","cgss"], verified:"Verified Sep 2026 (policy summaries, Mar 2025)"
},
// ---------- BIHAR ----------
{
 id:"br-policy", st:"BR", name:"Bihar Startup Policy 2022", abbr:"Bihar Policy", body:"Dept of Industries, Govt of Bihar",
 type:["loan","grant"], stage:["idea","early"], sector:["all"], amt:"₹10 L interest-free for 10 years + ₹3 L matching", amtL:13,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2022-01",
 sum:"Bihar's seed fund gives up to ₹10 lakh as an interest-free loan repayable over 10 years, plus matching grants when you raise angel or VC money, free co-working space and acceleration support.",
 ben:["Seed fund up to ₹10 lakh, interest-free for 10 years","Matching grant up to ₹3 lakh after raising angel/VC funds","Free co-working space at state incubators; acceleration programme support"],
 elig:["Pvt Ltd, LLP or partnership registered in Bihar, up to 10 years old","Turnover under ₹100 crore; innovative product or process"],
 docs:["inc","dom","deck","kyc"],
 steps:["Register on the Startup Bihar portal","Pitch to the expert panel","Disbursement after approval"],
 link:"https://startup.bihar.gov.in",
 stacks:["sipp","cgss"], verified:"Per secondary sources (2026)"
},
// ---------- ODISHA ----------
{
 id:"od-policy", st:"OD", name:"Startup Odisha Incentives", abbr:"Startup Odisha", body:"MSME Dept, Govt of Odisha",
 type:["fellowship","grant"], stage:["idea","early"], sector:["all"], amt:"₹20k/month + up to ₹15 L product & marketing", amtL:15,
 student:false, dpiit:false, status:"open", ease:2, tier:"major", since:"2016-08",
 sum:"Recognised Odisha startups get a monthly allowance, funds for product development and marketing, need-based assistance for materials, and subsidised space at state incubators such as O-Hub.",
 ben:["Monthly allowance ₹20,000 (₹22,000 for women and disadvantaged founders) for up to a year","Product development & marketing assistance up to ₹15 lakh (₹16 lakh for reserved categories)","Patent cost reimbursement; state procurement preference"],
 elig:["Startups recognised by Startup Odisha"],
 docs:["inc","dom","deck","prop"],
 steps:["Register and get recognised on the Startup Odisha portal","Apply for each incentive with a development plan"],
 link:"https://startupodisha.gov.in",
 stacks:["sipp","ssp"], verified:"Per Startup Odisha guidance (2026)"
},
// ---------- WEST BENGAL ----------
{
 id:"wb-policy", st:"WB", name:"Startup Bengal & new state startup policy", abbr:"Startup Bengal", body:"Govt of West Bengal",
 type:["grant","equity"], stage:["idea","early"], sector:["all","deeptech"], amt:"₹40 cr incubation fund · ₹60 cr VC fund (announced)", amtL:0,
 student:true, dpiit:false, status:"announced", statusNote:"New policy announced in Budget 2026-27", ease:2, tier:"more", since:"2026-02",
 sum:"The existing Startup Bengal framework offers kick-starter funds and venture-capital access. The 2026-27 state budget announced a new startup policy with a ₹40 crore incubation fund and a ₹60 crore VC fund.",
 ben:["Existing: kick-starter funds, patent reimbursement, priority access to the WB MSME VC fund","Announced: ₹40 crore incubation fund (ideation to early stage) and ₹60 crore VC fund"],
 elig:["Startups registered with the state"],
 docs:["inc","dom","deck"],
 steps:["Register on the Startup Bengal portal","Watch for the new policy notification"],
 link:"https://www.startupbengal.in",
 stacks:["sipp"], verified:"Budget announcement verified; policy notification awaited"
},
// ---------- DELHI ----------
{
 id:"dl-policy", st:"DL", name:"Delhi Start-up Policy 2026", abbr:"Delhi Policy", body:"Education Dept, Govt of NCT of Delhi",
 type:["grant","incubation"], stage:["idea","early"], sector:["all"], amt:"₹400 cr over 5 years", amtL:10,
 student:true, dpiit:false, status:"announced", statusNote:"Approved by Cabinet 16 Jul 2026; detailed amounts awaited", ease:2, tier:"major", since:"2026-07",
 sum:"Approved on 16 July 2026, Delhi's policy runs through its universities, colleges, polytechnics, ITIs and schools. Startups get milestone-based help from proof of concept to commercialisation, and institutions get money to build incubators. It aims to support 10,000 startups.",
 ben:["Milestone support for proof of concept, prototype, product, market validation and commercialisation","Incubation centres at state universities, colleges, polytechnics and ITIs","The earlier draft suggested grants up to ₹10 lakh — final amounts yet to be published"],
 elig:["Students and founders connected to Delhi government institutions"],
 docs:["student","prop","kyc"],
 steps:["Ask your institution's incubation centre about the rollout","Watch the Delhi government site for guidelines"],
 link:"https://www.delhi.gov.in",
 stacks:["iic","prayas"], verified:"Verified Sep 2026 (Medianama, Sep 2026)"
},
// ---------- PUNJAB ----------
{
 id:"pb-policy", st:"PB", name:"Punjab Startup & Industrial Policy 2026", abbr:"Punjab Policy", body:"Dept of Industries & Commerce, Govt of Punjab",
 type:["grant"], stage:["idea","early"], sector:["all"], amt:"Seed grant ₹5 lakh", amtL:5,
 student:false, dpiit:false, status:"open", ease:2, tier:"major", since:"2026-06",
 sum:"Punjab raised its startup seed grant from ₹3 lakh to ₹5 lakh under the 2026 policy (announced 9 June 2026); 31 startups received ₹1.07 crore in the latest round.",
 ben:["Seed grant up to ₹5 lakh","Other incentives for incubation and scale-up under the policy"],
 elig:["Startups registered in Punjab"],
 docs:["inc","dom","deck"],
 steps:["Register with Startup Punjab","Apply for the seed grant when rounds open"],
 link:"https://investpunjab.gov.in",
 stacks:["sipp"], verified:"Verified Sep 2026 (Jun 2026 coverage)"
},
// ---------- HARYANA ----------
{
 id:"hr-policy", st:"HR", name:"Haryana State Startup Policy 2022", abbr:"Haryana Policy", body:"Dept of IT, Electronics & Communication, Govt of Haryana",
 type:["grant","subsidy","ipr","tax"], stage:["idea","early","growth"], sector:["all"], amt:"Seed ₹10 L · patents up to ₹25 L", amtL:25,
 student:false, dpiit:false, status:"open", ease:2, tier:"major", since:"2022-01",
 sum:"Seed grants graded by district category, generous patent reimbursement, lease and cloud subsidies, and SGST refunds for Haryana startups.",
 ben:["Seed grant up to ₹10 lakh","100% patent costs reimbursed, up to ₹25 lakh","Lease rental subsidy up to ₹5 lakh","75% of cloud costs up to ₹2.5 lakh a year for 5 years","50% net SGST reimbursement for 7 years","Acceleration programmes: up to ₹2.5 lakh (national), ₹5 lakh (international)"],
 elig:["Startups registered in Haryana"],
 docs:["inc","dom","deck","fees"],
 steps:["Register on the Startup Haryana portal","Apply for each incentive with supporting bills"],
 link:"https://startupharyana.gov.in",
 stacks:["sipp","indiaai"], verified:"Per policy coverage (2022); still listed on the state portal"
},
// ---------- HIMACHAL ----------
{
 id:"hp-scheme", st:"HP", name:"Himachal CM Startup / Innovation Projects Scheme", abbr:"Startup Himachal", body:"Dept of Industries, Govt of Himachal Pradesh",
 type:["fellowship","incubation"], stage:["idea"], sector:["all","agri"], amt:"₹25,000 a month for a year", amtL:3,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2016-01",
 sum:"Any individual or group with an innovative idea gets ₹25,000 a month for a year plus free incubation, mentoring and lab access at approved incubators. Himachal was a Top Performer in the 2026 rankings.",
 ben:["Sustenance allowance ₹25,000/month for one year","Free incubation, mentoring and labs"],
 elig:["Any individual or group with an innovative idea (Himachal focus sectors include agri, food processing, tourism, IT, biotech)"],
 docs:["kyc","prop","dom"],
 steps:["Register on the Startup Himachal portal","Get selected by an approved incubator"],
 link:"https://emerginghimachal.hp.gov.in/startup/",
 stacks:["prayas","eir"], verified:"Verified Sep 2026"
},
// ---------- UTTARAKHAND ----------
{
 id:"uk-policy", st:"UK", name:"Uttarakhand Startup Policy 2023", abbr:"Uttarakhand Policy", body:"Dept of Industries, Govt of Uttarakhand",
 type:["fellowship","grant","tax"], stage:["idea","early"], sector:["all"], amt:"₹20k/month + ₹5 L product & marketing", amtL:7.5,
 student:false, dpiit:false, status:"open", ease:2, tier:"major", since:"2023-01",
 sum:"Monthly allowances, product and marketing support and tax refunds for recognised Uttarakhand startups, with higher amounts for focus sectors, women and SC/ST founders and remote districts.",
 ben:["Sustenance allowance ₹20,000/month for a year (higher for priority categories)","Product development & marketing up to ₹5 lakh (₹7.5 lakh for priority categories)","Need-based assistance up to ₹5 lakh","SGST reimbursement up to ₹5 lakh a year for 3 years; stamp-duty refunds"],
 elig:["Uttarakhand startups with equity funding, a government grant, or monthly revenue in the prescribed range"],
 docs:["inc","dom","deck","fin"],
 steps:["Register on the Startup Uttarakhand portal","Apply for recognition and incentives"],
 link:"https://startuputtarakhand.uk.gov.in",
 stacks:["sipp"], verified:"Per policy summaries"
},
// ---------- J&K ----------
{
 id:"jk-policy", st:"JK", name:"J&K Start-up Policy 2024-27", abbr:"J&K Policy", body:"J&K Entrepreneurship Development Institute (JKEDI)",
 type:["grant","equity"], stage:["idea","early"], sector:["all"], amt:"Seed grants up to ₹20 L · ₹250 cr VC fund", amtL:20,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2024-03",
 sum:"Aims for 2,000 new startups by 2027 with seed grants, a ₹250 crore venture fund and extra support for women and differently-abled founders.",
 ben:["Seed grants up to ₹20 lakh","₹250 crore venture capital fund","Incubation through campus and state incubators"],
 elig:["Startups registered in Jammu & Kashmir"],
 docs:["inc","dom","deck"],
 steps:["Register with JKEDI / the J&K startup portal","Apply to the seed programme"],
 link:"https://jkindustriescommerce.nic.in",
 stacks:["sipp"], verified:"Per policy coverage"
},
// ---------- LADAKH ----------
{
 id:"la-policy", st:"LA", name:"Ladakh Startup Incentives", abbr:"Ladakh", body:"UT Administration of Ladakh",
 type:["fellowship","grant","ipr"], stage:["idea","early"], sector:["all","climate"], amt:"₹15k/month + ₹3 L MVP + ₹3 L marketing", amtL:6,
 student:false, dpiit:true, status:"open", ease:2, tier:"more", since:"2022-07",
 sum:"Stipends and grants for DPIIT-recognised Ladakh startups, with incubators in Leh and Kargil and full subsidies for green-energy solutions.",
 ben:["Stipend ₹15,000/month for a year (₹20,000 for women and marginalised founders)","MVP support up to ₹3 lakh; marketing up to ₹3 lakh","Free workspace up to ₹1 lakh a year; 50% patent costs up to ₹5 lakh"],
 elig:["DPIIT-recognised startups in Ladakh"],
 docs:["dpiit","inc","dom"],
 steps:["Apply through the Ladakh industries department"],
 link:"https://ladakh.gov.in",
 stacks:["sipp"], verified:"Per 2022 coverage"
},
// ---------- CHANDIGARH ----------
{
 id:"ch-policy", st:"CH", name:"Chandigarh Startup Policy 2025", abbr:"Chandigarh", body:"UT Administration, Chandigarh",
 type:["grant","challenge"], stage:["idea","early"], sector:["all"], amt:"₹7 L seed · ₹12 L early-growth", amtL:12,
 student:true, dpiit:false, status:"announced", statusNote:"Cleared by the department (Mar 2025); confirm notification", ease:2, tier:"more", since:"2025-03",
 sum:"A ₹50 crore, five-year policy with a startup competition, seed and early-growth grants and small reimbursements, run largely through campus incubators.",
 ben:["Competition: ₹2 lakh for top 20, ₹1 lakh for next 50","Seed grant up to ₹7 lakh (₹9 lakh women/transgender-led); early-growth up to ₹12 lakh","Rent support ₹5,000/month; certification, patent and conference reimbursements"],
 elig:["Startups in Chandigarh"],
 docs:["inc","dom","deck"],
 steps:["Watch the UT administration site for the call"],
 link:"https://chandigarh.gov.in",
 stacks:["sipp"], verified:"Per Mar 2025 coverage; status to confirm"
},
// ---------- ASSAM ----------
{
 id:"as-policy", st:"AS", name:"Assam Start-up & Innovation Policy 2025", abbr:"Assam Policy 2025", body:"Industries, Commerce & PE Dept, Govt of Assam",
 type:["grant","fellowship","tax","ipr"], stage:["idea","early","growth"], sector:["all"], amt:"₹10 L idea → ₹25 L pilot → ₹50 L scale-up", amtL:50,
 student:false, dpiit:false, status:"open", ease:2, tier:"major", since:"2025-01",
 sum:"Replaces the 2017 policy with staged grants, a monthly allowance and reimbursements, targeting 5,000 startups and 1 lakh jobs in five years.",
 ben:["Idea2PoC grant up to ₹10 lakh; piloting (MVP) grant up to ₹25 lakh; scale-up grant up to ₹50 lakh","Sustenance allowance ₹20,000/month (+₹5,000 for women/SC/ST/Divyang-led)","GST reimbursement up to ₹5 lakh/year for 3 years; 50% lease rental up to ₹5 lakh","Patents: ₹1 lakh (domestic), ₹5 lakh (international); 50% marketing costs up to ₹2 lakh"],
 elig:["Startups registered in Assam"],
 docs:["inc","dom","deck","prop"],
 steps:["Register on the Assam Udyog Setu / RAMP portal","Apply for each grant stage"],
 link:"https://assamramp.com/ramp/innovationpolicy",
 stacks:["sipp"], verified:"Verified Sep 2026 (policy page)"
},
// ---------- GOA ----------
{
 id:"ga-policy", st:"GA", name:"Goa Startup Policy 2025", abbr:"Goa Policy", body:"Dept of IT, E&C, Govt of Goa",
 type:["grant","subsidy","ipr"], stage:["idea","early"], sector:["all","tech"], amt:"Seed up to ₹10 L + cost reimbursements", amtL:10,
 student:true, dpiit:false, status:"open", ease:2, tier:"major", since:"2025-09",
 sum:"Rolled out in late September 2025 (target: 1,000 startups and 10,000 jobs by 2028). Adds a Campus Innovation Scheme for students and skill reimbursements to Goa's established incentives. Goa was a Best Performer in the 2026 rankings.",
 ben:["Campus Innovation Scheme grants for student projects","Seed capital up to ₹10 lakh (under the 2021 policy framework)","Lease rental, co-working seat, internet/cloud and salary reimbursements","IPR: up to ₹2 lakh (national), ₹5 lakh (international)"],
 elig:["Startups registered with StartUp Goa; students for the campus scheme"],
 docs:["inc","dom","deck","fees"],
 steps:["Register on the StartUp Goa portal","Apply for each incentive online"],
 link:"https://www.startup.goa.gov.in",
 stacks:["sipp"], verified:"2025 launch verified; some amounts from the 2021 incentive list"
},
// ---------- JHARKHAND ----------
{
 id:"jh-policy", st:"JH", name:"Jharkhand Startup Policy 2023", abbr:"Jharkhand Policy", body:"Govt of Jharkhand (Startup Jharkhand)",
 type:["fellowship","grant"], stage:["idea","early"], sector:["all"], amt:"₹5,000/month per founder (up to 3)", amtL:1.8,
 student:false, dpiit:false, status:"open", ease:1, tier:"more", since:"2023-01",
 sum:"Sustenance allowance for founders plus seed, marketing and incubation support under the 2023 policy.",
 ben:["₹5,000/month per founder for up to 3 founders for 12 months","Other seed, marketing and incubation incentives per the policy"],
 elig:["Jharkhand-registered startups under 5 years old, turnover under ₹25 crore, with full-time founders"],
 docs:["inc","dom","kyc"],
 steps:["Apply on the Startup Jharkhand portal (rolling)"],
 link:"https://abvil.jharkhand.gov.in",
 stacks:["sipp"], verified:"Per secondary source (2026)"
},
// ---------- CHHATTISGARH ----------
{
 id:"cg-policy", st:"CG", name:"Chhattisgarh Innovation & Startup Promotion Policy 2025-30", abbr:"CG Policy", body:"Dept of Commerce & Industry, Govt of Chhattisgarh",
 type:["grant","loan","equity"], stage:["idea","early","growth"], sector:["all","agri"], amt:"₹100 cr capital fund; seed, interest subsidy, risk-free loans", amtL:0,
 student:true, dpiit:false, status:"open", ease:2, tier:"more", since:"2025-01",
 sum:"The 2025-30 policy offers seed funds, interest subsidies and risk-free loans across the startup lifecycle, with a ₹100 crore capital fund; idea-stage students are covered by a companion student startup policy.",
 ben:["Seed funding, interest subsidy and risk-free loans","₹100 crore capital fund","District boot camps across all 27 districts"],
 elig:["Startups registered in Chhattisgarh"],
 docs:["inc","dom","deck"],
 steps:["Register on the Startup Chhattisgarh portal","Apply as calls open (helpline 1800 233 3943)"],
 link:"https://invest.cg.gov.in/startup",
 stacks:["sipp"], verified:"Policy verified; exact amounts in the policy PDF"
},
// ---------- NORTH-EAST ----------
{
 id:"ml-prime", st:"ML", name:"PRIME Meghalaya Funding", abbr:"PRIME", body:"Govt of Meghalaya",
 type:["grant","loan"], stage:["idea","early","growth"], sector:["all","agri"], amt:"Grants to ₹35 L · 0% loans to ₹75 L", amtL:75,
 student:false, dpiit:false, status:"calls", ease:2, tier:"major", since:"2019-01",
 sum:"Promotion and Incubation of Market-driven Enterprises: grants for early ideas and high-impact innovations, and interest-free loans for startups with traction.",
 ben:["Kick Start Grant up to ₹10 lakh","InnoVenture Grant up to ₹35 lakh for high-impact innovations","Scale-up Innovation Loan up to ₹75 lakh at zero interest","Small Support Grant up to ₹3 lakh for operating micro/small units"],
 elig:["Entrepreneurs from Meghalaya"],
 docs:["kyc","dom","prop","deck"],
 steps:["Apply on the PRIME website when windows open"],
 link:"https://www.primemeghalaya.com",
 stacks:["sipp"], verified:"Verified Sep 2026 (PRIME funding page)"
},
{
 id:"tr-policy", st:"TR", name:"Tripura Start-Up Policy 2024", abbr:"Tripura Policy", body:"Dept of IT, Govt of Tripura",
 type:["grant","fellowship","ipr","procurement"], stage:["idea","early"], sector:["all","agri"], amt:"₹2 L seed + ₹20k/month + ₹10 L prototype", amtL:17,
 student:false, dpiit:false, status:"open", ease:2, tier:"major", since:"2025-01",
 sum:"Launched 24 January 2025 with a ₹50 crore VC fund (managed by SIDBI Venture Capital) and a ₹25 crore infrastructure fund.",
 ben:["Seed ₹2 lakh; operational support ₹20,000/month for up to a year","Prototype assistance up to ₹10 lakh; marketing up to ₹5 lakh","Patents: ₹2 lakh (Indian), up to ₹10 lakh (foreign)","Up to 15% price preference in state tenders; extra support for women and differently-abled founders"],
 elig:["Startups registered in Tripura"],
 docs:["inc","dom","deck","prop"],
 steps:["Register on the Start-Up Tripura portal","Apply for each incentive"],
 link:"https://startup.tripura.gov.in/",
 stacks:["sipp"], verified:"Verified Sep 2026 (launch coverage)"
},
{
 id:"ar-policy", st:"AR", name:"Arunachal Pradesh State Startup Policy", abbr:"Arunachal Policy", body:"Dept of Planning, Investment & Finance, Govt of Arunachal Pradesh",
 type:["grant","ipr"], stage:["idea","early","growth"], sector:["all"], amt:"₹5 L support grant · PoC ₹10 L · scale-up to ₹25 L", amtL:25,
 student:false, dpiit:false, status:"calls", ease:2, tier:"major", since:"2022-01",
 sum:"An annual support-grant competition plus proof-of-concept, R&D, certification and scale-up support. Arunachal was a Best Performer in the 2026 rankings.",
 ben:["Support grant: ₹5 lakh (top 10) or ₹4 lakh (next 40) each year, with incubation","PoC support up to ₹10 lakh (state) where SISFS isn't used","R&D up to ₹5 lakh; quality certification up to ₹5 lakh","Scale-up reimbursement up to ₹25 lakh; digital upscaling up to ₹10 lakh"],
 elig:["Startups in Arunachal Pradesh"],
 docs:["inc","dom","deck","prop"],
 steps:["Register on the Arunachal startup portal","Apply to the annual support-grant call"],
 link:"https://www.startup.arunachal.gov.in/",
 stacks:["sipp"], verified:"Per 2022-23 policy coverage"
},
{
 id:"nl-policy", st:"NL", name:"Nagaland Startup Policy 2019", abbr:"Nagaland Policy", body:"Dept of Industries & Commerce, Govt of Nagaland",
 type:["subsidy","ipr","tax"], stage:["early","growth"], sector:["all"], amt:"Reimbursements up to ₹5–10 L each", amtL:10,
 student:false, dpiit:false, status:"open", ease:2, tier:"more", since:"2019-01",
 sum:"Reimbursement-led support for Nagaland startups covering GST, power, digital equipment, connectivity, patents and marketing.",
 ben:["SGST reimbursement up to ₹5 lakh/year for 3 years","50% power subsidy up to ₹10 lakh/year for 5 years","50% of digital hardware/software costs up to ₹5 lakh","Patents: ₹2 lakh (domestic), ₹5 lakh (international); 50% marketing up to ₹5 lakh"],
 elig:["Startups registered in Nagaland"],
 docs:["inc","dom","fees"],
 steps:["Register on Startup Nagaland","Submit reimbursement claims"],
 link:"https://www.startupnagaland.in",
 stacks:["sipp"], verified:"Per policy coverage"
},
{
 id:"mn-startup", st:"MN", name:"Start-Up Manipur", abbr:"Start-Up Manipur", body:"Govt of Manipur",
 type:["grant","subsidy"], stage:["idea","early"], sector:["all"], amt:"₹3 L idea · up to ₹30 L revenue stage", amtL:30,
 student:false, dpiit:false, status:"closed", statusNote:"Main scheme ran 2018–2021 (activities to 2023); check for a new round", ease:2, tier:"more", since:"2018-01",
 sum:"The CM's flagship startup scheme supported 10,296 entrepreneurs with ₹79 crore between 2017 and 2023, with idea-stage grants and larger subsidies for revenue-stage startups.",
 ben:["Idea stage: ₹3 lakh","Revenue/Stand-up stage: up to ₹30 lakh"],
 elig:["Manipur residents with a business idea or running startup"],
 docs:["kyc","dom","prop"],
 steps:["Check the Startup Manipur portal for new rounds"],
 link:"https://startupmanipur.in/",
 stacks:["mudra","pmegp"], verified:"Verified Sep 2026 (CM dashboard)"
},
{
 id:"mz-policy", st:"MZ", name:"Mizoram Startup Mission & Bana Kaih", abbr:"Mizoram", body:"Govt of Mizoram",
 type:["grant","loan"], stage:["idea","early"], sector:["all"], amt:"Grants, venture funding, credit linkage", amtL:0,
 student:false, dpiit:false, status:"open", ease:2, tier:"more", since:"2019-01",
 sum:"The Mizoram Entrepreneurship & Startup Policy (2019) and Startup Mission support incubation, while the Bana Kaih (Handholding) scheme offers grants, venture funding and credit linkage to selected 'Progress Partners'.",
 ben:["Handholding grants, loans and credit linkage under Bana Kaih","Incubation via the Mizoram Startup Mission"],
 elig:["Entrepreneurs in Mizoram"],
 docs:["kyc","dom","prop"],
 steps:["Register as a Progress Partner for Bana Kaih","Connect with the Mizoram Startup Mission"],
 link:"https://startupmizoram.com/",
 stacks:["mudra"], verified:"Bana Kaih active Sep 2026"
},
{
 id:"sk-sys", st:"SK", name:"Sikkim Skilled Youth Startup Scheme", abbr:"Sikkim SYSS", body:"Commerce & Industries Dept, Govt of Sikkim",
 type:["subsidy","loan"], stage:["idea"], sector:["all"], amt:"25–35% subsidy on projects up to ₹20 L", amtL:20,
 student:true, dpiit:false, status:"open", ease:2, tier:"more", since:"2016-01",
 sum:"Helps unemployed local youth start businesses with a capital subsidy on bank-financed projects.",
 ben:["25% subsidy (manufacturing/services); 35% for certain non-manufacturing projects","Projects up to ₹20 lakh"],
 elig:["Sikkim Subject certificate holders aged 15–40, unemployed, Class 5 pass; one per family"],
 docs:["kyc","dom","dpr","edu"],
 steps:["Apply at the District Industries Centre (Gangtok or Jorethang)"],
 link:"https://industries.sikkim.gov.in",
 stacks:["pmegp","mudra"], verified:"Active as of 2025"
},
// ---------- UTs ----------
{
 id:"py-policy", st:"PY", name:"Puducherry Startup Policy 2019", abbr:"Puducherry", body:"Industries & Commerce Dept, Puducherry",
 type:["grant","fellowship"], stage:["idea","early"], sector:["all"], amt:"₹3 L grant + ₹10k/month per person", amtL:3,
 student:false, dpiit:false, status:"open", ease:2, tier:"more", since:"2019-01",
 sum:"Incubator-recommended grants and monthly allowances for founders, backed by a ₹10 crore Puducherry Startup Fund for incubators.",
 ben:["Grant up to ₹3 lakh for incubator-recommended projects","₹10,000/month per person for up to 5 people (₹15,000 for women, SC/ST, PH, transgender founders)","Free ERP, cloud, lab and library access"],
 elig:["Startups incubated in Puducherry"],
 docs:["inc","incub","dom"],
 steps:["Get recommended by a Puducherry incubator","Apply to the Industries Department"],
 link:"https://industry.py.gov.in/startup-policy-2019",
 stacks:["sipp"], verified:"Per 2019 policy"
},
{
 id:"dh-ips", st:"DH", name:"DNH & DD Investment Promotion Scheme 2022-27 (startups)", abbr:"DNHDD IPS", body:"UT Administration of DNH & DD",
 type:["subsidy","ipr"], stage:["early","growth"], sector:["manufacturing","all"], amt:"15% capital subsidy up to ₹15–35 L", amtL:35,
 student:false, dpiit:false, status:"open", ease:2, tier:"more", since:"2022-05",
 sum:"The UT's industrial scheme (valid to 19 May 2027) gives extra interest subsidy to registered startups and young entrepreneurs, plus capital, certification and IP support.",
 ben:["15% capital subsidy: up to ₹15 lakh (micro), ₹30 lakh (small), ₹35 lakh (medium)","Extra 10% interest subsidy for startups and entrepreneurs under 35","75% of patent/trademark costs up to ₹25 lakh; 50% of quality certification up to ₹10 lakh"],
 elig:["Units in Dadra & Nagar Haveli and Daman & Diu"],
 docs:["udyam","inc","dpr","fees"],
 steps:["Apply to the District Industries Centre through the NSWS portal"],
 link:"https://ddd.gov.in",
 stacks:["cgtmse","sipp"], verified:"Verified Sep 2026 (States' Startup Ranking 5.0 report)"
},
{
 id:"an-policy", st:"AN", name:"Andaman & Nicobar Startup Scheme", abbr:"A&N", body:"A&N Administration",
 type:["support","challenge"], stage:["idea"], sector:["all"], amt:"Pro-bono services for pitch winners", amtL:0,
 student:false, dpiit:false, status:"open", ease:1, tier:"more", since:"2018-12",
 sum:"India's first UT startup policy (Dec 2018). Pitch competition winners get free help with incorporation, tax registrations and media services.",
 ben:["Free incorporation, GST/TAN/PAN and filing help for winners"],
 elig:["Founders in the Andaman & Nicobar Islands"],
 docs:["kyc","prop"],
 steps:["Take part in the UT's startup pitch events"],
 link:"https://as.and.nic.in/startupindia/",
 stacks:["mudra","pmegp"], verified:"Per Invest India summary"
}
];
