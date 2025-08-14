import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function MobilePanel({ open, onClose }) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const first = panelRef.current?.querySelector("a,button");
    first?.focus();
    return () => { document.removeEventListener("keydown", onKey); prev && prev.focus(); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b shadow-sm" role="dialog" aria-modal="true">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2" ref={panelRef} onClick={onClose}>
        <NavLink className="navlink" to="/principles">Principles</NavLink>
        <NavLink className="navlink" to="/journey">Journey</NavLink>
        <NavLink className="navlink" to="/archive">Archive</NavLink>
        <NavLink className="navlink" to="/podcast">Podcast</NavLink>
        <NavLink className="navlink" to="/talk">Talk with Sarah</NavLink>
        <NavLink className="navlink" to="/dr-chen">Meet Dr. Chen</NavLink>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 md:h-16 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-white.png" alt="Blessed & Grateful" className="h-7 md:h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink className="navlink" to="/principles">Principles</NavLink>
          <NavLink className="navlink" to="/journey">Journey</NavLink>
          <NavLink className="navlink" to="/archive">Archive</NavLink>
          <NavLink className="navlink" to="/podcast">Podcast</NavLink>
          <NavLink className="navlink" to="/talk">Talk with Sarah</NavLink>
          <NavLink className="navlink" to="/dr-chen">Meet Dr. Chen</NavLink>
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded border border-gray-200"
          aria-controls="mobile-menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          {open ? "✕" : "☰"}
        </button>

        {/* Mobile panel */}
        <div id="mobile-menu">
          <MobilePanel open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}