/**
 * Every case study on the site, in the order they appear.
 *
 * Copy is Vranch's own from the previous site, lightly tightened. `w`/`h`
 * are the native pixel sizes so layouts can reserve space exactly (no shift
 * while images load). `tone` is the one colour a project brings with it; it
 * is only ever used for that project's own accents. Exact brand values:
 * Genasis logo fill, RAREMATE --color-gold, DN --cyan (BRAND.md). `toneInk` is the text colour set on it.
 */

export const WORK = [
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
      "DN Associates moves specialty medicine from manufacturers to hospitals across Uttar Pradesh. I rebuilt its site around the catalogue: 17,900+ products, 100+ partner pages and an admin panel the team runs themselves.",
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
    story: {
      title: "35 years without skipping a dose.",
      lead: [
        "DN Associates supplies specialty medicine, oncology, nephrology, plasma derivatives, to hospitals and institutions across Uttar Pradesh. Nobody visits that site to browse. They come to check one thing: do you carry it?",
        "The old site answered with a brochure. I rebuilt it around the catalogue: 17,900+ products you can search, 100+ partner pages, and an admin panel the team runs without calling anyone.",
      ],
      media: [0],
      sections: [
        {
          h: "The idea was already in their line",
          p: [
            "\"Reliability is in our genes.\" So the home page is a DNA helix you scroll through, and the four services sit on it as its four bases: Availability, Trust, Guidance, Care. A B2B distributor rarely gets a metaphor this good for free.",
          ],
          media: [2],
        },
        {
          h: "A catalogue first, a website second",
          p: [
            "17,900 products across 25 therapy areas still have to open fast on a mid-range phone, so the first page stays light and the rest streams in.",
            "Products, brands and pages are all editable by the team. A catalogue this size goes stale the day it needs a developer.",
          ],
          media: [3],
          metrics: true,
        },
      ],
      reflections: [
        {
          h: "Nowhere to hide.",
          p: "Sole designer and AI dev. Every call, from the 3D home to the admin panel, was mine.",
        },
        {
          h: "A few firsts.",
          p: "My first 3D model, and my first database this size.",
        },
        {
          h: "The unglamorous half.",
          p: "I learnt a lot about cybersecurity, and did SEO for the first time. Most of what makes this site good doesn't show.",
        },
      ],
    },
    frame: true, // raw site screenshots, shown in the laptop mockup
    screens: [
      { src: "/projects/dn/dn-desk-home.jpg", w: 1974, h: 1125, title: "Reliability is in our genes", tag: "Home" },
      { src: "/projects/dn/dn-desk-our-story.jpg", w: 1974, h: 1125, title: "One product, one partner", tag: "Our story" },
      { src: "/projects/dn/dn-desk-therapy-areas.jpg", w: 1974, h: 1125, title: "25 specialties", tag: "Therapy areas" },
      { src: "/projects/dn/dn-desk-products.jpg", w: 1974, h: 1125, title: "Every molecule, searchable", tag: "Catalogue" },
      { src: "/projects/dn/dn-desk-about.jpg", w: 1974, h: 1125, title: "Since 1991", tag: "About" },
      { src: "/projects/dn/dn-desk-contact.jpg", w: 1974, h: 1125, title: "Inspiration, care, compassion", tag: "Contact" },
    ],
  },
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
      "Genasis is a Gen AI platform for content creators. I came in when it was only an idea and built the logo, identity, web app and component library, then cut time-to-first-output by 30-40%.",
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
    // Case study copy. `media` indexes `screens`; two in a row sit side by side.
    story: {
      title: "Nobody signs up to learn AI.",
      lead: [
        "Creators come to Genasis to make content faster. Every minute spent understanding the tool is a minute the tool has failed them. That one idea decided what the product was allowed to ask.",
        "When I came in it was only an idea: no brand, no interface, no system. I built all of it, the logo, the identity, the web app, and a component library the engineers could actually ship with.",
      ],
      media: [0, 2],
      sections: [
        {
          h: "One number ran the product",
          p: [
            "Time to first output. If someone opened the app and left with nothing, nothing else we designed mattered.",
            "So onboarding starts with one question: who is this for? Two rounds of flow redesigns and a rebuilt onboarding cut that time by 30-40%.",
          ],
          media: [1, 3],
        },
        {
          h: "Then the numbers moved",
          p: [
            "I owned the design solo, so there was nowhere else to look when they did.",
          ],
          metrics: true,
        },
      ],
      reflections: [
        {
          h: "It changed how I work.",
          p: "You can't design an AI product from the outside. Learning it for Genasis put it in my own workflow.",
        },
        {
          h: "My first complete project.",
          p: "Logo, brand kit, web app, app, landing page. The first time one project ran through all of it.",
        },
        {
          h: "Real numbers, real devs.",
          p: "Up to here, design was my opinion. This is where it got measured, and where I learnt to work next to the people building it.",
        },
      ],
    },
    screens: [
      { src: "/projects/genasis-login.jpg", w: 4000, h: 3000, title: "Welcome back", tag: "Authentication" },
      { src: "/projects/genasis-pricing.jpg", w: 4096, h: 2730, title: "Pricing", tag: "Monetisation" },
      { src: "/projects/genasis-audience.jpg", w: 4096, h: 2730, title: "Who is this for?", tag: "Onboarding" },
      { src: "/projects/genasis-logo.png", w: 1024, h: 768, title: "Identity", tag: "Brand system" },
    ],
  },
  {
    slug: "oneverse",
    name: "Oneverse",
    kind: "AI personal assistant, in the size of a credit card",
    tone: "#7E93BC",
    toneInk: "#0B0B0B",
    roles: ["Brahmaverse AI", "Product design", "Developer handoff"],
    cover: { src: "/projects/oneverse/app-and-device.jpg", w: 620, h: 620 },
    summary:
      "Oneverse is one app for every word: speak to type, record to remember, with a 3.2 mm recorder the size of a credit card. I designed the mobile app, from onboarding to Home.",
    device: "phone", // the app's own screens, shown on a phone
    frame: true,
    story: {
      title: "You talk faster than you type.",
      lead: [
        "That's the whole idea behind Oneverse. Speak to type, record to remember: one app for every word, and a 3.2 mm recorder the size of a credit card for the conversations you can't stop to write down.",
        "I designed the mobile app during my internship at Brahmaverse AI, from the first onboarding screen to the Home it lands on.",
      ],
      media: [0, 1],
      sections: [
        {
          h: "Feel it first",
          p: [
            "Dictation sounds gimmicky until it works on you. So onboarding skips the tour: you read a paragraph out loud, and it comes back clean, with the filler words gone, in whichever style you pick.",
          ],
          media: [2, 3],
        },
        {
          h: "It has to sound like you",
          p: [
            "Nobody here talks in one language. Oneverse follows you across languages, even mixed in one sentence, and the Dictionary keeps the names and jargon it couldn't have known.",
          ],
          media: [4, 5],
        },
        {
          h: "A recording is only useful later",
          p: [
            "So it comes back as a note, with key points and action items. Rethink reshapes it in a line, make it a bullet list, turn it into an email, and keeps every version.",
          ],
          media: [6, 7],
        },
        {
          h: "Show them what they got back",
          p: [
            "A habit needs a reason. So the app does the maths: words spoken, time saved, and what that adds up to at your pace. It's the first thing you see when onboarding ends.",
          ],
          media: [8, 9],
        },
        {
          h: "I skipped the handoff",
          p: [
            "Handing over screens means someone has to rebuild them. So the dev got a working React Native build in the app's own stack, using only libraries it already had. The job became fixing the few cracks I left behind.",
          ],
        },
      ],
      reflections: [
        {
          h: "First time in an office.",
          p: "I learnt to work inside a system and a team, not just next to one.",
        },
        {
          h: "Deadlines were eating the UI.",
          p: "Everything waited on Figma, so the UI got cut at the end. So I started creating the screens with Claude Design instead.",
        },
        {
          h: "Handoff is design too.",
          p: "The best thing I gave the dev wasn't a file. It was less to build.",
        },
      ],
    },
    screens: [
      { src: "/projects/oneverse/app/home.jpg", w: 804, h: 1748, title: "Home", tag: "App" },
      { src: "/projects/oneverse/app/speak.jpg", w: 804, h: 1748, title: "Speak. It's written.", tag: "App" },
      { src: "/projects/oneverse/app/read-aloud.jpg", w: 804, h: 1748, title: "Read this out loud", tag: "App" },
      { src: "/projects/oneverse/app/styles.jpg", w: 804, h: 1748, title: "Here's what we wrote", tag: "App" },
      { src: "/projects/oneverse/app/languages.jpg", w: 804, h: 1748, title: "Which languages do you speak?", tag: "App" },
      { src: "/projects/oneverse/app/dictionary.jpg", w: 804, h: 1748, title: "Words it always spells right", tag: "App" },
      { src: "/projects/oneverse/app/note.jpg", w: 804, h: 1748, title: "The note", tag: "App" },
      { src: "/projects/oneverse/app/rethink.jpg", w: 804, h: 1748, title: "Rethink", tag: "App" },
      { src: "/projects/oneverse/app/success.jpg", w: 804, h: 1748, title: "Success", tag: "App" },
      { src: "/projects/oneverse/app/dictated.jpg", w: 804, h: 1748, title: "Minutes dictated", tag: "App" },
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
      "RAREMATE is a cosmetologist-curated luxury skincare house: twelve formulas, sold by enquiry on WhatsApp. I designed and shipped the identity, art direction and live site.",
    body: [
      "Skincare sites usually drown you: forty products, a wall of claims, no way in. RAREMATE sells twelve formulas, so the site leads with the question a buyer actually has (what's my concern?) and routes from there into a filterable shelf where every product opens into its own detail view.",
      "Trust is the other half of the job. The curator's note, the four standards, the named supplier houses and the cosmetologist peer proof are sequenced so the claims land before the ask. Checkout is handed to WhatsApp, the channel the customer was already going to use.",
    ],
    story: {
      title: "Rare means twelve.",
      lead: [
        "RAREMATE is a cosmetologist-curated skincare house for Indian skin: twelve formulas, each built on one active, sold by enquiry on WhatsApp. Most skincare sells by volume. This one sells by restraint, so the site couldn't behave like a skincare site.",
        "I designed and shipped the whole thing: identity, art direction and the live site, on a white canvas with warm panels and one bronzed gold.",
      ],
      media: [0, 1],
      sections: [
        {
          h: "Start with the skin, not the shelf",
          p: [
            "People arrive with a concern, and rarely a product name. So the site asks for that first, then routes to a filterable shelf where every formula opens into its own detail view. Twelve products don't need a mega menu.",
          ],
        },
        {
          h: "Earn it before you ask",
          p: [
            "A new luxury house has to prove itself. The curator's note, four standards, named supplier houses and cosmetologist peer proof run in that order, so the trust lands before the ask.",
            "The last step is WhatsApp. A cart would have been the wrong ending for something sold by enquiry.",
          ],
          media: [2, 3, 4],
        },
      ],
      reflections: [
        {
          h: "One designer, one marketing team.",
          p: "Sole designer and AI dev alongside Dot & Key's marketing team, building the entire site for phase 1.",
        },
        {
          h: "A site is also what it says.",
          p: "I learnt a lot about SEO and content here. A good page nobody finds is just a nice file.",
        },
      ],
    },
    frame: true, // raw site screenshots, shown in the laptop mockup
    screens: [
      { src: "/projects/raremate-shop.jpg", w: 3000, h: 2000, title: "The shelf", tag: "Product grid" },
      { src: "/projects/raremate-product.jpg", w: 3000, h: 2000, title: "One formula", tag: "Detail view" },
      { src: "/projects/raremate-doctor.jpg", w: 3000, h: 2000, title: "The curator", tag: "Trust" },
      { src: "/projects/raremate-standards.jpg", w: 3000, h: 2000, title: "Four standards", tag: "Proof" },
      { src: "/projects/raremate-prescribers.jpg", w: 3000, h: 2000, title: "Peer proof", tag: "Social proof" },
    ],
  },
];

