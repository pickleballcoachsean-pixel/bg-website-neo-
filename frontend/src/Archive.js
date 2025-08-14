import { archiveCategories } from "./quotes";

function Category({ title, quotes }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="section-title">{title}</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <div className="card" key={i}>
              <p>“{q}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ArchivePage() {
  return (
    <main className="bg-white">
      <div className="bg-[#0f0f10] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Wisdom Archive</h1>
          <p className="mt-4 text-gray-300 max-w-3xl">A living collection of principles and messages from Blessed &amp; Grateful. Explore by category or simply wander and reflect.</p>
        </div>
      </div>
      {archiveCategories.map((c) => (
        <Category key={c.key} title={c.title} quotes={c.quotes} />
      ))}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-gray-500">Ti Amo Energy: an invitation to align with compassion, presence and continuity of love.</p>
      </div>
    </main>
  );
}