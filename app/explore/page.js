import { getCities } from '../../data/supabase';
import { money } from '../../data/cities';

export const metadata={title:'Explore South Carolina',description:'Explore researched South Carolina communities.'};

export default async function ExplorePage(){
  const cities=await getCities();
  return <main><section className="pageHero"><div className="container"><div className="eyebrow">Explore</div><h1>South Carolina communities</h1><p>Our launch set is intentionally small. We would rather publish useful profiles than thin ones.</p></div></section><section className="section alt"><div className="container grid3">{cities.map(c=><a className="card" href={`/cities/${c.slug}`} key={c.slug}><div className="region">{c.region}</div><h3>{c.name}</h3><p>{c.summary}</p><div className="data3"><div className="datum"><small>Population</small><b>{c.population.toLocaleString()}</b></div><div className="datum"><small>Median home</small><b>{money(c.home)}</b></div><div className="datum"><small>Income</small><b>{money(c.income)}</b></div></div></a>)}</div></section></main>
}
