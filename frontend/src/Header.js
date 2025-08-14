import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function MobilePanel({ open, onClose }) {
  const panelRef = useRef(null);

  // Focus management + Escape close + Tab loop focus trap
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const keyHandler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll(
          "a, button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])"
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keyHandler);
    // Focus first focusable link
    setTimeout(() => {
      const first = panelRef.current?.querySelector("a, button");
      first?.focus();
    }, 0);
    return () => {
      document.removeEventListener("keydown", keyHandler);
      prev && prev.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      {/* Backdrop to close on outside click */}
      <div className="fixed inset-0 z-40 md:hidden" onClick={onClose} aria-hidden="true" />
      <div
        className="md:hidden absolute left-0 right-0 top-full bg-white border-b shadow-sm z-50"
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2" ref={panelRef}>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/principles" onClick={onClose}>Principles</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/journey" onClick={onClose}>Journey</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/archive" onClick={onClose}>Archive</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/podcast" onClick={onClose}>Podcast</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/talk" onClick={onClose}>Talk with Sarah</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/dr-chen" onClick={onClose}>Meet Dr. Chen</NavLink>
        </div>
      </div>
    </>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cx("sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b", scrolled && "shadow-sm")}> 
      <div className="mx-auto max-w-6xl px-4 h-14 md:h-16 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-white.png" alt="Blessed & Grateful" className="h-7 md:h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/principles">Principles</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/journey">Journey</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/archive">Archive</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/podcast">Podcast</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/talk">Talk with Sarah</NavLink>
          <NavLink className={({isActive}) => cx("navlink", isActive && "active")} to="/dr-chen">Meet Dr. Chen</NavLink>
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded border border-gray-200"
          aria-controls="mobile-menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
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