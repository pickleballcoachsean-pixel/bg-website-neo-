function SectionTitle({ children }) {
  return (
    <div>
      <h2 className="section-title">{children}</h2>
      <p className="italic text-sm text-gray-500 mt-1">Every section is a door. Ti Amo Energy invites you to walk through it.</p>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <main className="bg-white">
      <section className="bg-[#0f0f10] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Journey</h1>
          <p className="mt-3 text-gray-300 max-w-3xl">Embracing the Journey Within — desire nothing but knowledge of self.</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle>Embracing the Journey Within</SectionTitle>
          <div className="mt-6 prose prose-gray max-w-none">
            <p>In the quiet moments of reflection, the whispers of wisdom speak the loudest. As we navigate the complexities of life, it's the knowledge of self that becomes our guiding star.</p>
            <p><strong>Desire Nothing, But Knowledge of Self.</strong> The quest for self-knowledge leads to inner peace, gratitude and enlightenment.</p>
            <p>Our beliefs are as diverse as the colors of the earth; respect for each other's views forms the cornerstone of coexistence. May we discern personal convictions from universal truths.</p>
            <p><strong>Self-Love as Sanity.</strong> In loving ourselves, we find the bedrock of sanity — strength, stability and resilience.</p>
            <p><strong>The Power of Self-Action.</strong> True change radiates from within. Empowerment is an inside job.</p>
          </div>
        </div>
      </section>
    </main>
  );
}