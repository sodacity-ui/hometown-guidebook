import { getCities } from '../data/supabase';
import { money } from '../data/cities';

export default async function Home(){
  const cities = await getCities();
  return <main>
    <section className="hero"><div className="container heroGrid">
      <div><div className="eyebrow">South Carolina, first</div><h1>Find the place that fits your life.</h1><p className="lead">Hometown Guidebook combines current public data with clear local context so you can narrow where to live without digging through ten different websites.</p><div className="actions"><a className="btn btnPrimary" href="/quiz">Find My Hometown</a><a className="btn" href="/explore">Explore South Carolina</a></div></div>
      <div className="heroPanel"><h3>A simpler way to narrow your move</h3><p>Start with a small set of researched communities. Compare the numbers, understand the tradeoffs, then go deeper.</p></div>
    </div></section>
    <section className="section"><div className="container"><div className="sectionHead"><div><h2>Start with South Carolina</h2><p>Six launch communities representing different regions, lifestyles and price points.</p></div><a href="/explore">Explore all →</a></div><div className="grid3">{cities.map(c=><a className="card" href={`/cities/${c.slug}`} key={c.slug}><div className="region">{c.region}</div><h3>{c.name}</h3><p>{c.summary}</p><div className="data3"><div className="datum"><small>Population</small><b>{c.population.toLocaleString()}</b></div><div className="datum"><small>Median home</small><b>{money(c.home)}</b></div><div className="datum"><small>Commute</small><b>{c.commute} min</b></div></div></a>)}</div></div></section>
  </main>
}
