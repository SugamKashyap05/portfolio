export const palette = {
  sumi: "#0B0B0D",
  washi: "#F2EDE4",
  aizome: "#2A3E5C",
  vermillion: "#C1440E",
  goldLeaf: "#B99B5B",
  mistGray: "#8A8B8C",
} as const;

export const site = {
  name: "Ryo Tanaka",
  nameJa: "田中 亮",
  role: "Creative Developer",
  tagline: "Building quiet interfaces for loud ideas",
  email: "hello@ryotanaka.dev",
  location: "Tokyo / Remote",
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "X", href: "https://x.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Are.na", href: "https://are.na" },
  ],
} as const;

export const projects = [
  {
    id: "01",
    title: "Stillwater",
    subtitle: "Real-time tide visualization for coastal researchers",
    description:
      "A WebGL dashboard rendering forty years of tidal data as a single, navigable surface. Built with React Three Fiber and a custom GLSL depth shader.",
    tags: ["WebGL", "GLSL", "Data Viz"],
    year: "2025",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=moody%20cinematic%20film%20still%2C%20vast%20dark%20ocean%20surface%20at%20night%20seen%20from%20above%2C%20slow%20tidal%20swell%20patterns%2C%20deep%20indigo%20%232A3E5C%20and%20ink%20black%20%230B0B0D%20tones%2C%20single%20faint%20moonlit%20horizon%2C%20heavy%20negative%20space%20lower%20third%2C%2035mm%20film%20grain%2C%20anamorphic%20widescreen%2C%20japanese%20neo-noir%20color%20grade&image_size=landscape_16_9",
  },
  {
    id: "02",
    title: "Paper Lantern",
    subtitle: "Type-first publishing platform for long-form essays",
    description:
      "A reading environment where typography does the heavy lifting — variable serif typesetting, marginalia, and scroll-synced footnotes. Zero trackers, zero clutter.",
    tags: ["Next.js", "Typography", "CMS"],
    year: "2024",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20film%20still%2C%20dimly%20lit%20japanese%20study%20at%20night%2C%20single%20warm%20paper%20lantern%20glow%20over%20open%20book%20on%20dark%20wood%20desk%2C%20deep%20shadows%20filling%20two%20thirds%20of%20frame%2C%20cream%20%23F2EDE4%20and%20indigo%20palette%2C%20shallow%20depth%20of%20field%2C%2035mm%20grain%2C%20quiet%20contemplative%20mood&image_size=landscape_16_9",
  },
  {
    id: "03",
    title: "Night Market",
    subtitle: "Headless commerce for a Kyoto ceramics studio",
    description:
      "Storefront that treats each piece like a gallery object — full-bleed photography, provenance notes, and a checkout flow reduced to four taps.",
    tags: ["Shopify", "Edge", "Motion"],
    year: "2024",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20neo-noir%20film%20still%2C%20narrow%20kyoto%20back-alley%20at%20night%20after%20rain%2C%20wet%20stone%20pavement%20mirroring%20sparse%20warm%20lantern%20light%2C%20deep%20indigo%20shadows%20dominating%20frame%2C%20handmade%20ceramic%20shop%20front%20glowing%20softly%2C%20off-center%20composition%2C%20anamorphic%20widescreen%2C%20film%20grain&image_size=landscape_16_9",
  },
  {
    id: "04",
    title: "Intervals",
    subtitle: "Generative sound piece for a museum installation",
    description:
      "A twelve-channel ambient composition driven by visitor movement, synthesized in the browser with the Web Audio API and spatialized in real time.",
    tags: ["Web Audio", "Installation", "Generative"],
    year: "2023",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20film%20still%2C%20vast%20empty%20museum%20hall%20in%20darkness%2C%20one%20dramatic%20diagonal%20beam%20of%20light%20cutting%20through%20thin%20fog%20onto%20concrete%20floor%2C%20monolithic%20black%20walls%2C%20extreme%20negative%20space%2C%20ink%20black%20and%20mist%20gray%20palette%2C%20minimalist%20composition%2C%20subtle%2035mm%20grain&image_size=landscape_16_9",
  },
] as const;

