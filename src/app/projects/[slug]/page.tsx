import GlobalCaseClient from '../../global-case-client';
import MoreCases from '../../more-cases';
import '../../global-case.css';
import '../../maxim-case.css';
import {OzonCaseBody} from '../ozon-hr-buildin/page';
import '../ozon-hr-buildin/buildin.css';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getContent} from '../../../sanity/content';
import migrationContent from '../../migration-case.json';
import fs from 'node:fs';
import path from 'node:path';

type Section={title?:string;sub?:string;paragraphs:string[];image?:string;caption?:string};
const editorial:Record<string,{lead:string;task:string;result:string;role:string;sections:Section[]}>= {
 migration:{lead:'Редизайн анкеты для иностранных кандидатов: от длинной формы к понятному пошаговому сценарию.',task:'Упростить заполнение документов и снизить риск ошибок при загрузке файлов.',result:'Спроектирована пошаговая анкета с открытыми подсказками и примерами документов. Решение принято командой и передано в разработку.',role:'Продуктовый дизайнер',sections:[
 {title:'Погружение в задачу',sub:'Проблема',paragraphs:['Кандидаты заполняли длинную анкету и путали поля для документов: например, прикладывали паспорт вместо СНИЛС. Рекрутерам приходилось возвращаться за уточнениями, что усложняло процесс трудоустройства.','Требовалось снизить когнитивную нагрузку и сделать следующий шаг понятным даже пользователям с невысокой цифровой грамотностью.']},
 {sub:'Первая итерация — одна страница',paragraphs:['Сначала сохранил одностраничный формат: разделил поля на визуальные блоки, усилил иерархию, добавил состояния и подсказки. На этом этапе степпер не входил в допустимый объём реализации.'],image:'/projects/Экраны+старые(1).png',caption:'Первая итерация — визуальное разделение анкеты'},
 {sub:'Вторая итерация — пошаговый сценарий',paragraphs:['Визуального разделения оказалось недостаточно. После обсуждений согласовали переход к пошаговой анкете: один документ — один этап. Это позволило сфокусировать внимание кандидата на текущей задаче.'],image:'/projects/Экраны+новые(1).png',caption:'Вторая итерация — отдельный шаг для каждого документа'},
 {sub:'Третья итерация — подсказки и примеры',paragraphs:['Скрытые подсказки с иконками документов были недостаточно очевидными. Вместо них появились открытые информеры и действие «Посмотреть пример» с пояснениями простым языком.']},
 {title:'Результаты',paragraphs:['Финальный вариант — последовательная анкета из пяти обязательных этапов, с валидацией и примерами документов. Проектное решение было принято и использовано как референс в соседнем HR-направлении.','Подтверждённых количественных данных об изменении ошибок и скорости найма нет.']}
 ]},
 global:{lead:'Как сделать международную доставку понятнее и уменьшить неопределённость при покупке.',task:'Помочь покупателю заранее понять происхождение товара и реалистично оценить срок доставки.',result:'Концепция более заметной маркировки международных товаров и прозрачных сроков. Две итерации интерфейсов; без заявлений о внедрении.',role:'Продуктовый дизайнер · концепт',sections:[
 {title:'Погружение в задачу',sub:'Проблема',paragraphs:['Покупатели не всегда замечали, что товар едет из-за рубежа. Ожидаемая дата доставки воспринималась как гарантированная, а задержки и недостаток статусов снижали доверие.']},
 {sub:'Исследования',paragraphs:['Провёл анализ отзывов и конкурентов, три глубинных интервью и опрос 14 респондентов. Сформулировал семь гипотез, отметив подтверждённые, частично подтверждённые и непроверенные.']},
 {title:'Проектирование',sub:'Первая итерация',paragraphs:['Проверил первые решения на пользователях. Маркировка «Из-за рубежа» оставалась незаметной, а предупреждающее модальное окно мешало покупке.'],image:'/projects/Ozon+Global+1+итерация(1).png',caption:'Первая итерация интерфейсов'},
 {sub:'Вторая итерация',paragraphs:['Перенёс информацию о происхождении товара в более заметные зоны и сохранил маркировку на ключевых этапах покупки. Уточнил представление сроков доставки.'],image:'/projects/Ozon+Global+2+итерация(1).png',caption:'Вторая итерация — уточнение маркировки и сроков'},
 {sub:'UI-kit',paragraphs:['Систематизировал визуальные решения и повторно используемые компоненты.'],image:'/projects/Ui+Kit(1).png',caption:'Компоненты концепта'},
 {title:'Заключение',paragraphs:['Это учебно-концептуальная работа. Решения не внедрены в продукт, поэтому эффекты на конверсию, обращения в поддержку и доверие пользователей не заявляются.']}
 ]}
};
export default async function Case({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const {projects,profile}=await getContent();const p=projects.find((x:any)=>x.slug===slug);if(!p)notFound();
 const custom=editorial[slug];const sections:Section[]=custom?.sections||(p.details||[]).map((d:any,i:number)=>typeof d==='string'?{sub:['Контекст','Процесс','Результат'][i]||'Подробнее',paragraphs:[d]}:{sub:d.heading,paragraphs:[d.text],image:d.imageUrl||d.image});

 const renderInline=(nodes:any[]):any=>nodes?.map((n:any,i:number)=>{
  if(n.type==='text')return n.raw;
  if(n.type==='strong')return <strong key={i}>{renderInline(n.children)}</strong>;
  if(n.type==='emphasis')return <em key={i}>{renderInline(n.children)}</em>;
  if(n.type==='codespan')return <code key={i}>{n.raw}</code>;
  if(n.type==='link')return <a key={i} href={n.attrs?.url}>{renderInline(n.children)}</a>;
  if(n.type==='softbreak'||n.type==='linebreak')return ' ';
  return renderInline(n.children||[]);
 });
 const renderNode=(n:any,i:number):any=>{
  const ch=n.children||[];
  if(n.type==='heading'){
   const level=n.attrs?.level;
   if(level===1)return <div key={i}><section className="case__section migration-section"><h2>{renderInline(ch)}</h2></section></div>;
   if(level===2)return <section key={i} className="case__section migration-subsection"><h3>{renderInline(ch)}</h3></section>;
   return <section key={i} className="case__section migration-subsection"><h3>{renderInline(ch)}</h3></section>;
  }
  if(n.type==='paragraph'){
   const img=ch.find((x:any)=>x.type==='image');
   if(img)return <figure key={i} className="shot shot--bare migration-shot"><span className="shot__inset"><img src={img.attrs?.url} alt={renderInline(img.children)||'Макет миграционной анкеты'}/></span></figure>;
   return <div key={i} className="case__section migration-copy"><div className="case__text"><p>{renderInline(ch)}</p></div></div>;
  }
  if(n.type==='list'){
   const Tag=n.attrs?.ordered?'ol':'ul';
   return <div key={i} className="case__section migration-copy"><div className="case__text"><Tag>{ch.map((li:any,j:number)=><li key={j}>{(li.children||[]).map((c:any,k:number)=><span key={k}>{renderInline(c.children||[])}</span>)}</li>)}</Tag></div></div>;
  }
  if(n.type==='thematic_break'||n.type==='blank_line')return null;
  if(n.type==='block_quote')return <div key={i} className="case__section migration-copy"><div className="case__text"><blockquote>{ch.map((c:any,j:number)=><p key={j}>{renderInline(c.children||[])}</p>)}</blockquote></div></div>;
  return null;
 };
 // Group consecutive text nodes into one editorial block; do not turn each paragraph into a section.
 const migrationNodes:any[]=[];
 for(const node of migrationContent as any[]){
   const isText=node.type==='paragraph' && !(node.children||[]).some((c:any)=>c.type==='image');
   const isList=node.type==='list'||node.type==='block_quote';
   const last=migrationNodes[migrationNodes.length-1];
   if((isText||isList)&&last?.type==='text_group')last.nodes.push(node);
   else if(isText||isList)migrationNodes.push({type:'text_group',nodes:[node]});
   else migrationNodes.push(node);
 }
 const renderMigration=(node:any,i:number):any=>node.type==='text_group'
   ? <section key={i} className="case__section migration-copy"><div className="case__text">{node.nodes.map((n:any,j:number)=>{
     if(n.type==='paragraph')return <p key={j}>{renderInline(n.children||[])}</p>;
     if(n.type==='list'){
       const Tag=n.attrs?.ordered?'ol':'ul';
       return <Tag key={j}>{(n.children||[]).map((li:any,k:number)=><li key={k}>{(li.children||[]).map((c:any,m:number)=><span key={m}>{renderInline(c.children||[])}</span>)}</li>)}</Tag>;
     }
     if(n.type==='thematic_break'||n.type==='blank_line')return null;
  if(n.type==='block_quote')return <blockquote key={j}>{(n.children||[]).map((c:any,k:number)=><p key={k}>{renderInline(c.children||[])}</p>)}</blockquote>;
     return null;
   })}</div></section>
   : renderNode(node,i);
 const others=projects.filter((x:any)=>x.slug!==slug).slice(0,3);
 const homeCovers:Record<string,string>={migration:'/projects/home-migration-cover.png',global:'/projects/home-global-cover.png',yoko:'/projects/home-yoko-cover.png',maxim:'/projects/home-maxim-cover.png'};
 return <div className="portfolio"><div className="case__progress"/><header className="topbar"><div className="topbar__inner"><Link className="brandmark" href="/"><Image className="brandmark__ava" src={profile.avatar} alt="" width={40} height={40}/><span className="brandmark__name">{profile.name}</span></Link><nav className="pillnav"><a className="pill" href={`mailto:${profile.email}`}>Почта</a><a className="pill" href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a>{profile.resumeUrl?<a className="pill pill--dark" href={profile.resumeUrl} download="Альшевский Андрей.pdf">Скачать резюме</a>:<span className="pill pill--dark pill--disabled">Скачать резюме</span>}</nav></div></header>
 <main><article className="case case--kommo"><p className="case__lead">{slug==='migration'?'Редизайн миграционной анкеты Ozon':slug==='yoko'?'Yoko trade':slug==='maxim'?'Maxim — улучшение сценария заказа такси':custom?.lead||p.description}</p><ul className="tags case__tags">{p.type.split(' · ').filter((t:string)=>t && t!=='NDA').map((t:string)=><li key={t}>{t}</li>)}</ul>
 <dl className="case__meta"><div><dt>Моя роль</dt><dd>{custom?.role||'Продуктовый дизайнер'}</dd></div><div className="case__meta-pair"><div><dt>Год</dt><dd>{p.year}</dd></div><div><dt>Проект</dt><dd>{p.brand}</dd></div></div></dl>
 {slug!=='migration'&&slug!=='yoko'&&slug!=='global'&&slug!=='maxim'&&<div className="case__brief"><div><h2>Задача</h2><p>{slug==='migration'?'Полностью переработать UX/UI анкеты, сделать сценарий понятнее пользователям с разным уровнем цифровой грамотности и снизить количество ошибок при заполнении.':custom?.task||p.description}</p></div><div><h2>Результаты</h2><p>{slug==='migration'?'Финальное решение согласовано и передано в разработку. Сценарий сокращён до пяти обязательных этапов; решение использовали как референс в соседнем HR-направлении.':custom?.result||'Проектные решения и прототипы интерфейса.'}</p></div></div>}
 {(slug==='migration'||slug==='yoko')&&<figure className="case__hero-cover"><img src={slug==='migration'?'/projects/migration-v37/22.png':'/projects/yoko.png'} alt={slug==='migration'?'Обложка кейса Ozon HR':'Обложка кейса Yoko Trade'}/></figure>}
 {slug==='maxim' ? <div className="global-case maxim-case" dangerouslySetInnerHTML={{__html:fs.readFileSync(path.join(process.cwd(),'src/app/maxim-case.html'),'utf8')}}/> : slug==='yoko' ? <div className="yoko-case" dangerouslySetInnerHTML={{__html:fs.readFileSync(path.join(process.cwd(),'src/app/yoko-case.html'),'utf8')}}/> : slug==='migration' ? <OzonCaseBody/> : slug==='global' ? <GlobalCaseClient html={fs.readFileSync(path.join(process.cwd(),'src/app/global-case.html'),'utf8')}/> : sections.map((s,i)=><div className="case__block" key={i}>{(s.title||s.sub||s.paragraphs.length>0)&&<section className="case__section">{s.title&&<h2>{s.title}</h2>}{s.sub&&<h3>{s.sub}</h3>}<div className="case__text">{s.paragraphs.map((t,j)=><p key={j}>{t}</p>)}</div></section>}{s.image&&<figure className="shot shot--bare"><span className="shot__inset"><img src={s.image} alt={s.caption||s.sub||'Иллюстрация проекта'}/></span>{s.caption&&<figcaption>{s.caption}</figcaption>}</figure>}</div>)}

 <MoreCases projects={others} homeCovers={homeCovers}/>
 </article></main><footer className="footer"><nav className="footer__nav"><a className="pill" href={`mailto:${profile.email}`}>Почта</a><a className="pill" href={profile.telegram}>Telegram</a>{profile.resumeUrl&&<a className="pill pill--dark" href={profile.resumeUrl} download="Альшевский Андрей.pdf">Скачать резюме</a>}</nav><p className="footer__copy">{profile.name} © 2026</p></footer></div>;
}
