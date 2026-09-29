/**
 * SEO Search Intent & Internationalization Catalog
 * 
 * Provides distinct, non-generic search-intent titles, descriptions,
 * keyword profiles, use-case specifications, and internal link mappings
 * for all 42 DimensionUI templates.
 */

import { TemplateItem } from "./site";

export interface TemplateSeoData {
  targetIntent: string;
  useCase: string;
  includedSections: string[];
  searchKeywords: string[];
  relatedBlogSlugs: string[];
}

export const TEMPLATE_SEO_REGISTRY: Record<string, TemplateSeoData> = {
  // Free Tier
  "aether-ai-saas": {
    targetIntent: "Next.js AI Website Template & SaaS Landing Page",
    useCase: "AI startups, generative software launches, and waitlist validation campaigns.",
    includedSections: ["Interactive Waitlist Form", "Feature Bento Grid", "Responsive Navbar", "Social Proof Strip", "Dark Obsidian Canvas"],
    searchKeywords: ["Next.js templates", "AI website templates", "SaaS templates", "React templates", "Tailwind templates", "AI landing page"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "serenity-wellness": {
    targetIntent: "Next.js Healthcare & Wellness Clinic Website Template",
    useCase: "Holistic wellness centers, physiotherapy clinics, and mental health practices.",
    includedSections: ["Appointment Booking Flow", "Service Treatment Menu", "Practitioner Profiles", "Patient Reviews Wall", "Sticky Contact Bar"],
    searchKeywords: ["clinic website template", "healthcare Next.js template", "React templates", "Tailwind templates", "wellness website"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "nova-minimal-portfolio": {
    targetIntent: "Next.js Developer Portfolio Template (React & Tailwind)",
    useCase: "Frontend engineers, full-stack developers, and UI/UX designers showcasing work.",
    includedSections: ["Project Showcase Rail", "Tech Stack Icon Strip", "Case Study Viewport", "Interactive Resume Download", "Contact Form"],
    searchKeywords: ["developer portfolio template", "Next.js templates", "React templates", "Tailwind templates", "software engineer portfolio"],
    relatedBlogSlugs: ["tailwind-framer-motion-animations", "how-to-launch-saas-landing-page"],
  },
  "app-launch-lp": {
    targetIntent: "Next.js Mobile App Landing Page Template",
    useCase: "iOS and Android mobile app developers driving App Store & Play Store downloads.",
    includedSections: ["Mobile Device Mockup Hero", "App Store Download Badges", "Interactive Feature Carousel", "User Testimonial Wall", "FAQ Accordion"],
    searchKeywords: ["mobile app landing page", "Next.js templates", "React templates", "Tailwind templates", "iOS app website"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "simple-link-bio": {
    targetIntent: "Next.js Creator Link-in-Bio & Portfolio Template",
    useCase: "Content creators, educators, indie hackers, and digital nomads consolidating profile links.",
    includedSections: ["Avatar & Bio Header", "Categorized Link Stack", "Newsletter Subscription Form", "Tip Jar / Support Module", "Social Icon Marquee"],
    searchKeywords: ["link in bio template", "creator website template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },

  // $15 Tier - Local Businesses, Creative & Services
  "peak-fitness": {
    targetIntent: "Next.js Gym & Fitness Website Template (React & Tailwind)",
    useCase: "CrossFit gyms, personal training studios, and boutique fitness clubs.",
    includedSections: ["Class Schedule Grid", "Membership Tier Comparison", "Trainer Spotlights", "Free Trial Pass Modal", "Facility Tour Gallery"],
    searchKeywords: ["gym website template", "fitness Next.js template", "React templates", "Tailwind templates", "personal trainer website"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "azure-apartments": {
    targetIntent: "Next.js Real Estate & Property Showcase Template",
    useCase: "Luxury residential developments, property management agencies, and leasing offices.",
    includedSections: ["Unit Floor Plan Viewer", "Amenity Feature Bento", "Virtual Tour Frame", "Leasing Inquiry Scheduler", "Location Map Card"],
    searchKeywords: ["real estate website template", "property showcase template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["3d-websites-convert-better", "tailwind-framer-motion-animations"],
  },
  "apex-dental-clinic": {
    targetIntent: "Next.js Dental Practice & Healthcare Website Template",
    useCase: "Dental surgeries, cosmetic dentists, and family medical practitioners.",
    includedSections: ["Dental Treatment Cards", "Emergency Consultation Banner", "Dentist Credential Badges", "Patient Smile Before/After", "Appointment Picker"],
    searchKeywords: ["dental website template", "clinic website template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "precision-roofing": {
    targetIntent: "Next.js Contractor & Home Services Website Template",
    useCase: "Roofing contractors, renovation builders, and exterior home repair firms.",
    includedSections: ["Instant Quote Estimator", "Project Before & After Slider", "Licensing & Insurance Badges", "Service Area ZIP Filter", "Tap-to-Call Sticky Bar"],
    searchKeywords: ["contractor website template", "roofing website template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "aura-beauty-salon": {
    targetIntent: "Next.js Beauty Salon & Spa Website Template",
    useCase: "Hair styling studios, luxury day spas, and aesthetic beauty clinics.",
    includedSections: ["Treatment Price List", "Stylist Lookbook Grid", "Online Service Booking", "Gift Card Promotion Banner", "Client Testimonials"],
    searchKeywords: ["salon website template", "spa website template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "nexus-coworking": {
    targetIntent: "Next.js Coworking Space & Commercial Office Template",
    useCase: "Flexible workspace operators, shared offices, and executive suite providers.",
    includedSections: ["Desk & Office Pricing Tiers", "Amenity Highlight Grid", "Day Pass Booking Intake", "Community Events Calendar", "Location & Hours Panel"],
    searchKeywords: ["coworking website template", "commercial space template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "horizon-law-firm": {
    targetIntent: "Next.js Law Firm & Attorney Website Template",
    useCase: "Corporate litigation attorneys, personal injury advocates, and boutique legal practices.",
    includedSections: ["Practice Area Breakdowns", "Attorney Profiles & Credentials", "Confidential Case Review Form", "Settlement Case Results", "Client Disclaimers"],
    searchKeywords: ["law firm website template", "attorney template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "velvet-bistro": {
    targetIntent: "Next.js Restaurant & Hospitality Website Template",
    useCase: "Fine dining bistros, artisan cocktail lounges, and farm-to-table eateries.",
    includedSections: ["Culinary Menu with Dietary Filters", "Table Reservation Form", "Chef Story & Philosophy", "Private Dining Inquiries", "Live Open/Closed Status"],
    searchKeywords: ["restaurant website template", "hospitality Next.js template", "React templates", "Tailwind templates", "bistro website"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "zenith-accounting": {
    targetIntent: "Next.js Accounting & Financial Advisory Website Template",
    useCase: "Certified public accountants (CPAs), corporate tax advisors, and bookkeeping firms.",
    includedSections: ["Service Tier Comparison", "Tax Season Deadline Countdown", "Client Onboarding Form", "Financial Calculator Teaser", "Security & Trust Seals"],
    searchKeywords: ["accounting website template", "CPA website template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "urban-architecture": {
    targetIntent: "Next.js Architecture & Design Studio Template",
    useCase: "Architectural design offices, landscape architects, and modern interior designers.",
    includedSections: ["Full-Bleed Project Blueprint Rail", "Design Phase Timeline", "Award & Publication Wall", "Material Palette Showcase", "Consultation Scheduler"],
    searchKeywords: ["architecture website template", "design studio template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["3d-websites-convert-better", "tailwind-framer-motion-animations"],
  },
  "petpaws-vet": {
    targetIntent: "Next.js Vet Clinic & Animal Hospital Website Template",
    useCase: "Small animal veterinary clinics, emergency pet hospitals, and grooming facilities.",
    includedSections: ["Veterinary Care Service Menu", "24/7 Emergency Care Banner", "Veterinarian Team Roster", "Pet Patient Portal Teaser", "New Patient Booking"],
    searchKeywords: ["veterinary website template", "vet clinic template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "luxe-auto-detailing": {
    targetIntent: "Next.js Automotive Detailing & Ceramic Coating Template",
    useCase: "High-end automotive detailing studios, paint protection film (PPF) installers, and car customizers.",
    includedSections: ["Detailing Tier Packages", "Before & After Paint Correction Slider", "Vehicle Model Selector", "Online Booking Intake", "Customer Reviews"],
    searchKeywords: ["auto detailing website template", "automotive Next.js template", "React templates", "Tailwind templates", "ceramic coating website"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "summit-event": {
    targetIntent: "Next.js Tech Conference & Event Landing Page Template",
    useCase: "Technology summits, virtual developer hackathons, and corporate conventions.",
    includedSections: ["Keynote Speaker Carousel", "Multi-Track Agenda Timeline", "Early-Bird Ticket Tiers", "Sponsor Logo Marquee", "Venue Directions Card"],
    searchKeywords: ["conference website template", "event landing page", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "prism-photo-studio": {
    targetIntent: "Next.js Photography & Creative Portfolio Template",
    useCase: "Commercial photographers, fashion lookbook creators, and visual artists.",
    includedSections: ["Masonry Photo Portfolio", "Category Filtering Tabs", "Client Proofing Portal Teaser", "Session Rates Package", "Inquiry Contact Form"],
    searchKeywords: ["photography website template", "creative portfolio template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["3d-websites-convert-better", "tailwind-framer-motion-animations"],
  },
  "greenthumb-landscape": {
    targetIntent: "Next.js Landscaping & Outdoor Living Website Template",
    useCase: "Residential landscapers, commercial hardscape contractors, and lawn care services.",
    includedSections: ["Seasonal Maintenance Plans", "Project Transformation Gallery", "Estimate Request Form", "Client Guarantee Badges", "Service Radius Map"],
    searchKeywords: ["landscaping website template", "contractor website template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },

  // $20 Tier - SaaS, Dashboards, Fintech & B2B
  "cloudscale-analytics": {
    targetIntent: "Next.js SaaS Analytics & Dashboard Template",
    useCase: "B2B SaaS companies, cloud telemetry platforms, and infrastructure monitoring tools.",
    includedSections: ["Real-Time Metric Chart Shell", "Usage Ring Meter", "Tiered Pricing Comparison", "Interactive API Code Blocks", "Team Seat Calculator"],
    searchKeywords: ["SaaS templates", "dashboard templates", "Next.js templates", "React templates", "Tailwind templates", "analytics template"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "enterprise-b2b-agency": {
    targetIntent: "Next.js B2B Agency & Enterprise Growth Template",
    useCase: "Growth marketing agencies, enterprise consulting firms, and account-based sales providers.",
    includedSections: ["Interactive ROI Calculator", "SOC 2 & Enterprise Security Grid", "Branching Lead Qualifier", "Client Case Study Cards", "Executive Team Roster"],
    searchKeywords: ["B2B website template", "enterprise website template", "SaaS templates", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "ai-copilot-studio": {
    targetIntent: "Next.js AI Website Template & Prompt Playground",
    useCase: "Generative AI applications, code assistants, and automated workflow startups.",
    includedSections: ["Streaming AI Chat Shell", "Prompt Library Bento", "API Key Setup Simulator", "Usage-Based Pricing Table", "Developer Documentation Teaser"],
    searchKeywords: ["AI website templates", "SaaS templates", "Next.js templates", "React templates", "Tailwind templates", "AI landing page"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "fintech-neobank": {
    targetIntent: "Next.js Fintech & Banking Dashboard Template",
    useCase: "Digital banks, cross-border payment platforms, and modern treasury management services.",
    includedSections: ["Interactive Card Preview", "Live Currency Exchange Widget", "Security & Compliance Badges", "Mobile App Download CTA", "KYC Verification Step Tour"],
    searchKeywords: ["fintech website template", "dashboard templates", "SaaS templates", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "devflow-hub": {
    targetIntent: "Next.js Developer Docs & API Portal Template",
    useCase: "Developer tool creators, open-source maintainers, and API-first SaaS products.",
    includedSections: ["Searchable Documentation Catalog", "Multi-Language Code Runner", "Endpoint Response Inspector", "SDK Quickstart Stepper", "Community Discord Bar"],
    searchKeywords: ["API documentation template", "developer portal template", "SaaS templates", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "pulse-analytics": {
    targetIntent: "Next.js DevOps Dashboard & Telemetry Template",
    useCase: "DevOps engineering teams, Kubernetes cluster managers, and real-time incident response platforms.",
    includedSections: ["High-Frequency Latency Graphs", "Cluster Health Heatmap", "Incident Alert Banner", "Log Stream Simulator", "Service SLA Status Strip"],
    searchKeywords: ["dashboard templates", "DevOps dashboard template", "Next.js templates", "React templates", "Tailwind templates", "SaaS templates"],
    relatedBlogSlugs: ["best-saas-templates-2026", "tailwind-framer-motion-animations"],
  },
  "edulearn-academy": {
    targetIntent: "Next.js Online Course & Video Masterclass Template",
    useCase: "Cohort-based academies, digital course creators, and professional training institutes.",
    includedSections: ["Course Curriculum Accordion", "Video Lesson Preview Player", "Student Testimonial Wall", "Certificate of Completion Badge", "Tiered Tuition Checkout"],
    searchKeywords: ["online course template", "education Next.js template", "React templates", "Tailwind templates", "LMS template"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "saas-billing-hub": {
    targetIntent: "Next.js SaaS Billing & Subscription Portal Template",
    useCase: "SaaS founders needing billing portals, self-serve plan upgrades, and invoice dashboards.",
    includedSections: ["Monthly / Annual Plan Switcher", "Seat Overage Calculator", "Invoice History Table", "Payment Method Management Shell", "Cancellation Flow Guard"],
    searchKeywords: ["SaaS templates", "dashboard templates", "Next.js templates", "React templates", "Tailwind templates", "SaaS billing template"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "talenthire-ats": {
    targetIntent: "Next.js HR Tech & Recruiting Career Portal Template",
    useCase: "Fast-growing startups, recruiting agencies, and HR software providers.",
    includedSections: ["Filterable Job Board", "Department Career Pathways", "Candidate Pipeline Kanban", "Company Culture Video Bento", "Quick Application Form"],
    searchKeywords: ["job board template", "HR tech Next.js", "SaaS templates", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "cryptostaking-protocol": {
    targetIntent: "Next.js Web3 & Crypto Staking Landing Page Template",
    useCase: "DeFi protocols, liquid staking networks, and tokenized ecosystem launches.",
    includedSections: ["Live APY Reward Counter", "Total Value Locked (TVL) Meter", "Web3 Wallet Connect Modal", "Governance Proposal Feed", "Security Audit Badges"],
    searchKeywords: ["Web3 website template", "crypto staking template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["3d-websites-convert-better", "best-saas-templates-2026"],
  },
  "venture-fund-capital": {
    targetIntent: "Next.js Venture Capital & Investor Portal Template",
    useCase: "Venture capital partnerships, angel syndicates, and private equity funds.",
    includedSections: ["Portfolio Company Grid", "Investment Thesis Bento", "Pitch Deck Submission Intake", "Limited Partner (LP) Login Teaser", "Partner Profiles"],
    searchKeywords: ["venture capital website template", "investor portal template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "healthpulse-telehealth": {
    targetIntent: "Next.js HealthTech & Telehealth Website Template",
    useCase: "Virtual healthcare providers, digital pharmacies, and asynchronous doctor consults.",
    includedSections: ["Symptom Checker Flow", "Video Consultation Booking", "Prescription Delivery Status", "Physician Network Profiles", "HIPAA Compliance Guarantee"],
    searchKeywords: ["telehealth website template", "clinic website template", "Next.js templates", "React templates", "Tailwind templates"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "sentinel-security": {
    targetIntent: "Next.js Cybersecurity Website Template (React & Tailwind)",
    useCase: "Enterprise cybersecurity companies, MSSPs, SOC teams, and SaaS security vendors.",
    includedSections: ["Home", "Services", "Threat Monitoring", "Security Solutions", "Case Studies", "Pricing", "Contact"],
    searchKeywords: ["cybersecurity website template", "SOC 2 template", "security platform Next.js", "MSSP template", "Tailwind cybersecurity"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "voyage-atlas": {
    targetIntent: "Next.js Travel Agency & Tour Operator Website Template",
    useCase: "Boutique travel agencies, luxury expedition operators, safari organizers, and tour guides.",
    includedSections: ["Home", "Destinations", "Tours", "Tour Detail", "Travel Guide", "About", "Contact"],
    searchKeywords: ["travel agency template", "tour operator Next.js", "destination itinerary template", "expedition booking React"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  },
  "supportdesk": {
    targetIntent: "Next.js Helpdesk & Customer Support SaaS Template",
    useCase: "B2B SaaS companies, IT support teams, customer success agencies, and helpdesk startups.",
    includedSections: ["Home", "Product", "Features", "Inbox/Dashboard", "Knowledge Base", "Integrations", "Pricing"],
    searchKeywords: ["helpdesk template", "customer support SaaS", "ticketing system Next.js", "shared inbox template", "knowledge base React"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "stayora": {
    targetIntent: "Next.js Boutique Hotel & Luxury Resort Website Template",
    useCase: "Boutique hotels, luxury villas, eco-resorts, and hospitality operators.",
    includedSections: ["Home", "Rooms", "Room Detail", "Amenities", "Gallery", "Experiences", "Booking CTA", "Contact"],
    searchKeywords: ["hotel website template", "resort template Next.js", "hospitality booking template", "boutique villa React"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "cartly-commerce": {
    targetIntent: "Next.js Modern E-Commerce Storefront Template",
    useCase: "Direct-to-consumer lifestyle brands, fashion apparel boutiques, and modern e-commerce stores.",
    includedSections: ["Home", "Shop", "Category", "Product Detail", "Cart", "Offers", "About", "Contact"],
    searchKeywords: ["ecommerce template Next.js", "online store React", "apparel shop template", "Tailwind ecommerce", "cart drawer template"],
    relatedBlogSlugs: ["best-saas-templates-2026", "tailwind-framer-motion-animations"],
  },
  "freshbite": {
    targetIntent: "Next.js Restaurant & Food Delivery Website Template",
    useCase: "Artisan restaurants, ghost kitchens, meal-prep services, and fast-casual food brands.",
    includedSections: ["Home", "Menu", "Order Online", "Meal Deals", "Delivery Zones", "Story", "Reviews", "Contact"],
    searchKeywords: ["restaurant website template", "food delivery Next.js", "online ordering menu React", "culinary website Tailwind"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "fleetflow": {
    targetIntent: "Next.js Fleet Management & Logistics Website Template",
    useCase: "Commercial fleet operators, logistics companies, freight forwarders, and 3PL dispatchers.",
    includedSections: ["Home", "Fleet Dashboard", "Vehicles", "Drivers", "Maintenance", "Analytics", "Pricing"],
    searchKeywords: ["fleet management template", "logistics website Next.js", "telematics dashboard React", "freight dispatcher template"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "insurely": {
    targetIntent: "Next.js Insurance Platform & Brokerage Website Template",
    useCase: "Digital insurance agencies, insurtech platforms, independent brokerages, and policy advisers.",
    includedSections: ["Home", "Coverage Plans", "Instant Quote", "Claims Portal", "Policy Finder", "Why Us", "Support"],
    searchKeywords: ["insurance website template", "insurtech Next.js", "policy quote calculator React", "insurance agency Tailwind"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "fundora": {
    targetIntent: "Next.js Wealth Management & Investment Advisory Template",
    useCase: "Fiduciary wealth advisors, private capital managers, family offices, and fintech investment platforms.",
    includedSections: ["Home", "Portfolio Strategies", "Wealth Advisory", "Retirement", "Market Insights", "Fees", "Schedule Call"],
    searchKeywords: ["wealth management template", "financial advisor Next.js", "investment platform React", "fintech advisory Tailwind"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "scalehr": {
    targetIntent: "Next.js HR Platform & Employee Management Template",
    useCase: "HR tech startups, employee management platforms, payroll solutions, and people operations software.",
    includedSections: ["Home", "People Directory", "Payroll Engine", "Time & Attendance", "Performance", "Benefits", "Pricing"],
    searchKeywords: ["HR software template", "employee directory Next.js", "payroll platform React", "people ops template Tailwind"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "nonprofitly": {
    targetIntent: "Next.js Nonprofit, NGO & Charity Website Template",
    useCase: "Nonprofit organizations, charitable foundations, humanitarian relief NGOs, and community initiatives.",
    includedSections: ["Home", "Our Missions", "Impact Reports", "Campaigns", "Transparent Finances", "Volunteer", "Donate"],
    searchKeywords: ["nonprofit website template", "charity donation Next.js", "NGO impact template React", "fundraising campaign Tailwind"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "eventspace": {
    targetIntent: "Next.js Tech Conference & Summit Event Template",
    useCase: "Tech conferences, design summits, industry exhibitions, hackathons, and corporate festivals.",
    includedSections: ["Home", "Event Agenda", "Keynote Speakers", "Venue Map", "Sponsor Hall", "Tickets", "FAQ"],
    searchKeywords: ["conference website template", "event summit Next.js", "keynote speaker agenda React", "ticket registration template"],
    relatedBlogSlugs: ["best-saas-templates-2026", "tailwind-framer-motion-animations"],
  },
  "adpilot": {
    targetIntent: "Next.js Performance Marketing & Ad Agency Template",
    useCase: "Growth marketing agencies, paid media consultancies, performance marketing firms, and PPC studios.",
    includedSections: ["Home", "Campaign Optimizer", "Omnichannel Ads", "Creative Lab", "Client ROI", "Case Studies", "Audit"],
    searchKeywords: ["marketing agency template", "ad agency Next.js", "performance marketing React", "ROAS calculator template"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
  "homenest": {
    targetIntent: "Next.js Interior Design & Home Renovation Template",
    useCase: "Interior design studios, residential architects, home renovation contractors, and luxury kitchen designers.",
    includedSections: ["Home", "Design Styles", "Renovation Portfolio", "Budget Calculator", "Material Library", "Process", "Consultation"],
    searchKeywords: ["interior design template", "home renovation Next.js", "architectural portfolio React", "room calculator template"],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "best-saas-templates-2026"],
  },
  "streamline": {
    targetIntent: "Next.js Team Productivity & Collaboration App Template",
    useCase: "Productivity SaaS, async work tools, sprint collaboration platforms, and agile team workspaces.",
    includedSections: ["Home", "Kanban Boards", "Sprint Planner", "Async Huddles", "Docs Workspace", "App Integrations", "Pricing"],
    searchKeywords: ["productivity app template", "kanban board Next.js", "team collaboration React", "sprint planner Tailwind"],
    relatedBlogSlugs: ["best-saas-templates-2026", "how-to-launch-saas-landing-page"],
  },
};

/**
 * Returns distinct SEO search-intent data for a template, with graceful fallback.
 */
export function getTemplateSeo(template: TemplateItem): TemplateSeoData {
  const existing = TEMPLATE_SEO_REGISTRY[template.id];
  if (existing) return existing;

  // Fallback generation based on category
  const targetIntent = `Next.js ${template.category} Website Template (React & Tailwind)`;

  return {
    targetIntent,
    useCase: `Founders, agencies, and developers building modern web experiences in the ${template.category} space.`,
    includedSections: ["Responsive Hero Viewport", "Feature Bento Grid", "Conversion CTA Module", "Dark Theme Canvas", "Interactive Preview"],
    searchKeywords: ["Next.js templates", "React templates", "Tailwind templates", `${template.category} template`],
    relatedBlogSlugs: ["how-to-launch-saas-landing-page", "tailwind-framer-motion-animations"],
  };
}

export function getTemplateSeoTitle(template: TemplateItem): string {
  const seo = getTemplateSeo(template);
  return `${template.name} — ${seo.targetIntent}`;
}

export function getTemplateSeoDescription(template: TemplateItem): string {
  const seo = getTemplateSeo(template);
  const isFree = template.tier === "free";
  const priceStr = isFree ? "Free download" : `${template.price} one-time payment`;
  return `${template.name} is a production-ready Next.js 15 template designed for ${seo.useCase} Includes ${template.features.slice(0, 3).join(", ")}. ${priceStr} with full commercial license included.`;
}

export function getTemplateSeoKeywords(template: TemplateItem): string[] {
  const seo = getTemplateSeo(template);
  const baseKeywords = [
    template.name,
    seo.targetIntent,
    `${template.category} template`,
    "Next.js templates",
    "React templates",
    "Tailwind templates",
    "Framer Motion",
    "buy website template",
  ];
  return Array.from(new Set([...baseKeywords, ...seo.searchKeywords]));
}
