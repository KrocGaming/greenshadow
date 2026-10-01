/*
 * CONTENT MAP — single source of truth for the website.
 * Every fact below is taken from the supplied documents:
 *   [INC]   incorporation certificate.pdf        (MCA, 05-06-2020)
 *   [IEC]   IE certificate.pdf                   (DGFT)
 *   [FSSAI] fssai latest .pdf                    (Central Licence, 11-12-2025)
 *   [UDYAM] 11_UDYAM.pdf                         (MSME)
 *   [ICE]   ICE gate -Certificate.pdf            (CBIC)
 *   [RCMC]  apeda green.pdf                      (APEDA e-RCMC application)
 *   [AD]    AD code(authorised dealer).pdf       (SBI letter)
 *   [BRO]   gsw.pdf                              (company brochure)
 *   [DECK]  pitch deck .pdf                      (company pitch-deck outline)
 * Nothing here is invented; wording is polished, meaning is preserved.
 */

export const company = {
  name: 'Greenshadow Agri-Allied Private Limited',
  short: 'Greenshadow',
  tagline: 'The best premium quality products', // logo lock-up
  line: 'Spices, Nuts & Masalas', // [BRO] cover
  promise: 'From Kerala to global markets', // [DECK] slide 1
  business: ['Spices', 'Agricultural products', 'Processed & packaged food', 'Export-oriented operations'], // [DECK] s3
  incorporated: '2020-06-05', // [INC]
  cin: 'U01120KL2020PTC062269', // [INC]
  gstin: '32AAICG3236F1ZZ', // [BRO], [RCMC]
  iec: 'AAICG3236F', // [IEC]
  website: 'greenshadowagri.com', // [DECK]
  exporterCategory: 'Merchant cum Manufacturer Exporter', // [RCMC] basic details
}

export const contact = {
  addressLines: ['3/463-C, Kanchiyode, Anavoor P.O.', 'Thiruvananthapuram, Kerala 695124', 'India'], // [IEC] [FSSAI] [BRO]
  phone: '+91 62381 39578', // [BRO] customer care
  phoneHref: 'tel:+916238139578',
  email: 'sajingreenshadow@gmail.com', // [BRO]
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Kanjiyode%2C%20Anavoor%2C%20Thiruvananthapuram%2C%20Kerala%20695124',
  person: 'Sajin Kumar Y.',
  role: 'Managing Director',
}

export const founder = {
  name: 'Sajin Kumar Yesudas', // [RCMC] director details, [DECK] s10
  role: 'Founder, Promoter & Managing Director',
  experience: '15+ years in spices & agricultural products', // [DECK]
  strengths: [
    'Industry experience',
    'Farmer network',
    'Multilingual communication',
    'Sourcing relationships',
    'Product knowledge',
    'Export & business development',
  ], // [DECK] s10
}

// Real, quantifiable facts only.
export const stats = [
  { value: 15, suffix: '+', label: 'Years of promoter experience in the spice sector', src: 'DECK' },
  { value: 25, prefix: '≈', suffix: ' km', label: 'From the factory to Vizhinjam International Seaport', src: 'DECK' },
  { value: 2020, label: 'Year of incorporation under the Companies Act, 2013', src: 'INC', plain: true },
  { value: 17, label: 'Product lines in the current catalogue', src: 'BRO' },
]

export const milestones = [
  { date: '05 Jun 2020', year: '2020', title: 'Company incorporated', body: 'Greenshadow Agri-Allied Private Limited is incorporated under the Companies Act, 2013 by the Central Registration Centre, Ministry of Corporate Affairs.' },
  { date: '30 Jul 2020', year: '2020', title: 'Udyam (MSME) registration', body: 'Registered with the Ministry of MSME as a micro manufacturing enterprise — UDYAM-KL-12-0000330.' },
  { date: '17 Aug 2020', year: '2020', title: 'Importer-Exporter Code issued', body: 'The Directorate General of Foreign Trade, Kochi issues IEC AAICG3236F, opening the door to international trade.' },
  { date: '28 Apr 2025', year: '2025', title: 'Authorised Dealer code confirmed', body: 'State Bank of India confirms the AD code for export remittances through its Commercial Branch, Thiruvananthapuram.' },
  { date: '11 Dec 2025', year: '2025', title: 'FSSAI Central Licence', body: 'The Food Safety and Standards Authority of India grants a Central Licence covering wholesale, retail and merchant export.' },
  { date: '19 Dec 2025', year: '2025', title: 'APEDA membership application', body: 'Registration-cum-Membership (RCMC) application filed with APEDA Kochi for food-product exports.' },
  { date: '22 Jan 2026', year: '2026', title: 'ICEGATE registration', body: 'Registered on the Indian Customs national trade portal with the role of Importer / Exporter.' },
  { date: 'Sep 2026', year: '2026', title: 'Commercial launch', body: 'Formal inauguration and commencement of commercial operations targeted for September 2026.' },
]

