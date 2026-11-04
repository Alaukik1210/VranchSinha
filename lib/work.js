/**
 * Every case study on the site, in the order they appear.
 *
 * Copy is Vranch's own from the previous site, lightly tightened. `w`/`h`
 * are the native pixel sizes so layouts can reserve space exactly (no shift
 * while images load). `tone` is the one colour a project brings with it; it
 * is only ever used for that project's own accents. Exact brand values:
 * Genasis logo fill, RAREMATE --color-gold, DN --cyan (BRAND.md),
 * SportsNStats primary button. `toneInk` is the text colour set on it.
 */

export const WORK = [
  {
    slug: "genasis",
    video: "/projects/video/genasis",
    name: "Genasis",
    kind: "Gen AI platform for content creators",
    tone: "#FF3100",
    toneInk: "#111111",
    roles: ["Brand identity", "Web app UI/UX", "Design system"],
    cover: { src: "/projects/genasis-cover.jpg", w: 4096, h: 3072 },
    summary:
      "My most end-to-end project. I came in when the product was only an idea, with no brand, no interface and no system, and built all of it: logo, visual identity, the web app, and a component library the engineers could actually ship with.",
    body: [
      "The core challenge was making AI feel approachable. The users were creators who wanted to make content faster, not learn a new tool. Every decision, from onboarding to information architecture, shortened the distance between opening the app and getting something out of it.",
      "Two rounds of flow redesigns and a rebuilt onboarding cut time-to-first-output by 30-40%. For a product I owned solo, the growth that followed was the clearest signal the design was working.",
    ],
    metrics: [
      { value: "200 → 10K+", label: "Users in 30 days" },
      { value: "30-40%", label: "Faster time-to-first-output" },
      { value: "35-45%", label: "Onboarding completion" },
      { value: "25-30%", label: "Session engagement" },
    ],
    screens: [
      { src: "/projects/genasis-login.jpg", w: 4000, h: 3000, title: "Welcome back", tag: "Authentication" },
      { src: "/projects/genasis-pricing.jpg", w: 4096, h: 2730, title: "Pricing", tag: "Monetisation" },
      { src: "/projects/genasis-audience.jpg", w: 4096, h: 2730, title: "Who is this for?", tag: "Onboarding" },
      { src: "/projects/genasis-logo.png", w: 1024, h: 768, title: "Identity", tag: "Brand system" },
    ],
  },
  {
    slug: "raremate",
    video: "/projects/video/raremate",
    name: "RAREMATE",
    kind: "Cosmetologist-curated luxury skincare",
    tone: "#CFA75F",
    toneInk: "#17150F",
    roles: ["Brand identity", "Web design", "Next.js build"],
    cover: { src: "/projects/raremate-cover.jpg", w: 2560, h: 1920 },
    href: "https://raremate.in",
    hrefLabel: "raremate.in",
    summary:
      "A luxury skincare house that needed to look like one. I designed and shipped the whole thing: identity, art direction and the live site, on a white canvas with warm panels and one confident bronzed gold.",
    body: [
      "Skincare sites usually drown you: forty products, a wall of claims, no way in. RAREMATE sells twelve formulas, so the site leads with the question a buyer actually has (what's my concern?) and routes from there into a filterable shelf where every product opens into its own detail view.",
      "Trust is the other half of the job. The curator's note, the four standards, the named supplier houses and the cosmetologist peer proof are sequenced so the claims land before the ask. Checkout is handed to WhatsApp, the channel the customer was already going to use.",
    ],
    screens: [
      { src: "/projects/raremate-shop.jpg", w: 3000, h: 2000, title: "The shelf", tag: "Product grid" },
      { src: "/projects/raremate-product.jpg", w: 3000, h: 2000, title: "One formula", tag: "Detail view" },
      { src: "/projects/raremate-doctor.jpg", w: 3000, h: 2000, title: "The curator", tag: "Trust" },
      { src: "/projects/raremate-standards.jpg", w: 3000, h: 2000, title: "Four standards", tag: "Proof" },
      { src: "/projects/raremate-prescribers.jpg", w: 3000, h: 2000, title: "Peer proof", tag: "Social proof" },
    ],
  },
  {
    slug: "dn-associates",
    video: "/projects/video/dn-associates",
    name: "DN Associates",
    kind: "Specialty pharma distribution, since 1991",
    tone: "#07CCEC",
    toneInk: "#040B33",
    roles: ["Web design", "3D / WebGL", "Next.js build", "SEO"],
    cover: { src: "/projects/dn/dn-desk-home.jpg", w: 1974, h: 1125 },
    href: "https://www.dnassociatesindia.com",
    hrefLabel: "dnassociatesindia.com",
    summary:
      "A 35-year-old pharma distributor that had outgrown its brochure site. I rebuilt it as the channel it actually is: a 3D DNA-helix home, a searchable catalogue of 17,900+ products, pages for 100+ pharma partners, and an admin panel the team runs themselves.",
    body: [
      "The brand line was already there (reliability is in our genes), so the whole site is built on it. The home page is a DNA helix you scroll through, and the four services map to the four bases: Availability, Trust, Guidance and Care.",
      "Under the surface it's a data product. 17,900 products across 25 therapy areas load a light first page and stream the rest, so the catalogue stays quick on a mid-range phone, and the admin panel keeps products, brands and pages editable without a developer.",
    ],
    metrics: [
      { value: "17,900+", label: "Products, searchable" },
      { value: "100+", label: "Pharma partner pages" },
      { value: "25", label: "Therapy areas" },
      { value: "1", label: "Self-serve admin panel" },
    ],
    screens: [
      { src: "/projects/dn/dn-desk-our-story.jpg", w: 1974, h: 1125, title: "One product, one partner", tag: "Our story" },
      { src: "/projects/dn/dn-desk-therapy-areas.jpg", w: 1974, h: 1125, title: "25 specialties", tag: "Therapy areas" },
      { src: "/projects/dn/dn-desk-products.jpg", w: 1974, h: 1125, title: "Every molecule, searchable", tag: "Catalogue" },
      { src: "/projects/dn/dn-desk-about.jpg", w: 1974, h: 1125, title: "Since 1991", tag: "About" },
      { src: "/projects/dn/dn-desk-contact.jpg", w: 1974, h: 1125, title: "Inspiration, care, compassion", tag: "Contact" },
    ],
  },
  {
    slug: "sportsnstats",
    video: "/projects/video/sportsnstats",
    name: "SportsNStats",
    kind: "Sports analytics, made legible",
    tone: "#34A0A3",
    toneInk: "#0B1414",
    roles: ["UX research", "Information architecture", "Product design"],
    cover: { src: "/projects/sns-cover.png", w: 3200, h: 2080 },
    concept: true,
    summary:
      "A concept project rethinking how fans use sports data. The problem wasn't gathering statistics; it was presenting a lot of information so it feels intuitive, engaging and easy to move through.",
    body: [
      "I started from the ground up, with user research and information architecture before wireframes and visual design. Most of the work was simplifying complex data structures, setting a clear content hierarchy, and designing screens that surface the meaningful insight without overwhelming anyone.",
      "It sharpened how I design data-heavy products: balancing usability with visual appeal, and treating clarity as the most important feature.",
    ],
    screens: [
      { src: "/projects/sns-properties.jpg", w: 1280, h: 1252, title: "Find the venue", tag: "Properties" },
      { src: "/projects/sns-bookings.jpg", w: 1280, h: 2007, title: "Book the hour", tag: "Bookings" },
      { src: "/projects/sns-tournaments.jpg", w: 1280, h: 1295, title: "Run the tournament", tag: "Tournaments" },
      { src: "/projects/sns-onboarding.jpg", w: 1280, h: 834, title: "Sign in fast", tag: "Onboarding" },
      { src: "/projects/sns-error.jpg", w: 1280, h: 834, title: "Miss, gracefully", tag: "Error states" },
    ],
  },
];

