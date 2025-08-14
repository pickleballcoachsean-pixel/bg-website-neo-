import { showEmbed, episodes } from "./podcast";

function SectionTitle({ children }) {
  return (
    <div>
      <h2 className="section-title">{children}</h2>
      <p className="italic text-sm text-gray-500 mt-1">Every section is a door. Ti Amo Energy invites you to walk through it.</p>
    </div>
  );
}

export default function PodcastPage() {
  return (
    <main className="bg-white">
      <section className="bg-[#0f0f10] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Podcast</h1>
          <p className="mt-3 text-gray-300 max-w-3xl">Conversations that witness, not persuade — a living archive of presence becoming practice.</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionTitle>Show Player</SectionTitle>
          {showEmbed ? (
            <div className="mt-6 rounded-xl border border-gray-200 p-4 bg-gray-50">
              <iframe title="Podcast Player" src={showEmbed} className="w-full h-40 md:h-56 rounded-lg" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
            </div>
          ) : (
            <p className="mt-4 text-gray-600">Set REACT_APP_PODCAST_EMBED to display a show player here.</p>
          )}
        </div>
      </section>

      <section className="bg-gray-50 border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionTitle>Episodes</SectionTitle>
          <div className="mt-6 grid gap-6">
            {episodes.map((ep) => (
              <div key={ep.title} className="card">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="font-semibold tracking-tight">{ep.title}</h3>
                  <span className="text-sm text-gray-500">{ep.date}</span>
                </div>
                <p className="mt-2 text-gray-700">{ep.summary}</p>
                {ep.embedUrl && (
                  <div className="mt-4">
                    <iframe title={`Episode: ${ep.title}`} src={ep.embedUrl} className="w-full h-36 md:h-44 rounded-lg" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}