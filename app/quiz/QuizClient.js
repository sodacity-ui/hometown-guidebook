'use client';
import { useMemo, useState } from 'react';
import { money } from '../../data/cities';

const fields=[['family','Family appeal',8],['schools','Schools',8],['walkability','Walkability / active downtown',6],['dining','Dining / things to do',7],['outdoors','Outdoor recreation',7],['beach','Beach access',4],['mountains','Mountain access',5],['airport','Airport access',6]];

export default function QuizClient({cities}){
  const [budget,setBudget]=useState(3);
  const [prefs,setPrefs]=useState(Object.fromEntries(fields.map(([k,,v])=>[k,v])));
  const [show,setShow]=useState(false);
  const ranked=useMemo(()=>cities.map(c=>{
    let total=0,max=0;
    fields.forEach(([k])=>{const w=prefs[k];total+=(10-Math.abs((c.scores?.[k] ?? 5)-w))*Math.max(1,w);max+=10*Math.max(1,w)});
    const budgetFit=Math.max(0,10-Math.abs(c.budget-budget)*2.7);total+=budgetFit*8;max+=80;
    return {...c,match:Math.round(total/max*100)};
  }).sort((a,b)=>b.match-a.match),[budget,prefs,cities]);

  return <div className="quiz">
    <div className="eyebrow">Hometown Match</div><h1 style={{fontSize:44}}>What matters most to you?</h1><p className="lead">Weight your priorities and see which launch communities rise to the top.</p><div className="notice">The match percentage is an editorial prototype, not a factual ranking.</div>
    <div className="field"><label>Home budget</label><select value={budget} onChange={e=>setBudget(Number(e.target.value))}><option value="1">Under $300k</option><option value="2">$300k–$450k</option><option value="3">$450k–$650k</option><option value="4">$650k+</option></select></div>
    {fields.map(([k,label])=><div className="field" key={k}><label>{label}</label><div className="range"><input type="range" min="1" max="10" value={prefs[k]} onChange={e=>setPrefs({...prefs,[k]:Number(e.target.value)})}/><output>{prefs[k]}</output></div></div>)}
    <button className="btn btnPrimary" style={{width:'100%'}} onClick={()=>setShow(true)}>Show My Matches</button>
    {show&&<div style={{marginTop:28}}><h2>Your best matches</h2>{ranked.map((c,i)=><div className="card" style={{marginTop:10}} key={c.slug}><div style={{display:'flex',justifyContent:'space-between',gap:12}}><h3>{i+1}. {c.name}</h3><strong style={{color:'var(--teal)'}}>{c.match}% match</strong></div><p>{c.summary}</p><div className="data3"><div className="datum"><small>Median home</small><b>{money(c.home)}</b></div><div className="datum"><small>Income</small><b>{money(c.income)}</b></div><div className="datum"><small>Commute</small><b>{c.commute} min</b></div></div><p><a href={`/cities/${c.slug}`}>Read the {c.name} guide →</a></p></div>)}</div>}
  </div>
}
