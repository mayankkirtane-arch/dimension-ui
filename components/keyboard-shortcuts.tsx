"use client";

/**
 * Keyboard Shortcuts Handler
 * Mount once in layout.tsx. Handles:
 * - Press "/" to focus the gallery search
 * - Press "Escape" to close any open modal
 */
import { useEffect } from "react";

export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || tag === "select";

      // Press "/" to focus the gallery search input
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      // Press "Escape" to close any open modal / drawer (dispatch a custom event)
      if (e.key === "Escape") {
        document.dispatchEvent(new CustomEvent("close-all-modals"));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return null;
}
