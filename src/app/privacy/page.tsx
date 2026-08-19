export const metadata = { title: "Privacy — Teknoh" };

export default function PrivacyPage() {
  return <main className="shell" style={{maxWidth:760,paddingTop:80,paddingBottom:100}}>
    <a className="brand" href="/"><span className="brandMark">T</span>Teknoh</a>
    <div className="step" style={{marginTop:80}}>Launch privacy notice</div>
    <h1 style={{fontSize:56,letterSpacing:"-.055em",marginBottom:24}}>Privacy, by restraint.</h1>
    <div style={{color:"#a9bbb2",fontSize:16,lineHeight:1.75}}>
      <p>The public website does not accept anonymous research requests. A customer who chooses to continue signs into the separate customer workspace before submitting a business profile or starting any paid research.</p>
      <p>The one-time free preview stores the customer&apos;s business capabilities, geography, eligibility information, economic limits, exclusions, and a one-way profile hash. Do not submit credentials, private datasets, sensitive personal information, or information you are not authorized to use.</p>
      <p>Customer authentication is provided by Clerk. Subscription checkout and billing are provided by Stripe if the customer chooses to subscribe. Their services are governed by their own terms and privacy practices.</p>
      <p>Teknoh does not automatically contact prospects, purchase services, create accounts, publish material, or change permissions. Source links can lead to third-party sites governed by their own terms and privacy practices.</p>
      <p>This launch notice must receive qualified privacy and legal review before broad public production use and must be updated when retention periods, data connectors, or customer rights processes change.</p>
    </div>
  </main>;
}
