const fs = require('fs');
const path = require('path');

const siteTsPath = path.join(__dirname, '..', 'lib', 'site.ts');
let content = fs.readFileSync(siteTsPath, 'utf8');

// 1. Add IntegrationStatus and TemplateIntegration types
const typeSearch = `export type TemplateItem = {`;
const typeReplacement = `export type IntegrationStatus = "Included" | "Configured" | "Example only" | "Compatible";

export type TemplateIntegration = {
  name: string;
  status: IntegrationStatus;
  description: string;
};

export type TemplateItem = {
  integrations?: TemplateIntegration[];`;

if (!content.includes('export type IntegrationStatus =')) {
  content = content.replace(typeSearch, typeReplacement);
}

// 2. Add getTemplateIntegrations helper function
const helperSearch = `export function getTemplateCompatibility(template: TemplateItem): CompatibilityEntry[] {`;
const helperReplacement = `export function getTemplateIntegrations(template: TemplateItem): TemplateIntegration[] {
  return template.integrations ?? [];
}

export function getTemplateCompatibility(template: TemplateItem): CompatibilityEntry[] {`;

if (!content.includes('export function getTemplateIntegrations')) {
  content = content.replace(helperSearch, helperReplacement);
}

// 3. Define integrations mapping for all templates
const INTEGRATIONS_MAP = {
  "aether-ai-saas": [
    { name: "Resend", status: "Example only", description: "Interactive email waitlist capture and confirmation flow" },
    { name: "Supabase", status: "Compatible", description: "App Router database and authentication ready" }
  ],
  "serenity-wellness": [
    { name: "Resend", status: "Example only", description: "Appointment booking and therapy consultation request intake" }
  ],
  "nova-minimal-portfolio": [
    { name: "GitHub", status: "Included", description: "Live GitHub activity timeline, commit feed, and repository project cards" },
    { name: "Resend", status: "Example only", description: "Direct developer hire and project inquiry contact sheet" }
  ],
  "app-launch-lp": [
    { name: "App Store & Google Play", status: "Included", description: "Official store badge links, download deep-links, and mobile app routing" }
  ],
  "simple-link-bio": [
    { name: "Resend", status: "Example only", description: "Creator audience email newsletter sign-up and link tracking" }
  ],
  "peak-fitness": [
    { name: "PayPal", status: "Example only", description: "Interactive membership tier checkout flow and class registration" }
  ],
  "azure-apartments": [
    { name: "Resend", status: "Example only", description: "Luxury leasing tour calendar and resident intake inquiries" }
  ],
  "apex-dental-clinic": [
    { name: "Resend", status: "Example only", description: "Multi-step patient dental intake and appointment stepper" }
  ],
  "precision-roofing": [],
  "aura-beauty-salon": [],
  "nexus-coworking": [
    { name: "Resend", status: "Example only", description: "Coworking day pass booking and private conference room scheduler" }
  ],
  "horizon-law-firm": [
    { name: "Resend", status: "Example only", description: "Confidential attorney consultation and case intake form" }
  ],
  "velvet-bistro": [
    { name: "Resend", status: "Example only", description: "Table reservation widget and private event catering inquiries" }
  ],
  "zenith-accounting": [
    { name: "Supabase", status: "Configured", description: "Pre-wired secure client tax portal authentication architecture" }
  ],
  "urban-architecture": [],
  "petpaws-vet": [
    { name: "Resend", status: "Example only", description: "Veterinary pet intake and online vaccination appointment booking" }
  ],
  "luxe-auto-detailing": [],
  "summit-event": [
    { name: "PayPal", status: "Example only", description: "Conference ticket tier pass checkout and attendee registration" }
  ],
  "prism-photo-studio": [
    { name: "Resend", status: "Example only", description: "Commercial photo shoot date availability inquiry form" }
  ],
  "greenthumb-landscape": [
    { name: "Resend", status: "Example only", description: "Residential landscaping yard estimate form with property specs" }
  ],
  "cloudscale-analytics": [
    { name: "PostHog", status: "Compatible", description: "Product telemetry, real-time funnel metrics, and user event tracking" },
    { name: "PayPal", status: "Compatible", description: "Monthly and annual SaaS billing tier checkout compatibility" }
  ],
  "enterprise-b2b-agency": [
    { name: "Resend", status: "Example only", description: "Branching enterprise lead qualification and ROI calculator intake" }
  ],
  "ai-copilot-studio": [
    { name: "Supabase", status: "Compatible", description: "Persistent AI conversation history and user session authentication" }
  ],
  "fintech-neobank": [
    { name: "PayPal", status: "Compatible", description: "Digital card payments, transfer fee calculator, and currency settlement" }
  ],
  "devflow-hub": [
    { name: "GitHub", status: "Included", description: "SDK release badge integration, npm links, and open-source repo links" }
  ],
  "pulse-analytics": [
    { name: "PostHog", status: "Compatible", description: "Infrastructure telemetry and server cluster latency monitoring" }
  ],
  "edulearn-academy": [
    { name: "PayPal", status: "Example only", description: "Masterclass cohort enrollment and course syllabus checkout" }
  ],
  "saas-billing-hub": [
    { name: "PayPal", status: "Configured", description: "Multi-seat pricing multiplier, addon calculations, and recurring billing" },
    { name: "Supabase", status: "Configured", description: "Subscriber account records, seat allocations, and invoice history" }
  ],
  "talenthire-ats": [
    { name: "Resend", status: "Example only", description: "Department applicant resume submission and candidate notification" },
    { name: "Supabase", status: "Compatible", description: "Candidate pipeline database and hiring manager stage tracking" }
  ],
  "cryptostaking-protocol": [
    { name: "Web3 / WalletConnect", status: "Example only", description: "Simulated Web3 wallet connection, APY compounding slider, and staking UI" }
  ],
  "venture-fund-capital": [
    { name: "Resend", status: "Example only", description: "Founder pitch deck submission portal and investment thesis filter" }
  ],
  "healthpulse-telehealth": [
    { name: "Supabase", status: "Configured", description: "Telehealth patient authentication, virtual visit room, and prescription records" }
  ],
};

// 4. Inject `integrations` into each template definition
for (const [id, integrations] of Object.entries(INTEGRATIONS_MAP)) {
  const integrationsJson = JSON.stringify(integrations, null, 4)
    .split('\n')
    .map((line, idx) => idx === 0 ? line : '    ' + line)
    .join('\n');

  // Check if template already has integrations
  const idRegex = new RegExp(`(id:\\s*"${id}",[\\s\\S]*?mockupType:\\s*"[^"]+",)`);
  if (idRegex.test(content)) {
    // Avoid double injecting
    if (!content.includes(`id: "${id}",\n    integrations:`)) {
      content = content.replace(idRegex, `$1\n    integrations: ${integrationsJson},`);
    }
  }
}

fs.writeFileSync(siteTsPath, content, 'utf8');
console.log('Successfully updated lib/site.ts with template integrations!');
