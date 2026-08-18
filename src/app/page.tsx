"use client";

import { FormEvent, useState } from "react";

type Opportunity = { id: string; company: string; observedProblem: string; score: number; confidence: number; whyNow: string };

export default function Home() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Opportunity[]>([]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setItems([]);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/opportunities", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Search failed");
      setItems(body.opportunities ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : "Search failed"); }
    finally { setBusy(false); }
  }

  return <main className="shell">
    <nav className="nav"><div className="brand">Teknoh</div><div className="domain">teknoh.tech</div></nav>
    <section className="hero">
      <div>
        <div className="eyebrow">Opportunity intelligence</div>
        <h1>Find evidence of demand.</h1>
        <p>Describe what you sell. Teknoh looks for public evidence of organizations that may have the problem you solve, rejects weak signals, and returns a small set of opportunities you can inspect yourself.</p>
        <div className="principles">
          <div className="principle"><strong>Evidence first</strong><span>Every result is designed to be traceable to public evidence.</span></div>
          <div className="principle"><strong>Quality over volume</strong><span>Ten defensible opportunities beat ten thousand scraped names.</span></div>
          <div className="principle"><strong>You stay in control</strong><span>Teknoh recommends. Consequential actions require a human decision.</span></div>
        </div>
      </div>
      <form className="card" onSubmit={submit}>
        <div className="field"><label htmlFor="offer">What do you sell?</label><textarea id="offer" name="offer" required placeholder="AI receptionists for dental clinics" /></div>
        <div className="field"><label htmlFor="buyer">Who buys it?</label><input id="buyer" name="buyer" required placeholder="Independent dental clinics" /></div>
        <div className="field"><label htmlFor="geography">Where?</label><input id="geography" name="geography" required placeholder="Ontario, Canada" /></div>
        <div className="field"><label htmlFor="price">Typical contract value</label><input id="price" name="price" placeholder="$300–$1,000/month" /></div>
        <div className="field"><label htmlFor="problems">What problems make someone need it?</label><textarea id="problems" name="problems" required placeholder="Missed calls, after-hours intake, appointment scheduling" /></div>
        <button className="cta" disabled={busy}>{busy ? "Finding evidence…" : "Find opportunities"}</button>
        <div className="micro">Public information only. Teknoh does not automatically contact prospects from this interface.</div>
        {error ? <div className="error">{error}</div> : null}
        {items.length ? <div className="results">{items.map(item => <article className="result" key={item.id}><div className="resultHeader"><strong>{item.company}</strong><span className="score">{item.score}/100</span></div><p>{item.observedProblem}</p><div className="small">{item.whyNow} · confidence {Math.round(item.confidence*100)}%</div></article>)}</div> : null}
      </form>
    </section>
  </main>;
}