export const images = {
  heroBackdrop:
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=very%20dark%20atmospheric%20ink%20wash%20landscape%2C%20indigo%20night%20mist%20rolling%20over%20black%20mountain%20silhouettes%2C%20extremely%20dark%20and%20subtle%2C%20mostly%20ink%20black%20with%20faint%20indigo%20gradation%2C%20sumi-e%20inspired%2C%20minimal%2C%20heavy%20negative%20space%2C%20cinematic%20matte%20painting&image_size=landscape_16_9",
  aboutPortrait:
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20portrait%20orientation%20film%20still%2C%20abstract%20sumi-e%20ink%20stroke%20bleeding%20into%20deep%20indigo%20wash%20on%20aged%20cream%20washi%20paper%2C%20single%20bold%20vertical%20brush%20gesture%20slightly%20off-center%2C%20visible%20paper%20fiber%20texture%2C%20generous%20negative%20space%2C%20museum%20lighting%2C%20subtle%20grain&image_size=portrait_4_3",
  timelineStills: [
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tiny%20cinematic%20film%20frame%2C%20dark%20studio%20desk%20with%20glowing%20monitor%20showing%20abstract%20wireframe%2C%20indigo%20rim%20light%2C%20ink%20black%20shadows%2C%20minimal%2C%2035mm%20grain&image_size=landscape_4_3",
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tiny%20cinematic%20film%20frame%2C%20empty%20modern%20office%20at%20blue%20hour%2C%20row%20of%20desks%20in%20silhouette%20against%20indigo%20window%20light%2C%20ink%20black%20foreground%2C%20minimal%2C%2035mm%20grain&image_size=landscape_4_3",
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tiny%20cinematic%20film%20frame%2C%20close-up%20of%20hands%20typing%20on%20keyboard%20in%20darkness%2C%20screen%20glow%20on%20keys%2C%20indigo%20and%20ink%20black%20tones%2C%20shallow%20focus%2C%2035mm%20grain&image_size=landscape_4_3",
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tiny%20cinematic%20film%20frame%2C%20small%20apartment%20workspace%20at%20night%2C%20single%20desk%20lamp%2C%20laptop%20glow%2C%20city%20lights%20bokeh%20through%20window%2C%20indigo%20night%20palette%2C%2035mm%20grain&image_size=landscape_4_3",
  ],
} as const;

export const experience = [
  {
    period: "2023 — Now",
    role: "Senior Creative Developer",
    org: "Studio Kurogane",
    note: "Leading WebGL and interaction work for cultural institutions and design-led brands.",
  },
  {
    period: "2021 — 2023",
    role: "Frontend Engineer",
    org: "Hanamizu Labs",
    note: "Built real-time collaboration tools; owned the rendering pipeline for a canvas editor.",
  },
  {
    period: "2019 — 2021",
    role: "UI Engineer",
    org: "Northlight",
    note: "Design systems and motion language for a suite of fintech products.",
  },
  {
    period: "2017 — 2019",
    role: "Freelance Developer",
    org: "Independent",
    note: "Sites and prototypes for small studios — the years of learning by shipping.",
  },
] as const;

export const skillGauges = [
  { label: "TypeScript", value: 92 },
  { label: "React / Next", value: 88 },
  { label: "Node · Realtime", value: 90 },
  { label: "WebGL · Shaders", value: 76 },
  { label: "UI Engineering", value: 85 },
  { label: "Rust · WASM", value: 61 },
] as const;

export const logAlts = {
  about: "2,400 M",
  projects: ["9,600 M", "17,500 M", "31,200 M", "46,800 M"],
  systems: "68,000 M",
  contact: "97,500 M",
} as const;

export const skillGroups = [
  {
    index: "一",
    heading: "Interface",
    items: ["TypeScript", "React / Next.js", "Tailwind CSS", "Design Systems", "Accessibility"],
  },
  {
    index: "二",
    heading: "Motion & 3D",
    items: ["Framer Motion", "GSAP / ScrollTrigger", "Three.js / R3F", "GLSL Shaders", "Web Audio"],
  },
  {
    index: "三",
    heading: "Craft",
    items: ["Performance Budgets", "Edge Rendering", "Creative Direction", "Prototyping", "Technical Writing"],
  },
] as const;