export const SIDE = {
  slug: "la-scaloneta",
  name: "La Scaloneta",
  title: "Argentina Fan Tribute FIFA WC 26",
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
  { org: "Google Developer Group BU", role: "UI/UX Lead", logo: "/gdg.svg", glass: ["#2FA85A", "#0B8043", "#0E6B5C"], turn: -14, note: "Helped with 5 events in my first year, then 7 in my second." },
  { org: "LexHack", role: "Design Head", logo: "/lex.svg", glass: ["#E0559A", "#8A4FE8", "#3F8FE8"], turn: 12, note: "Logo, branding, posters, brochure and t-shirts." },
  { org: "SFCMUN", role: "Editor in Chief", logo: "/sfcmun.svg", glass: ["#3F8CF0", "#1F4FD0", "#16309A"], turn: -8, note: "Magazines, branding, printables and stationery for the MUN." },
];

// Each logo's width as a share of the card, set by eye so they carry equal weight.
export const LOGOS = {
  genasis: { src: "/projects/logos/genasis.png", width: 0.28 },
  oneverse: { src: "/projects/logos/oneverse.png", width: 0.5 },
  raremate: { src: "/projects/logos/raremate.png", width: 0.38 },
  "dn-associates": { src: "/projects/logos/dn-associates.svg", width: 0.27 },
  "la-scaloneta": { src: "/projects/logos/la-scaloneta.png", width: 0.3 },
};

export const CONTACT = {
  email: "vranchhsinha@gmail.com",
  linkedin: "https://www.linkedin.com/in/vranchsinha",
  resume: "/resume.pdf",
  appleMusic: "https://music.apple.com/profile/vranchsinha",
};

export const workBySlug = (slug) => WORK.find((w) => w.slug === slug);
