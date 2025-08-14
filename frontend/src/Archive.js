import { useEffect, useRef, useState } from "react";
import { archiveCategories } from "./quotes";

function normalize(item) {
  if (typeof item === "string") return { q: item };
  return item;
}

function keyFor(item) {
  const it = normalize(item);
  return it.q;
}

function Modal({ open, onClose, quote }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll(
          "button, [href], input, textarea, [tabindex]:not([tabindex='-1'])",
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
    document.addEventListener("keydown", onKey);
    // focus first focusable
    setTimeout(() => {
      const first = dialogRef.current?.querySelector(
        "button, [href], input, textarea, [tabindex]:not([tabindex='-1'])",
      );
      first?.focus();
    }, 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev && prev.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  const { q, context, excerpt } = quote || {};
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="quote-title" aria-describedby="quote-body">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div ref={dialogRef} className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-2xl w-full p-6 relative">
          <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 text-gray-500 hover:text-black">✕</button>
          <h3 id="quote-title" className="text-xl font-semibold">“{q}”</h3>
          {context && (
            <p id="quote-body" className="mt-4 text-gray-700 whitespace-pre-line">{context}</p>
          )}
          {excerpt && (
            <blockquote className="mt-4 border-l-4 border-gray-200 pl-4 text-gray-700">{excerpt}</blockquote>
          )}
        </div>
      </div>
    </div>
  );
}

function Category({ title, quotes, onOpen }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="section-title">{title}</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quotes.map((raw) => {
            const item = normalize(raw);
            return (
              <button
                className="card text-left hover:shadow-md transition"
                key={keyFor(item)}
                onClick={() => onOpen(item)}
              >
                <p>“{item.q}”</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function ArchivePage() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const onOpen = (item) => { setCurrent(item); setOpen(true); };
  const onClose = () => setOpen(false);

  return (
    <main className="bg-white">
      <div className="bg-[#0f0f10] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Wisdom Archive</h1>
          <p className="mt-4 text-gray-300 max-w-3xl">A living collection of principles and messages from Blessed &amp; Grateful. Explore by category or simply wander and reflect.</p>
        </div>
      </div>
      {archiveCategories.map((c) => (
        <Category key={c.key} title={c.title} quotes={c.quotes} onOpen={onOpen} />
      ))}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-gray-500">Ti Amo Energy: an invitation to align with compassion, presence and continuity of love.</p>
      </div>
      <Modal open={open} onClose={onClose} quote={current} />
    </main>
  );
}