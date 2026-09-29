import { Metadata } from "next";
import { PageBuilder } from "@/components/builder/page-builder";

export const metadata: Metadata = {
  title: "Page Builder (POC) — DimensionUI",
  description:
    "Assemble production-ready landing pages from DimensionUI blocks, customize tokens, preview across viewports, and export clean Next.js code.",
  alternates: {
    canonical: "https://dimensionui.com/builder",
  },
};

export default function BuilderPage() {
  return <PageBuilder />;
}