export const SIDE = {
  slug: "la-scaloneta",
  name: "La Scaloneta",
  kind: "A WebGL tribute to Argentina, built in a day",
  href: "https://afatribute.vercel.app",
  hrefLabel: "afatribute.vercel.app",
  tone: "#75AADB", // --celeste in the project
  cover: { src: "/projects/afa/afa-hero.jpg", w: 1920, h: 938 },
  shots: [
    { src: "/projects/afa/afa-history.jpg", w: 1400, h: 684, title: "'78, '86 and '22" },
    { src: "/projects/afa/afa-trophies.jpg", w: 1400, h: 684, title: "The trophy cabinet" },
    { src: "/projects/afa/afa-squad.jpg", w: 1400, h: 684, title: "The 26-man squad" },
    { src: "/projects/afa/afa-collage.jpg", w: 1400, h: 684, title: "The send-off" },
  ],
};

export const MARKS = [
  { src: "/logo1.svg", title: "Logo 01", tag: "Logo" },
  { src: "/logo2.svg", title: "Logo 02", tag: "Logo" },
  { src: "/logo3.svg", title: "Logo 03", tag: "Logo" },
  { src: "/brand1.svg", title: "Brand kit 01", tag: "Brand kit" },
  { src: "/brand2.svg", title: "Brand kit 02", tag: "Brand kit" },
  { src: "/brand3.svg", title: "Brand kit 03", tag: "Brand kit" },
  { src: "/brand4.svg", title: "Brand kit 04", tag: "Brand kit" },
];

export const EXPERIENCE = [
  { org: "Google Developer Group BU", role: "UI/UX Lead", logo: "/gdg.svg", note: "Helped run 5 events in year one, then led design for 7 in year two." },
  { org: "LexHack", role: "Design Head", logo: "/lex.svg", note: "Every asset for a law and engineering hackathon: brand kit, posters, brochure." },
  { org: "SFCMUN", role: "Editor in Chief", logo: "/sfcmun.svg", note: "Magazines, posts and all the stationery for the MUN." },
];

export const CONTACT = {
  email: "vranchhsinha@gmail.com",
  phone: "+91 93367 71392",
  phoneHref: "tel:+919336771392",
  linkedin: "https://www.linkedin.com/in/vranchsinha",
  resume: "/resume.pdf",
};

export const workBySlug = (slug) => WORK.find((w) => w.slug === slug);