/* The documented processing flow — [BRO] page 2, with dispatch from [DECK] s8 / s15. */
export const process = [
  {
    no: '01', key: 'procure', title: 'Direct procurement',
    short: 'Sourced at the centres of produce',
    body: 'Raw material is procured directly from the centres of produce to maintain uniform taste and quality. The very first quality check takes place here, at the time of procurement.',
    check: 'Quality check · procurement',
    img: 'grain-heap', alt: 'A worker bends over a deep heap of raw seed at a procurement point',
  },
  {
    no: '02', key: 'intake', title: 'Intake inspection',
    short: 'A second check at the plant gate',
    body: 'Every lot is inspected again as it enters the plant, before any processing begins.',
    check: 'Quality check · plant intake',
    img: 'seed-pour', alt: 'Hands let a sample of seed fall from one palm to the other to inspect it',
  },
  {
    no: '03', key: 'clean', title: 'Cleaning',
    short: 'Foreign matter removed',
    body: 'Raw materials are first cleaned with the help of special machines, preceded and followed by quality checks.',
    check: 'Checked before & after',
    img: 'winnow-b', alt: 'A woman winnows seed in a wide bamboo tray to separate it from chaff',
  },
  {
    no: '04', key: 'dry', title: 'Drying & testing',
    short: 'Moisture controlled, lots tested',
    body: 'Material is dried and tested using dedicated machinery so that only conforming lots move forward.',
    check: 'Checked before & after',
    img: 'chilli-kashmir', alt: 'A heap of dried red chillies in the open air beside a mountain lake',
  },
  {
    no: '05', key: 'grade', title: 'Sorting & grading',
    short: 'Uniform size, uniform quality',
    body: 'Produce is sorted and graded — for example cardamom in 8, 7 and 6 bold grades — for a consistent finished product.',
    check: 'Checked before & after',
    img: 'chilli-sorting', alt: 'Women sit among a floor of dried red chillies, sorting them by hand',
  },
  {
    no: '06', key: 'grind', title: 'Low-temperature grinding',
    short: 'Ground to protect aroma',
    body: 'Spices are carefully ground into the finished product through several stages, using low-temperature grinding.',
    check: 'Checked before & after',
    img: 'spice-pinch', alt: 'A hand takes a pinch of ground spice from a small decorated bowl',
  },
  {
    no: '07', key: 'pack', title: 'Packaging',
    short: 'Sealed for freshness',
    body: 'Finished products are packed using state-of-the-art packaging, sealed against air and moisture.',
    check: 'Final quality check',
    img: 'product:garam-masala', alt: 'Greenshadow garam masala in a sealed black 100 g pouch',
  },
  {
    no: '08', key: 'dispatch', title: 'Dispatch & export',
    short: '≈25 km to Vizhinjam',
    body: 'Consignments are dispatched to domestic buyers and export markets, with Vizhinjam International Seaport roughly 25 km from the factory.',
    check: 'Export documentation',
    img: 'truck-loading', alt: 'A worker carries a jute sack onto a truck stacked with sacks for dispatch',
  },
]

