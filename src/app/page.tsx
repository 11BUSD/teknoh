"use client";

import { FormEvent, useState } from "react";
import type { PublicEngineResponse } from "@/lib/contracts";

type Opportunity = PublicEngineResponse["opportunities"][number];

export default function Home() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PublicEngineResponse | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "accepted" | "rejected">>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    setFeedback({});
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Search failed");
      setResult(body);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  async function sendFeedback(item: Opportunity, outcome: "accepted" | "rejected") {
    if (!result || feedback[item.id]) return;
    setFeedback((current) => ({ ...current, [item.id]: outcome }));
    try {
      const response = await fetch("/api/outcomes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ requestId: result.requestId, opportunityId: item.id, outcome }),
      });
      if (!response.ok) throw new Error();
    } catch {
      setFeedback((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });
    }
  }

  return <main>
    <section className="shell heroShell">
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Teknoh home"><span className="brandMark">T</span>Teknoh</a>
        <div className="navLinks"><a href="#principles">How it works</a><span className="statusDot">Live research · human action</span></div>
      </nav>

      <div className="hero" id="top">
        <div className="heroCopy">
          <div className="eyebrow"><span />Evidence-backed opportunity intelligence</div>
          <h1>Find the demand hiding in public.</h1>
          <p>Describe what you sell. Teknoh looks for current, public evidence that an organization has the problem you solve—then rejects weak signals before they reach you.</p>
          <div className="proofRow" aria-label="Product boundaries">
            <span>Public evidence only</span><span>Human-reviewed actions</span><span>No scraped lead lists</span>
          </div>
        </div>

        <form className="searchCard" onSubmit={submit} aria-busy={busy}>
          <div className="cardTop"><div><span className="step">Opportunity thesis</span><h2>What should Teknoh look for?</h2></div><span className="secure">Server protected</span></div>
          <div className="field"><label htmlFor="offer">What do you sell?</label><textarea id="offer" name="offer" required maxLength={800} placeholder="AI receptionists for dental clinics" /></div>
          <div className="fieldGrid">
            <div className="field"><label htmlFor="buyer">Who buys it?</label><input id="buyer" name="buyer" required maxLength={400} placeholder="Independent dental clinics" /></div>
            <div className="field"><label htmlFor="geography">Where?</label><input id="geography" name="geography" required maxLength={200} placeholder="Ontario, Canada" /></div>
          </div>
          <div className="field"><label htmlFor="price">Typical contract value <span>optional</span></label><input id="price" name="price" maxLength={120} placeholder="$300–$1,000/month" /></div>
          <div className="field"><label htmlFor="problems">What signals would reveal the problem?</label><textarea id="problems" name="problems" required maxLength={1200} placeholder="Missed calls, after-hours intake, appointment scheduling" /></div>
          <button className="cta" disabled={busy}>{busy ? <><span className="spinner" />Reviewing public evidence…</> : <>Find evidence <span aria-hidden="true">↗</span></>}</button>
          <p className="micro">Teknoh recommends research targets. It never contacts, purchases, publishes, or changes permissions on your behalf.</p>
          <div className="message" aria-live="polite">{error ? <p className="error">{error}</p> : null}</div>
        </form>
      </div>
    </section>

    {result ? <section className="resultsSection" aria-live="polite">
      <div className="shell">
        <div className="sectionHeading"><div><span className="step">Research result</span><h2>{result.opportunities.length} evidence-backed {result.opportunities.length === 1 ? "opportunity" : "opportunities"}</h2></div><p>{result.rejectedCount} weaker signals were rejected.</p></div>
        <div className="resultsGrid">
          {result.opportunities.map((item) => <article className="resultCard" key={item.id}>
            <div className="resultHeader"><div><span className={`classification ${item.classification.toLowerCase()}`}>{item.classification.replaceAll("_", " ")}</span><h3>{item.company}</h3></div><div className="score"><strong>{item.score}</strong><span>/100</span></div></div>
            <p className="problem">{item.observedProblem}</p>
            <div className="evidenceBlock"><span className="label">Observed facts</span><ul>{item.observedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div>
            <div className="inference"><span className="label">Inference</span><p>{item.inference}</p></div>
            {item.negativeEvidence.length ? <div className="negative"><span className="label">What weakens it</span><p>{item.negativeEvidence.join(" ")}</p></div> : null}
            <div className="sourceList"><span className="label">Sources</span>{item.evidence.map((evidence) => <a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer" key={evidence.sourceUrl}>{new URL(evidence.sourceUrl).hostname.replace(/^www\./, "")}<span>↗</span></a>)}</div>
            <div className="nextAction"><span className="label">Suggested next step</span><p>{item.suggestedNextAction}</p></div>
            <div className="resultFooter"><span>{Math.round(item.confidence * 100)}% confidence</span><div className="feedback"><span>Useful?</span><button type="button" aria-label={`Mark ${item.company} useful`} aria-pressed={feedback[item.id] === "accepted"} className={feedback[item.id] === "accepted" ? "selected" : ""} onClick={() => sendFeedback(item,"accepted")}>Yes</button><button type="button" aria-label={`Mark ${item.company} not useful`} aria-pressed={feedback[item.id] === "rejected"} className={feedback[item.id] === "rejected" ? "selected" : ""} onClick={() => sendFeedback(item,"rejected")}>No</button></div></div>
          </article>)}
        </div>
      </div>
    </section> : null}

    <section className="principlesSection" id="principles">
      <div className="shell"><div className="sectionHeading"><div><span className="step">Built for signal, not noise</span><h2>A smaller, defensible answer.</h2></div><p>Opportunity research with explicit boundaries.</p></div>
        <div className="principles">
          <article><span>01</span><h3>Evidence before inference</h3><p>Facts, estimates, and unknowns stay visibly distinct, with links back to public sources.</p></article>
          <article><span>02</span><h3>Economics before volume</h3><p>Investigation stops when another search is unlikely to justify its marginal cost.</p></article>
          <article><span>03</span><h3>Humans before action</h3><p>Teknoh surfaces a decision. Outreach and every consequential action remain yours.</p></article>
        </div>
      </div>
    </section>

    <footer className="footer shell"><a className="brand" href="#top"><span className="brandMark">T</span>Teknoh</a><p>Evidence, not automation theatre.</p><a href="/privacy">Privacy</a></footer>
  </main>;
}
