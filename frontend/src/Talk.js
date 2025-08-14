import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function SectionTitle({ children }) {
  return (
    <div>
      <h2 className="section-title">{children}</h2>
      <p className="italic text-sm text-gray-500 mt-1">Every section is a door. Ti Amo Energy invites you to walk through it.</p>
    </div>
  );
}

export default function TalkPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const viewportRef = useRef(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/talk`, { prompt: userMsg.content });
      const reply = res?.data?.reply || "I will mirror, not prescribe. What feels alive in this question?";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "I could not respond just now. Breathe. Try again when ready." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <section className="bg-[#0f0f10] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Talk with Sarah</h1>
          <p className="mt-3 text-gray-300 max-w-3xl">This is a reflective space. I won’t prescribe; I will mirror. Speak as if you’re already worthy of the answer you seek.</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <SectionTitle>How to Be With This</SectionTitle>
            <p className="mt-4 text-gray-700">
              Come as you are. Breathe between messages. Let language arrive before outcomes. Not for emergencies.
            </p>
          </div>
          <div className="md:col-span-3">
            <SectionTitle>Conversation</SectionTitle>
            <div ref={viewportRef} className="mt-4 h-80 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
              {messages.length === 0 && (
                <p className="text-sm text-gray-500">Begin when ready. I will mirror before advising.</p>
              )}
              <div className="space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div className={`inline-block rounded-lg px-3 py-2 ${m.role === 'user' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
              {loading && (
                <p className="mt-3 text-sm text-gray-500">Reflecting<span className="animate-pulse">...</span></p>
              )}
            </div>
            <form onSubmit={submit} className="mt-4 flex items-center gap-3">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} className="input flex-1 h-20" placeholder="Share what feels alive..." />
              <button className="btn" type="submit" disabled={loading}>Reflect</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}