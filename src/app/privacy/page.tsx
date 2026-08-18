export const metadata = { title: "Privacy — Teknoh" };

export default function PrivacyPage() {
  return <main className="shell" style={{maxWidth:760,paddingTop:80,paddingBottom:100}}>
    <a className="brand" href="/"><span className="brandMark">T</span>Teknoh</a>
    <div className="step" style={{marginTop:80}}>Launch privacy notice</div>
    <h1 style={{fontSize:56,letterSpacing:"-.055em",marginBottom:24}}>Privacy, by restraint.</h1>
    <div style={{color:"#a9bbb2",fontSize:16,lineHeight:1.75}}>
      <p>Teknoh uses the opportunity thesis you submit to research public evidence. Do not submit credentials, private datasets, sensitive personal information, or information you are not authorized to use.</p>
      <p>The service stores a one-way hash of the thesis for operational deduplication and may retain evidence-backed results, outcome labels, cost, latency, and failure metadata for up to 30 days. Raw IP addresses are converted to a keyed hash before they reach the private engine.</p>
      <p>Teknoh does not automatically contact prospects, purchase services, create accounts, publish material, or change permissions. Source links can lead to third-party sites governed by their own terms and privacy practices.</p>
      <p>This launch notice must be reviewed before broad public production use and updated when accounts, billing, or additional data connectors are introduced.</p>
    </div>
  </main>;
}
