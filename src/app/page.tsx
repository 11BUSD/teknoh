export default function Home() {
  return <main>
    <section className="shell heroShell">
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Teknoh home"><span className="brandMark">T</span>Teknoh</a>
        <div className="navLinks"><a href="#principles">How it works</a><span className="statusDot">Live research · human action</span></div>
      </nav>

      <div className="hero" id="top">
        <div className="heroCopy">
          <div className="eyebrow"><span />Evidence-backed opportunity intelligence</div>
          <h1>Find the opportunities worth a closer look.</h1>
          <p>Describe the outcome you want and the capabilities you can bring. Teknoh checks current public evidence, rejects weak fits, and shows what deserves human review.</p>
          <div className="proofRow" aria-label="Product boundaries">
            <span>Public evidence only</span><span>Human-reviewed actions</span><span>No scraped lead lists</span>
          </div>
        </div>

        <div className="searchCard trialCard">
          <div className="cardTop"><div><span className="step">One free opportunity preview</span><h2>See whether Teknoh fits your business before paying.</h2></div><span className="secure">No card</span></div>
          <p className="trialLead">Create a verified account, describe your capabilities and limits, and receive one personalized screening showing:</p>
          <ol className="trialSteps"><li><span>01</span><div><strong>What appears to fit</strong><p>Your services, geography, project size, and business objective.</p></div></li><li><span>02</span><div><strong>What could disqualify it</strong><p>Licences, insurance, bonding, deadlines, and work you refuse.</p></div></li><li><span>03</span><div><strong>What research would check</strong><p>The official sources and evidence plan for a paid opportunity brief.</p></div></li></ol>
          <a className="cta" href="https://engine.teknoh.tech/customer">Build my free preview <span aria-hidden="true">↗</span></a>
          <p className="micro">One preview per verified account. It costs $0, makes no provider calls, starts no monitoring, and contacts nobody.</p>
        </div>
      </div>
    </section>

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
