import Link from 'next/link';
import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';
import '../../../global-case.css';
import '../../../maxim-case.css';
import {getContent} from '../../../../sanity/content';
export const metadata={title:'Количественные интервью — Такси Максим'};
export default async function MaximInterviews(){
 const {profile}=await getContent();
 const html=fs.readFileSync(path.join(process.cwd(),'src/app/maxim-interviews.html'),'utf8');
 return <div className="portfolio"><header className="topbar"><div className="topbar__inner"><Link className="brandmark" href="/"><Image className="brandmark__ava" src={profile.avatar} alt="" width={40} height={40}/><span className="brandmark__name">{profile.name}</span></Link><nav className="pillnav"><a className="pill" href={`mailto:${profile.email}`}>Почта</a><a className="pill" href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a></nav></div></header><main><article className="case case--kommo maxim-interviews-page"><div className="maxim-subpage-intro"><Link className="maxim-back" href="/projects/maxim">← Вернуться к кейсу «Такси Максим»</Link><p className="maxim-eyebrow">Исследования · Такси Максим</p><h1>Количественные интервью</h1><p>Результаты опроса пользователей сервисов заказа такси, анализ ответов и проверка гипотез.</p></div><div className="global-case maxim-research" dangerouslySetInnerHTML={{__html:html}}/></article></main><footer className="footer"><nav className="footer__nav"><a className="pill" href={`mailto:${profile.email}`}>Почта</a><a className="pill" href={profile.telegram}>Telegram</a></nav><p className="footer__copy">{profile.name} © 2026</p></footer></div>;
}
