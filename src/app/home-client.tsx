"use client";
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {HoverOpen} from './more-cases';
export default function HomeClient({projects,profile}:{projects:any[],profile:any}){
 const [tab,setTab]=useState<'cases'|'visual'>('cases');
 return <div className="portfolio">
  <header className="topbar"><div className="topbar__inner">
   <Link href="/" className="brandmark"><Image className="brandmark__ava" src={profile.avatar} alt="" width={40} height={40}/><span className="brandmark__name">{profile.name}</span></Link>
   <nav className="pillnav" aria-label="Контакты"><a className="pill" href={`mailto:${profile.email}`}>Почта</a><a className="pill" href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a>{profile.resumeUrl?<a className="pill pill--dark" href={profile.resumeUrl} download="Альшевский Андрей.pdf">Скачать резюме</a>:<span className="pill pill--dark pill--disabled">Скачать резюме</span>}</nav>
  </div></header>
  <main><section className="hero"><h1 className="hero__title">{profile.headline}<br/><span className="hero__sub">{profile.bio}</span></h1></section>
   <div className="shell"><div className="tabs" role="tablist" aria-label="Разделы портфолио"><button type="button" role="tab" className="tabs__btn" aria-selected={tab==='cases'} onClick={()=>setTab('cases')}>Кейсы</button><button type="button" role="tab" className="tabs__btn" aria-selected={tab==='visual'} onClick={()=>setTab('visual')}>Визуал</button></div>
    {tab==='cases'?<section className="grid" id="work" role="tabpanel">{projects.slice(0,4).map((p:any,i:number)=><Link onMouseMove={e=>{const bubble=e.currentTarget.querySelector<HTMLElement>('.card__hover-open');if(bubble){const r=e.currentTarget.getBoundingClientRect();bubble.style.left=`${e.clientX-r.left}px`;bubble.style.top=`${e.clientY-r.top}px`}}} href={`/projects/${p.slug}`} className={`card ${i===0||i===3?'card--wide':''}`} key={p.slug}>{(p.nda === true || p.type.split(' · ').includes('NDA')) && <span className="card__nda" aria-label="Проект под NDA"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="12" rx="2" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/></svg>NDA</span>}<div className="card__head"><div className="card__body"><div className="card__text"><p className="card__title">{p.icon&&<Image className="card__logo" src={p.icon} alt="" width={24} height={24}/>}<span>{p.brand}</span></p><p className="card__desc">{p.description}</p></div><ul className="tags card__tags">{p.type.split(' · ').filter((t:string)=>t && t!=='NDA').map((t:string)=><li key={t}>{t}</li>)}</ul></div></div><div className="card__art portfolio-art"><Image src={({migration:'/projects/home-migration-cover.png',global:'/projects/home-global-cover.png',yoko:'/projects/home-yoko-cover.png',maxim:'/projects/home-maxim-cover.png'} as Record<string,string>)[p.slug] || p.image} alt={p.brand} fill sizes="(max-width:800px) 100vw, 1160px" unoptimized={p.image.startsWith('https://')}/></div><HoverOpen/></Link>)}</section>:<section style={{padding:'70px 0',textAlign:'center',color:'#949aa4'}}>Раздел «Визуал» появится позже.</section>}
   </div>
  </main><footer className="footer"><nav className="footer__nav"><a className="pill" href={`mailto:${profile.email}`}>Почта</a><a className="pill" href={profile.telegram}>Telegram</a>{profile.resumeUrl&&<a className="pill pill--dark" href={profile.resumeUrl} download="Альшевский Андрей.pdf">Скачать резюме</a>}</nav><p className="footer__copy">{profile.name} © 2026</p></footer>
 </div>;
}
