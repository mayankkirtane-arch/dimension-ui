"use client";

/**
 * AddToCartButton — Client component for adding a template to the cart.
 * Handles free tier (direct download) vs paid (add to cart).
 */
import { useCartStore } from "@/lib/store";
import type { TemplateItem } from "@/lib/site";
import { ShoppingCart, Download, Check } from "lucide-react";
import { useState } from "react";
import { PayPalCheckoutModal } from "@/components/paypal-checkout-modal";

export function AddToCartButton({ template }: { template: TemplateItem }) {
  const { items, addItem } = useCartStore();
  const [added, setAdded] = useState(false);
  const [isPayPalOpen, setIsPayPalOpen] = useState(false);
  const isInCart = items.some((i) => i.id === template.id);
  const isFree = template.tier === "free";

  const handleFreeDownload = () => {
    const content = `// DimensionUI Template: ${template.name}\n// Category: ${template.category}\n\nexport default function ${template.name.replace(/[^a-zA-Z0-9]/g, "")}() {\n  return (\n    <main className="min-h-screen bg-black text-white p-8">\n      <h1 className="text-4xl font-bold">${template.name}</h1>\n      <p className="mt-4 text-gray-400">${template.blurb}</p>\n    </main>\n  );\n}\n`;
    const blob = new Blob([content], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.id}-starter.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddToCart = () => {
    if (isInCart) return;
    addItem(template);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isFree) {
    return (
      <button
        onClick={handleFreeDownload}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3.5 text-sm font-bold text-white transition-all"
      >
        <Download className="size-4" />
        Download Free Template
      </button>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all ${
            isInCart || added
              ? "bg-emerald-600 cursor-default"
              : "bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110"
          }`}
        >
          {isInCart || added ? (
            <>
              <Check className="size-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              Add to Cart — {template.price}
            </>
          )}
        </button>
        <button
          onClick={() => setIsPayPalOpen(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] py-3 text-sm font-medium text-white/70 hover:text-white transition-all"
        >
          Buy with PayPal — {template.price}
        </button>
      </div>

      <PayPalCheckoutModal
        template={template}
        isOpen={isPayPalOpen}
        onClose={() => setIsPayPalOpen(false)}
      />
    </>
  );
}
