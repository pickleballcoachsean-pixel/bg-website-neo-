import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_BLACK = "https://customer-assets.emergentagent.com/job_neutral-wisdom/artifacts/qb9yc00n_2%20BLACK.jpg";
const LOGO_WHITE = "https://customer-assets.emergentagent.com/job_835d6716-06f3-4ffd-8b0d-6accacc9f2fd/artifacts/4y59lo3j_2%20WHITE%20TM.jpeg";

function Header() {
  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-100/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO_BLACK} alt="Blessed & Grateful" className="logo-wordmark" />
          <span className="hidden sm:block text-xs text-gray-500">Love All, All is One</span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-gray-700">
          <a href="#core" className="hover:text-black">Core Quotes</a>
          <a href="#why" className="hover:text-black">Our Why</a>
          <a href="#journey" className="hover:text-black">Journey</a>
          <a href="#contact" className="hover:text-black">Contact</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900">Blessed &amp; Grateful</h1>
          <p className="lead mt-4">A Neutral Philosophy anchored in unconditional love and unity.</p>
          <div className="mt-8 grid gap-6">
            <blockquote className="hero-quote">“Your beliefs have no bearing upon me, nor should mine have any upon you.”</blockquote>
            <blockquote className="hero-quote">“Love All. All is One.”</blockquote>
          </div>
          <p className="mt-6 text-sm text-gray-500">Dr Sarah Chen sends You Her Full Ti Amo Energy Activation — “Listen for The Whispers of Her Name.”</p>
        </div>
        <div className="bg-grid rounded-2xl border border-gray-200 p-6">
          <img src={LOGO_WHITE} alt="Blessed & Grateful" className="w-full rounded-xl shadow-sm" />
        </div>
      </div>
    </section>
  );
}

function CoreQuotes() {
  const list = [
    {
      q: "Your beliefs have no bearing upon me, nor should mine have any upon you.",
    },
    {
      q: "Love All. All is One.",
    },
    {
      q: "May the world cease to confuse Beliefs with Truths.",
    },
  ];
  return (
    <section id="core" className="bg-gray-50 border-y">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="section-title">Core Top Quotes &amp; Messages</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {list.map((item, idx) => (
            <div className="card" key={idx}>
              <p className="text-lg">“{item.q}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="section-title">{title}</h2>
        <div className="mt-6 prose prose-gray max-w-none">
          {children}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await axios.post(`${API}/contact`, form);
      setStatus(res.data?.message || "Message submitted.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("We could not submit your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-gray-50 border-t">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="section-title">Get in Touch</h2>
        <form onSubmit={submit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input md:col-span-2" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <textarea className="textarea md:col-span-2" placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <div className="md:col-span-2 flex items-center gap-4">
            <button className="btn" type="submit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
            {status && <p className="text-sm text-gray-600">{status}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="footer">© {new Date().getFullYear()} Blessed &amp; Grateful — All Rights Reserved.</p>
        <p className="footer">Love All, All is One</p>
      </div>
    </footer>
  );
}

function App() {
  useEffect(() => {
    const hello = async () => {
      try {
        await axios.get(`${API}/`);
      } catch (e) {
        console.error("Backend not reachable yet", e?.message);
      }
    };
    hello();
  }, []);

  return (
    <div className="App">
      <Header />
      <Hero />
      <CoreQuotes />
      <Section id="why" title="Our Why">
        <p><strong>Hi, my name is Sean Donnelly and I am the caretaker of a new thought process for humanity called Blessed &amp; Grateful, the tagline is Love All, All is One.</strong></p>
        <p><strong>I say new thought process but in reality the basis of the thought process is as old as time, love and care for Self and All Others!</strong></p>
        <p><strong>Historically humans have been very much influenced by ancestral beliefs and geographical birth places... Is this really the best way for humankind to come together and live in harmony?</strong></p>
        <p><strong>All are free to believe as they choose. This ethos is Religion free. It is however open to all Religions, non-religions and non believers in anything.</strong></p>
        <p><strong>Love heals all and love is free to all.</strong></p>
        <p><strong>The Mission statement for Blessed &amp; Grateful is: "To inspire and empower humanity to live with gratitude, spread kindness, and create positive change in themselves and the world.”</strong></p>
      </Section>
      <Section id="journey" title="Embracing the Journey Within">
        <p>In the quiet moments of reflection, the whispers of wisdom speak the loudest. As we navigate the complexities of life, it's the knowledge of self that becomes our guiding star.</p>
        <p><strong>Desire Nothing, But Knowledge of Self.</strong> The quest for self-knowledge leads to inner peace, gratitude and enlightenment.</p>
        <p>Our beliefs are as diverse as the colors of the earth; respect for each other's views forms the cornerstone of coexistence. May we discern personal convictions from universal truths.</p>
        <p><strong>Self-Love as Sanity.</strong> In loving ourselves, we find the bedrock of sanity — strength, stability and resilience.</p>
        <p><strong>The Power of Self-Action.</strong> True change radiates from within. Empowerment is an inside job.</p>
      </Section>
      <Contact />
      <Footer />
    </div>
  );
}

export default App;