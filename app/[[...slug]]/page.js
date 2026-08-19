import { notFound, permanentRedirect } from 'next/navigation';
import { getCities, getCitiesBySlug, getCityBySlug } from '../../data/supabase';
import { money } from '../../data/cities';

const siteUrl='https://hometownguidebook.com';
const pairs=[['greenville','charleston'],['greenville','columbia'],['lexington','fort-mill'],['lexington','bluffton'],['charleston','bluffton'],['columbia','lexington']];
const guides={
 'moving-to-south-carolina':['Moving to South Carolina','A practical starting point for understanding the state before you choose a city.'],
 'best-places-to-live-south-carolina':['Best Places to Live in South Carolina','There is no single best place. The useful question is which place best fits your priorities.'],
 'choosing-schools-in-south-carolina':['How to Research Schools Before Moving','Use address-level assignments and official report cards rather than a single citywide score.'],
 'south-carolina-property-taxes':['Understanding South Carolina Property Taxes','Property tax is local, so use county resources instead of relying on one statewide percentage.'],
 'south-carolina-relocation-checklist':['South Carolina Relocation Checklist','A simple sequence for narrowing where to live and validating the choice in person.']
};
const localCats=['restaurants','movers','cleaning','hvac','plumbing','electricians','roofing','landscaping'];

export async function generateMetadata({params}){
  const p=(await params).slug||[];
  if(p[0]==='south-carolina'&&p[1]){
    const c=await getCityBySlug(p[1]);
    if(!c)return {};
    const canonical=`/south-carolina/${c.slug}`;
    const title=c.seoTitle||`Living in ${c.name}, SC: Moving Guide`;
    const description=c.seoDescription||c.summary;
    return {
      title,
      description,
      alternates:{canonical},
      openGraph:{title,description,url:`${siteUrl}${canonical}`,type:'article'},
      twitter:{card:'summary_large_image',title,description},
    };
  }
  if(p[0]==='explore')return {title:'Best Places to Live in South Carolina: City Guides',description:'Explore researched South Carolina city guides with housing, commute, schools, lifestyle tradeoffs and sourced public data.',alternates:{canonical:'/explore'}};
  if(p[0]==='compare'&&p.length===1)return {title:'Compare South Carolina Cities',description:'Compare South Carolina cities side by side on housing, income, commute and lifestyle tradeoffs.',alternates:{canonical:'/compare'}};
  if(p[0]==='compare'&&p[1])return {title:p[1].split('-vs-').map(x=>x.replace(/(^|-)([a-z])/g,(_,a,b)=>`${a==='-'?' ':''}${b.toUpperCase()}`)).join(' vs. '),alternates:{canonical:`/compare/${p[1]}`}};
  if(p[0]==='guides'&&p.length===1)return {title:'South Carolina Relocation Guides',description:'Practical guides for moving to South Carolina, researching schools, understanding property taxes and choosing where to live.',alternates:{canonical:'/guides'}};
  if(p[0]==='guides'&&p[1]&&guides[p[1]])return {title:guides[p[1]][0],description:guides[p[1]][1],alternates:{canonical:`/guides/${p[1]}`}};
  if(p[0]==='methodology')return {title:'Methodology & Sources',description:'How Hometown Guidebook separates sourced facts, editorial analysis and sponsored placement.',alternates:{canonical:'/methodology'}};
  return {};
}

async function Explore(){
  const cities=await getCities();
  return <><section className="pageHero"><div className="container"><div className="eyebrow">South Carolina City Guides</div><h1>Find the South Carolina place that fits your life.</h1><p>Start with the questions that change a move: housing, commute, schools, access to work and airports, and what daily life actually feels like after the weekend visit is over.</p></div></section><section className="section alt"><div className="container grid3">{cities.map(c=><a className="card" href={`/south-carolina/${c.slug}`} key={c.slug}><div className="region">{c.region}</div><h2 className="cardTitle">Living in {c.name}, SC</h2><p>{c.summary}</p><div className="data3"><div className="datum"><small>Population</small><b>{c.population.toLocaleString()}</b></div><div className="datum"><small>Median home value</small><b>{money(c.home)}</b></div><div className="datum"><small>Median income</small><b>{money(c.income)}</b></div></div><span className="textLink">Read the moving guide →</span></a>)}</div></section></>;
}

function StructuredCityData({c}){
  const canonical=`${siteUrl}/south-carolina/${c.slug}`;
  const citySchema={
    '@context':'https://schema.org','@type':'City',name:`${c.name}, South Carolina`,url:canonical,
    description:c.seoDescription||c.summary,
    containedInPlace:{'@type':'State',name:'South Carolina'}
  };
  const breadcrumb={
    '@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Home',item:siteUrl},
      {'@type':'ListItem',position:2,name:'South Carolina',item:`${siteUrl}/explore`},
      {'@type':'ListItem',position:3,name:c.name,item:canonical}
    ]
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(citySchema)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/></>;
}

