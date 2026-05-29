"use client";

import { useState } from "react";
import SearchModal from "./search-modal";

export default function SearchIcon() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-black hover:text-neutral-500 transition-colors"
        aria-label="Rechercher"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}