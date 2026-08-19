import { notFound } from 'next/navigation';
import { getCityBySlug } from '../../../data/supabase';
import { money } from '../../../data/cities';
import './greenville.css';

const siteUrl='https://hometownguidebook.com';
const img=(name)=>`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(name)}?width=1600`;

const photos={
  hero:{src:img('Greenville - Liberty Bridge at Falls Park.jpg'),alt:'Liberty Bridge over the Reedy River at Falls Park in Greenville, South Carolina',credit:'P. Hughes',page:'https://commons.wikimedia.org/wiki/File:Greenville_-_Liberty_Bridge_at_Falls_Park.jpg'},
  main:{src:img('Greenville - South Main Street.jpg'),alt:'South Main Street near Falls Park in downtown Greenville, South Carolina',credit:'P. Hughes',page:'https://commons.wikimedia.org/wiki/File:Greenville_-_South_Main_Street.jpg'},
  trail:{src:img('Swamp Rabbit Trail, Greenville, SC June 2019.jpg'),alt:'Swamp Rabbit Trail in Greenville, South Carolina',credit:'Thomson200',page:'https://commons.wikimedia.org/wiki/File:Swamp_Rabbit_Trail,_Greenville,_SC_June_2019.jpg'},
  pettigru:{src:img('Pettigru Historic District.jpg'),alt:'Homes in the Pettigru Street Historic District in Greenville, South Carolina',credit:'Bill Fitzpatrick',page:'https://commons.wikimedia.org/wiki/File:Pettigru_Historic_District.jpg'},
  falls:{src:img('Greenville - Falls Park scene.jpg'),alt:'Falls Park and pedestrian bridge in Greenville, South Carolina',credit:'P. Hughes',page:'https://commons.wikimedia.org/wiki/File:Greenville_-_Falls_Park_scene.jpg'},
  homes:{src:img('East Park Historic Area.jpg'),alt:'Residential homes in the East Park Historic District of Greenville, South Carolina',credit:'Bill Fitzpatrick',page:'https://commons.wikimedia.org/wiki/File:East_Park_Historic_Area.jpg'}
};

export async function generateMetadata(){
  const c=await getCityBySlug('greenville');
  if(!c)return {};
  const title=c.seoTitle||'Living in Greenville, SC: Moving Guide, Cost & Tradeoffs';
  const description=c.seoDescription||c.summary;
  return {title,description,alternates:{canonical:'/south-carolina/greenville'},openGraph:{title,description,url:`${siteUrl}/south-carolina/greenville`,type:'article',images:[{url:photos.hero.src,alt:photos.hero.alt}]},twitter:{card:'summary_large_image',title,description,images:[photos.hero.src]}};
}

function PhotoCredit({photo}){return <span>Photo: <a href={photo.page} target="_blank" rel="noreferrer">{photo.credit} / Wikimedia Commons</a></span>}
function Photo({photo,className='',caption}){return <figure className="photoWrap"><img className={`cityPhoto ${className}`} src={photo.src} alt={photo.alt} loading={className.includes('heroPhoto')?'eager':'lazy'}/><figcaption className="photoCaption">{caption} <PhotoCredit photo={photo}/></figcaption></figure>}
function RenderSection({section}){if(!section)return null;return <section className="editorialSection"><h2>{section.heading}</h2>{section.body?.map((p,i)=><p key={i}>{p}</p>)}</section>}