function RichEditorial({c}){
  const sections=c.content?.sections||[];
  if(!sections.length)return <><h2>What to know before moving here</h2><p>{c.summary}</p><h2>Housing and cost context</h2><p>The current Census QuickFacts profile reports a median owner-occupied housing value of <strong>{money(c.home)}</strong> and median gross rent of <strong>{money(c.rent)}</strong>. Those are broad benchmarks, not current asking prices for a specific neighborhood or home type.</p><h2>Who it may fit best</h2><ul>{c.best.map(x=><li key={x}>{x}</li>)}</ul><h2>Main tradeoffs</h2><ul>{c.trade.map(x=><li key={x}>{x}</li>)}</ul></>;
  return <>
    <div className="quickVerdict"><strong>Hometown Guidebook take</strong><p>{c.content.verdict}</p></div>
    <h2>The quick read</h2><p>{c.content.intro}</p>
    {sections.map((section)=><section className="editorialSection" key={section.heading}><h2>{section.heading}</h2>{section.body?.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</section>)}
  </>;
}

function SourceList({sources=[]}){
  if(!sources.length)return null;
  return <section className="sourceBlock"><h2>Sources we used</h2><p className="sourceIntro">We prefer primary public sources for facts that can change. Editorial interpretation is labeled separately.</p><ul className="sourceList">{sources.map((s)=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer"><strong>{s.title}</strong></a>{s.publisher&&<span> · {s.publisher}</span>}{s.data_period&&<small>{s.data_period}</small>}</li>)}</ul></section>;
}

function FAQ({items=[]}){
  if(!items.length)return null;
  return <section className="faq"><h2>Common questions about moving here</h2>{items.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>;
}

async function City({slug}){
  const c=await getCityBySlug(slug); if(!c)notFound();
  return <><StructuredCityData c={c}/><section className="pageHero cityHero"><div className="container"><div className="breadcrumbs"><a href="/">Home</a><span>›</span><a href="/explore">South Carolina</a><span>›</span><span>{c.name}</span></div><div className="eyebrow">{c.region} · Moving Guide</div><h1>Living in {c.name}, South Carolina</h1><p>{c.summary}</p><div className="tags">{c.best.map(t=><span className="tag" key={t}>{t}</span>)}</div></div></section><section className="section alt"><div className="container profile"><article className="prose"><div className="notice"><strong>How to read this guide:</strong> sourced facts and Hometown Guidebook editorial analysis are intentionally separated. Verify address-specific items such as schools and taxes before making a housing decision.</div><RichEditorial c={c}/><FAQ items={c.faqs}/><SourceList sources={c.sources}/></article><aside><div className="sidebox stickyBox"><h2 className="sideTitle">{c.name} at a glance</h2><div className="fact"><span>Population</span><b>{c.population.toLocaleString()}</b></div><div className="fact"><span>Growth since 2020</span><b>{c.growth}%</b></div><div className="fact"><span>Median home value</span><b>{money(c.home)}</b></div><div className="fact"><span>Median rent</span><b>{money(c.rent)}</b></div><div className="fact"><span>Median household income</span><b>{money(c.income)}</b></div><div className="fact"><span>Mean commute</span><b>{c.commute} min</b></div>{c.editorialUpdatedAt&&<p className="updated">Guide updated {new Date(c.editorialUpdatedAt).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</p>}</div><div className="sidebox"><h3>Keep researching</h3><p><a className="textLink" href="/compare">Compare South Carolina cities →</a></p><p><a className="textLink" href="/quiz">Try Hometown Match →</a></p></div></aside></div></section></>;
}

async function CompareIndex(){const bySlug=await getCitiesBySlug();return <><section className="pageHero"><div className="container"><div className="eyebrow">Compare</div><h1>See the tradeoffs side by side.</h1><p>Averages tell only part of the story, but consistent comparisons make it easier to decide which communities deserve a closer look.</p></div></section><section className="section alt"><div className="container grid3">{pairs.map(([a,b])=>bySlug[a]&&bySlug[b]?<a className="card" key={`${a}-${b}`} href={`/compare/${a}-vs-${b}`}><div className="region">City Comparison</div><h2 className="cardTitle">{bySlug[a].name} vs. {bySlug[b].name}</h2><p>Compare housing, income, commute and lifestyle tradeoffs.</p></a>:null)}</div></section></>}
async function Compare({a,b}){const bySlug=await getCitiesBySlug();const x=bySlug[a],y=bySlug[b];if(!x||!y)notFound();const rows=[['Population',x.population.toLocaleString(),y.population.toLocaleString()],['Growth since 2020',`${x.growth}%`,`${y.growth}%`],['Median home value',money(x.home),money(y.home)],['Median rent',money(x.rent),money(y.rent)],['Median household income',money(x.income),money(y.income)],['Mean commute',`${x.commute} min`,`${y.commute} min`]];return <><section className="pageHero"><div className="container"><div className="eyebrow">South Carolina City Comparison</div><h1>{x.name} vs. {y.name}</h1><p>Start with comparable public data, then decide which lifestyle tradeoffs matter more to you.</p></div></section><section className="section alt"><div className="container"><div className="grid3 compareGrid"><div className="card"><strong>Factor</strong></div><div className="card"><strong>{x.name}</strong></div><div className="card"><strong>{y.name}</strong></div>{rows.flatMap(([l,v1,v2])=>[<div className="card" key={l+'l'}>{l}</div>,<div className="card" key={l+'1'}>{v1}</div>,<div className="card" key={l+'2'}>{v2}</div>])}</div><div className="compareLinks"><a href={`/south-carolina/${x.slug}`}>Read the {x.name} moving guide →</a><a href={`/south-carolina/${y.slug}`}>Read the {y.name} moving guide →</a></div></div></section></>}
function Guides(){return <><section className="pageHero"><div className="container"><div className="eyebrow">Relocation Research</div><h1>Practical South Carolina moving guides</h1><p>Use these guides to answer the questions that should be settled before you fall in love with a house.</p></div></section><section className="section alt"><div className="container grid3">{Object.entries(guides).map(([slug,[title,desc]])=><a className="card" href={`/guides/${slug}`} key={slug}><div className="region">Guide</div><h2 className="cardTitle">{title}</h2><p>{desc}</p></a>)}</div></section></>}
function Guide({slug}){const g=guides[slug];if(!g)notFound();return <><section className="pageHero"><div className="container"><div className="eyebrow">Relocation Guide</div><h1>{g[0]}</h1><p>{g[1]}</p></div></section><section className="section alt"><div className="container prose"><h2>The short version</h2><p>{g[1]} Hometown Guidebook’s approach is to reduce false precision: use primary sources for facts, verify address-specific details, and clearly label interpretation.</p><h2>Useful official sources</h2><ul><li>U.S. Census Bureau QuickFacts</li><li>South Carolina School Report Cards</li><li>South Carolina Department of Revenue property-tax resources</li></ul><p><a className="textLink" href="/explore">Explore South Carolina city guides →</a></p></div></section></>}
function Local(){return <><section className="pageHero"><div className="container"><div className="eyebrow">Local Guide</div><h1>Once you choose a place, live there better.</h1><p>Restaurants and trusted home-service categories belong on the same platform without overwhelming the relocation experience.</p></div></section><section className="section alt"><div className="container grid3">{localCats.map(x=><a className="card" href={`/local/${x}`} key={x}><h2 className="cardTitle">{x.replace('-',' ').replace(/^./,m=>m.toUpperCase())}</h2><p>Verified local listings will live here.</p></a>)}</div></section></>}
function LocalCat({cat}){if(!localCats.includes(cat))notFound();return <><section className="pageHero"><div className="container"><div className="eyebrow">Local Guide</div><h1>{cat.replace('-',' ').replace(/^./,m=>m.toUpperCase())}</h1><p>This category is structurally ready for verified businesses.</p></div></section><section className="section alt"><div className="container"><div className="notice">No fake listings are shown. Sponsored placement will be clearly disclosed and separated from editorial recommendation.</div></div></section></>}
function Methodology(){return <><section className="pageHero"><div className="container"><div className="eyebrow">Editorial Standards</div><h1>How Hometown Guidebook earns trust.</h1><p>Facts are sourced. Editorial judgment is labeled. Sponsored placement never secretly buys a ranking.</p></div></section><section className="section alt"><div className="container grid3"><div className="card"><h2 className="cardTitle">Primary sources first</h2><p>Census, state agencies, school districts and local governments take priority for changeable facts.</p></div><div className="card"><h2 className="cardTitle">Facts ≠ opinion</h2><p>Objective data and editorial analysis are kept distinct so you can see what is measured and what is judgment.</p></div><div className="card"><h2 className="cardTitle">No paid rankings</h2><p>Sponsored placement can support the site, but it does not purchase an undisclosed editorial recommendation.</p></div></div></section></>}

export default async function CatchAll({params}){
  const p=(await params).slug||[];
  if(p[0]==='explore'&&p.length===1)return <Explore/>;
  if(p[0]==='south-carolina'&&p[1]&&p.length===2)return <City slug={p[1]}/>;
  if(p[0]==='cities'&&p[1])permanentRedirect(`/south-carolina/${p[1]}`);
  if(p[0]==='compare'&&p.length===1)return <CompareIndex/>;
  if(p[0]==='compare'&&p[1]){const pair=p[1].split('-vs-');return <Compare a={pair[0]} b={pair[1]}/>}
  if(p[0]==='guides'&&p.length===1)return <Guides/>;
  if(p[0]==='guides'&&p[1])return <Guide slug={p[1]}/>;
  if(p[0]==='local'&&p.length===1)return <Local/>;
  if(p[0]==='local'&&p[1])return <LocalCat cat={p[1]}/>;
  if(p[0]==='methodology')return <Methodology/>;
  notFound();
}
