import { notFound } from 'next/navigation';
import { getCitiesBySlug } from '../../../data/supabase';
import { money } from '../../../data/cities';

export async function generateMetadata({params}){
  const {slug}=await params;
  const bySlug=await getCitiesBySlug();
  const c=bySlug[slug];
  if(!c)return {};
  return {title:`Living in ${c.name}, SC`,description:c.summary};
}

export default async function CityPage({params}){
  const {slug}=await params;
  const bySlug=await getCitiesBySlug();
  const c=bySlug[slug];
  if(!c)notFound();
  return <main><section className="pageHero"><div className="container"><div className="eyebrow">{c.region} · City Guide</div><h1>{c.name}, South Carolina</h1><p>{c.summary}</p><div className="tags">{c.best.map(t=><span className="tag" key={t}>{t}</span>)}</div></div></section><section className="section alt"><div className="container profile"><article className="prose"><div className="notice">Sourced facts and Hometown Guidebook editorial analysis are intentionally separated.</div><h2>The quick read</h2><p>{c.summary}</p><h2>Housing and cost context</h2><p>The current sourced profile reports a median owner-occupied housing value of <strong>{money(c.home)}</strong> and median gross rent of <strong>{money(c.rent)}</strong>.</p><h2>Who it may fit best</h2><ul>{c.best.map(x=><li key={x}>{x}</li>)}</ul><h2>Main tradeoffs</h2><ul>{c.trade.map(x=><li key={x}>{x}</li>)}</ul><h2>Schools</h2><p>{c.school}</p>{c.schoolUrl&&<p><a href={c.schoolUrl} target="_blank" rel="noopener">Official school resource →</a></p>}<h2>Airport access</h2><p>{c.airport}</p>{c.airportUrl&&<p><a href={c.airportUrl} target="_blank" rel="noopener">Official airport resource →</a></p>}<h2>Property taxes</h2><p>Property taxes vary by jurisdiction, classification and millage. Use the official local resource for property-specific estimates.</p>{c.taxUrl&&<p><a href={c.taxUrl} target="_blank" rel="noopener">Official tax resource →</a></p>}</article><aside><div className="sidebox"><h3>At a glance</h3><div className="fact"><span>Population</span><b>{c.population.toLocaleString()}</b></div><div className="fact"><span>Growth</span><b>{c.growth}%</b></div><div className="fact"><span>Median home</span><b>{money(c.home)}</b></div><div className="fact"><span>Median rent</span><b>{money(c.rent)}</b></div><div className="fact"><span>Median income</span><b>{money(c.income)}</b></div><div className="fact"><span>Commute</span><b>{c.commute} min</b></div></div></aside></div></section></main>
}
