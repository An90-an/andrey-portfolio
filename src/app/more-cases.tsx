'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
export function HoverOpen(){
 const ref=useRef<HTMLSpanElement>(null);
 return <span ref={ref} className="card__hover-open" aria-hidden="true">ОТКРЫТЬ</span>;
}
export default function MoreCases({projects,homeCovers}:{projects:any[],homeCovers:Record<string,string>}){
 const ref=useRef<HTMLDivElement>(null);
 const [atStart,setAtStart]=useState(true),[atEnd,setAtEnd]=useState(false);
 const update=()=>{const el=ref.current;if(!el)return;setAtStart(el.scrollLeft<=2);setAtEnd(el.scrollLeft+el.clientWidth>=el.scrollWidth-3)};
 useEffect(()=>{update();window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)},[]);
 const move=(direction:number)=>{const el=ref.current;if(!el)return;const card=el.querySelector<HTMLElement>('.card');el.scrollBy({left:direction*(card?.getBoundingClientRect().width||400)+direction*24,behavior:'smooth'})};
 return <section className="case__more"><div className="case__more-head"><h2>Другие кейсы</h2></div><div className="case__more-row"><button className="case__more-nav case__more-nav--prev" aria-label="Предыдущий кейс" disabled={atStart} onClick={()=>move(-1)}>‹</button><div ref={ref} className="case__more-scroller" onScroll={update}>{projects.map(x=><Link className="card" key={x.slug} href={`/projects/${x.slug}`} onMouseMove={e=>{const bubble=e.currentTarget.querySelector<HTMLElement>('.card__hover-open');if(bubble){const r=e.currentTarget.getBoundingClientRect();bubble.style.left=`${e.clientX-r.left}px`;bubble.style.top=`${e.clientY-r.top}px`}}}>{(x.nda===true||x.type.split(' · ').includes('NDA'))&&<span className="card__nda" aria-label="Проект под NDA">▣ NDA</span>}<div className="card__head"><div className="card__body"><div className="card__text"><p className="card__title">{x.icon&&<Image className="card__logo" src={x.icon} alt="" width={24} height={24}/>}<span>{x.brand}</span></p><p className="card__desc">{x.description}</p></div><ul className="tags card__tags">{x.type.split(' · ').filter((t:string)=>t&&t!=='NDA').map((t:string)=><li key={t}>{t}</li>)}</ul></div></div><div className="card__art portfolio-art"><Image src={homeCovers[x.slug]||x.image} alt="" fill sizes="568px" unoptimized={(homeCovers[x.slug]||x.image).startsWith('https://')}/></div><HoverOpen/></Link>)}</div><button className="case__more-nav case__more-nav--next" aria-label="Следующий кейс" disabled={atEnd} onClick={()=>move(1)}>›</button></div></section>;
}