export default async function GreenvillePage(){
  const c=await getCityBySlug('greenville'); if(!c)notFound();
  const sections=c.content?.sections||[];
  const by=(term)=>sections.find(s=>s.heading.toLowerCase().includes(term));
  const quick=by('actually feels'); const housing=by('housing'); const schools=by('schools'); const commute=by('commute'); const outdoors=by('outdoors'); const airport=by('airport'); const fit=by('fit best'); const before=by('before you decide');
  const canonical=`${siteUrl}/south-carolina/greenville`;
  const citySchema={'@context':'https://schema.org','@type':'City',name:'Greenville, South Carolina',url:canonical,description:c.seoDescription||c.summary,containedInPlace:{'@type':'State',name:'South Carolina'}};
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:siteUrl},{'@type':'ListItem',position:2,name:'South Carolina',item:`${siteUrl}/explore`},{'@type':'ListItem',position:3,name:'Greenville',item:canonical}]};
  return <main className="greenvillePage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(citySchema)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/>
    <section className="pageHero cityHero"><div className="container"><div className="breadcrumbs"><a href="/">Home</a><span>›</span><a href="/explore">South Carolina</a><span>›</span><span>Greenville</span></div><div className="eyebrow">Upstate · Moving Guide</div><h1>Living in Greenville, South Carolina</h1><p>{c.summary}</p><div className="tags">{c.best.map(t=><span className="tag" key={t}>{t}</span>)}</div><Photo photo={photos.hero} className="heroPhoto" caption="Falls Park and the Liberty Bridge sit at the center of downtown Greenville's identity."/></div></section>
    <section className="section alt"><div className="container profile"><article className="prose"><div className="notice"><strong>How to read this guide:</strong> sourced facts and Hometown Guidebook editorial analysis are intentionally separated. Verify address-specific items such as schools and taxes before making a housing decision.</div><div className="quickVerdict"><strong>Hometown Guidebook take</strong><p>{c.content?.verdict}</p></div><h2>The quick read</h2><p>{c.content?.intro}</p>
      <div className="visualGrid">
        <div className="visualCard"><img src={photos.main.src} alt={photos.main.alt} loading="lazy"/><div className="visualCardBody"><h3>Walkable core</h3><p>Main Street and the downtown blocks around Falls Park give Greenville a usable, active center.</p><div className="photoCaption"><PhotoCredit photo={photos.main}/></div></div></div>
        <div className="visualCard"><img src={photos.trail.src} alt={photos.trail.alt} loading="lazy"/><div className="visualCardBody"><h3>Outdoor access</h3><p>The Swamp Rabbit Trail and nearby foothills make recreation a practical part of everyday life.</p><div className="photoCaption"><PhotoCredit photo={photos.trail}/></div></div></div>
        <div className="visualCard"><img src={photos.pettigru.src} alt={photos.pettigru.alt} loading="lazy"/><div className="visualCardBody"><h3>Neighborhood variety</h3><p>Closer-in historic districts and suburban communities create very different versions of Greenville living.</p><div className="photoCaption"><PhotoCredit photo={photos.pettigru}/></div></div></div>
      </div>
      <div className="splitVisual"><div><RenderSection section={quick}/></div><Photo photo={photos.falls} caption="Downtown puts green space and the Reedy River directly into the city experience."/></div>
      <RenderSection section={housing}/>
      <Photo photo={photos.homes} caption="Established residential areas near the core can look very different from newer suburban development farther out in Greenville County."/>
      <RenderSection section={schools}/>
      <RenderSection section={commute}/>
      <div className="regionalCard"><h3>Greenville's regional position</h3><p>Greenville sits between larger Southeast metros while staying close to the Blue Ridge foothills. This diagram is intentionally approximate rather than a driving-distance map.</p><div className="regionalMap" role="img" aria-label="Approximate regional diagram showing Greenville in relation to Asheville, Charlotte, and Atlanta"><span className="mapPin greenville"><i/>Greenville</span><span className="mapPin asheville"><i/>Asheville</span><span className="mapPin charlotte"><i/>Charlotte</span><span className="mapPin atlanta"><i/>Atlanta</span></div><p className="mapNote">Use your actual work address and frequent destinations when evaluating commute and airport access.</p></div>
      <RenderSection section={outdoors}/><RenderSection section={airport}/>
      <div className="splitVisual reverse"><Photo photo={photos.pettigru} caption="Greenville's appeal is not only downtown; the broader market includes established residential neighborhoods and suburban choices."/><div><RenderSection section={fit}/></div></div>
      <RenderSection section={before}/>
      {c.faqs?.length>0&&<section className="faq"><h2>Common questions about moving to Greenville</h2>{c.faqs.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>}
      {c.sources?.length>0&&<section className="sourceBlock"><h2>Sources we used</h2><p className="sourceIntro">We prefer primary public sources for facts that can change. Editorial interpretation is labeled separately.</p><ul className="sourceList">{c.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer"><strong>{s.title}</strong></a>{s.publisher&&<span> · {s.publisher}</span>}{s.data_period&&<small>{s.data_period}</small>}</li>)}</ul></section>}
      <p className="credits">Location photography on this page is sourced from Wikimedia Commons under the license shown on each linked file page.</p>
    </article><aside><div className="sidebox stickyBox"><h2 className="sideTitle">Greenville at a glance</h2><div className="fact"><span>Population</span><b>{c.population.toLocaleString()}</b></div><div className="fact"><span>Growth since 2020</span><b>{c.growth}%</b></div><div className="fact"><span>Median home value</span><b>{money(c.home)}</b></div><div className="fact"><span>Median rent</span><b>{money(c.rent)}</b></div><div className="fact"><span>Median household income</span><b>{money(c.income)}</b></div><div className="fact"><span>Mean commute</span><b>{c.commute} min</b></div>{c.editorialUpdatedAt&&<p className="updated">Guide updated {new Date(c.editorialUpdatedAt).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</p>}</div><div className="sidebox"><h3>Keep researching</h3><p><a className="textLink" href="/compare">Compare South Carolina cities →</a></p><p><a className="textLink" href="/quiz">Try Hometown Match →</a></p></div></aside></div></section>
  </main>;
}
