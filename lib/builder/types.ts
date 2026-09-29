/**
 * DimensionUI Page Builder Type Definitions
 */

export type BlockType =
  | "hero"
  | "features"
  | "cta"
  | "footer"
  | "navbar"
  | "logocloud"
  | "testimonials"
  | "pricing"
  | "faq";

export type FieldType = "text" | "textarea" | "select" | "boolean" | "color" | "number";

export interface EditableField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface BlockDefinition<TProps = Record<string, any>> {
  type: BlockType;
  name: string;
  category: "Header" | "Content" | "Conversion" | "Navigation";
  description: string;
  defaultProps: TProps;
  fields: EditableField[];
}

export interface BlockInstance<TProps = Record<string, any>> {
  id: string;
  type: BlockType;
  variant?: string;
  props: TProps;
}

export interface DesignTokens {
  preset: "obsidian" | "midnight" | "slate" | "electric-cyan";
  primaryAccent: string;
  secondaryAccent: string;
  bgCanvas: string;
  bgSurface: string;
  textColor: string;
  textDimColor: string;
  fontFamily: "Inter" | "Outfit" | "Plus Jakarta Sans" | "System";
  borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

export interface PageSchema {
  id: string;
  version: string;
  title: string;
  description?: string;
  tokens: DesignTokens;
  blocks: BlockInstance[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    generator: string;
  };
}

// Props Interfaces for the 4 POC Blocks
export interface HeroBlockProps {
  badge: string;
  headline: string;
  highlightText: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  align: "center" | "left";
  showMockup: boolean;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesBlockProps {
  eyebrow: string;
  headline: string;
  description: string;
  columns: "2" | "3" | "4";
  features: FeatureItem[];
}

export interface CtaBlockProps {
  eyebrow: string;
  headline: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryText: string;
  layout: "centered" | "split";
}

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterBlockProps {
  brandName: string;
  tagline: string;
  copyrightText: string;
  columns: FooterColumn[];
}