/* Facility status — [DECK] s5 / s6. */
export const facilityStatus = [
  { area: 'Land', status: 'Owned', state: 'done' },
  { area: 'Factory building', status: 'Completed', state: 'done' },
  { area: 'Major infrastructure', status: 'Substantially completed', state: 'done' },
  { area: 'Processing set-up & electrical', status: 'In place', state: 'done' },
  { area: 'Final equipment & IT fit-out', status: 'In progress', state: 'progress' },
  { area: 'Commercial operations', status: 'Launch targeted · Sep 2026', state: 'progress' },
]

export const advantages = [
  { title: 'Own land & facility', body: 'The company operates from its own property — no recurring factory rent.' },
  { title: 'Infrastructure in place', body: 'The major initial investment in building and infrastructure has already been made.' },
  { title: 'Rural location', body: 'A rural Thiruvananthapuram setting with potentially competitive operating costs.' },
  { title: 'Direct farmer sourcing', body: 'Buying closer to the grower, with fewer intermediary layers and better traceability.' },
  { title: 'Proximity to Vizhinjam', body: 'Around 25 km from Vizhinjam International Seaport — a potential export-logistics advantage.' },
]

export const sourcing = [
  'Relationships with farmers across different regions of India',
  'Access to tribal and agricultural producer communities',
  'Direct sourcing with fewer intermediary layers',
  'Better traceability and sourcing control',
  'Multilingual communication across growing regions',
]

export const impact = [
  'Local employment',
  "Women's employment opportunities",
  'Farmer market access',
  'Direct agricultural procurement',
  'Rural economic activity',
  'Kerala-based value addition',
]

/* Markets — [DECK] s12, [RCMC] "countries to which the company is exporting". */
export const markets = {
  focus: ['United States of America', 'United Arab Emirates'],
  declared: ['Australia', 'Bangladesh', 'Saudi Arabia', 'South Africa', 'United Arab Emirates', 'United Kingdom', 'United States of America'],
  channels: [
    { title: 'Export sales', body: 'Merchant-cum-manufacturer exports under IEC AAICG3236F, with customs (ICEGATE) and banking (AD code) registrations in place.' },
    { title: 'Domestic wholesale', body: 'Licensed by FSSAI for wholesale trade in spices, cereals, fruits, vegetables, nuts and seeds.' },
    { title: 'Retail', body: 'Branded Greenshadow masalas and ground spices in 100 g retail packs.' },
    { title: 'B2B supply', body: 'Bulk whole spices, nuts and processed products for trade buyers.' },
  ],
  fssaiCategories: [
    { code: '12', name: 'Salts, spices, soups, sauces, salads and protein products' },
    { code: '06', name: 'Cereals and cereal products, pulses and legumes' },
    { code: '04', name: 'Fruits and vegetables, nuts and seeds' },
  ],
  apedaGroups: [
    { group: 'Cashew', items: ['Cashew kernels'] },
    { group: 'Cereals', items: ['Basmati rice', 'Non-basmati rice', 'Wheat', 'Other coarse grains'] },
    { group: 'Fruits & vegetables', items: ['Fresh onions', 'Other fresh vegetables', 'Walnut', 'Other fresh fruits'] },
    { group: 'Processed fruits & vegetables', items: ['Dried & preserved vegetables'] },
    { group: 'Floriculture & seeds', items: ['Vegetable seeds'] },
  ],
  hsLines: [
    { code: '3301 90 23', name: 'Coriander oleoresins' },
    { code: '3301 90 21', name: 'Clove oleoresins' },
    { code: '2302 40 00', name: 'Bran of other cereals' },
  ],
}

/* [BRO] page 5–6 — consumer care guidance published by the company. */
export const careTips = [
  { title: 'Keep them away from heat', body: 'Heat from the stove harms spices. Store them away from the cooking area.' },
  { title: "Don't let moisture in", body: 'Moisture shortens shelf life. Always use a completely dry spoon.' },
  { title: 'Keep them airtight', body: 'Spices lose flavour faster in air. Airtight glass jars or metal tins work best.' },
  { title: 'Store in a dark place', body: 'Direct sunlight also affects spices. Keep them away from the sun.' },
  { title: 'Buy whole spices', body: 'Whole spices such as nutmeg stay fresh longer than ground ones.' },
  { title: 'Test for strength', body: 'If the colour has faded, the flavour probably has too. Trust your senses.' },
]
