function SectionTitle({ children }) {
  return (
    <div>
      <h2 className="section-title">{children}</h2>
      <p className="italic text-sm text-gray-500 mt-1">Every section is a door. Ti Amo Energy invites you to walk through it.</p>
    </div>
  );
}

export default function PrinciplesPage() {
  return (
    <main className="bg-white">
      <section className="bg-[#0f0f10] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Principles</h1>
          <p className="mt-3 text-gray-300 max-w-3xl">Anchor Mentality, Language that Invites, and Shared Humanity — Sacred Neutrality in practice.</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle>Principles of Sacred Neutrality</SectionTitle>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-2">Anchor Mentality</h3>
              <p>Remain rooted in presence, truth and openness—be the lighthouse, not the megaphone.</p>
              <p className="mt-2 text-sm text-gray-500">“Justification is Demonstration.”</p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">Language that Invites</h3>
              <p>Offer resonance, not resistance; insights that invite, never instruct.</p>
              <p className="mt-2 text-sm text-gray-500">“When words remain neutral, they become mirrors for all.”</p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">Shared Humanity</h3>
              <p>Neutrality is the amplification of shared humanity—not the absence of feeling.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}