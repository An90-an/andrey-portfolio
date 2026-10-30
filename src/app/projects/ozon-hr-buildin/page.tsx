import Link from 'next/link';
import content from '../../migration-case.json';
import './buildin.css';

type Node = {type:string;raw?:string;attrs?:{level?:number;url?:string;ordered?:boolean};children?:Node[]};
export function inline(nodes:Node[]=[]):React.ReactNode{return nodes.map((n,i)=>{const body=inline(n.children);if(n.type==='text')return <span key={i}>{n.raw}</span>;if(n.type==='strong')return <strong key={i}>{body}</strong>;if(n.type==='emphasis')return <em key={i}>{body}</em>;if(n.type==='codespan')return <code key={i}>{n.raw}</code>;if(n.type==='link')return <a key={i} href={n.attrs?.url}>{body}</a>;if(n.type==='softbreak'||n.type==='linebreak')return <br key={i}/>;return <span key={i}>{body}</span>})}
export function block(n:Node,i:number):React.ReactNode{const ch=n.children||[];
if(n.type==='blank_line'||n.type==='thematic_break')return null;
if(n.type==='heading'){const t=inline(ch);return n.attrs?.level===1?<h2 key={i}>{t}</h2>:n.attrs?.level===2?<h3 key={i}>{t}</h3>:<h4 key={i}>{t}</h4>}
if(n.type==='paragraph'){const img=ch.find(c=>c.type==='image');if(img)return <figure key={i}><img src={img.attrs?.url} alt="Экран миграционной анкеты" loading="lazy"/></figure>;const plain=ch.map(c=>c.raw||'').join('').trim();
if(plain==='Пользователь должен сразу понимать, что сейчас нужно сделать, какой документ приложить и что делать, если он не знает, как это сделать.')return <aside key={i} className="ozon-buildin__callout ozon-buildin__callout--info"><span className="ozon-buildin__info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#0788FF"/><circle cx="12" cy="6.8" r="1.45" fill="white"/><path d="M12 10.6v7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg></span><div>{inline(ch)}</div></aside>;
if(plain==='Изначальная версия интерфейса была ориентирована на опытных пользователей, поэтому для целевой аудитории некоторые элементы и сценарии взаимодействия оказались недостаточно понятными и интуитивными.')return <aside key={i} className="ozon-buildin__callout ozon-buildin__callout--warning"><span className="ozon-buildin__warning-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#FFC400"/><circle cx="12" cy="7.5" r="1.45" fill="white"/><path d="M12 11v6" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg></span><div>{inline(ch)}</div></aside>;
if(ch.some(c=>c.type==='softbreak')&&ch.some(c=>c.type==='strong'&&c.children?.[0]?.raw==='Роль:'))return <div key={i} className="ozon-buildin__facts">{inline(ch)}</div>;
return <p key={i}>{inline(ch)}</p>}
if(n.type==='list'){const Tag=n.attrs?.ordered?'ol':'ul';return <Tag key={i}>{ch.map((li,j)=><li key={j}>{(li.children||[]).map((v,k)=><span key={k}>{inline(v.children||[])}</span>)}</li>)}</Tag>}
if(n.type==='block_quote')return <blockquote key={i}>{ch.map((v,j)=><p key={j}>{inline(v.children||[])}</p>)}</blockquote>;
return null}
export default function OzonBuildinTest(){return <div className="ozon-buildin"><div className="ozon-buildin__toolbar"><Link href="/projects/migration">← Вернуться к текущему кейсу Ozon HR</Link><span>Тестовая версия · в стиле Buildin</span></div><main className="ozon-buildin__document"><div className="ozon-buildin__emoji">🖥️</div><h1>Редизайн миграционной анкеты Ozon</h1>{(content as Node[]).map(block)}</main></div>}

export function OzonCaseBody(){
 const nodes=content as Node[];
 const headings=['Контекст','Пользователи','Проблема','Цели','Ограничения','Моя роль','Процесс','Ключевые дизайн-решения','Результат','Backlog'];
 const groups:{heading:string;nodes:Node[]}[]=[];
 for(const n of nodes){
  if(n.type==='heading' && n.attrs?.level===1){
   const name=(n.children||[]).map(c=>c.raw||c.children?.map(v=>v.raw||'').join('')||'').join('').trim();
   if(headings.some(h=>name===h||h==='Backlog'&&name.startsWith('Backlog'))){groups.push({heading:name,nodes:[n]});continue;}
  }
  // The original exported document includes a second hero image and obsolete iteration screenshots.
  // Keep the approved screenshots from the Buildin case only, without the earlier duplicate exports.
  if(!groups.length)continue;
  if(n.type==='paragraph' && (n.children||[]).some(c=>c.type==='image' && (/migration-iteration-[123]\.png$/.test(c.attrs?.url||''))))continue;
  if(n.type==='thematic_break'||n.type==='blank_line')continue;
  groups[groups.length-1].nodes.push(n);
 }
 return <div className="ozon-buildin ozon-buildin--embedded"><div className="ozon-buildin__document">{groups.map(g=>{const isProcess=g.heading==='Процесс';const entries:React.ReactNode[]=[];let acc:Node[]=[];let active=false;let index=0;const flush=()=>{if(acc.length){entries.push(<details className="ozon-buildin__iteration-details" key={'accordion-'+index++}><summary>Процесс</summary><div className="ozon-buildin__iteration-content">{acc.map(block)}</div></details>);acc=[]}};for(const n of g.nodes){const heading=n.type==='heading'&&n.attrs?.level===2;const title=heading?(n.children||[]).map(c=>c.raw||'').join(''):'';if(heading){flush();active=/^(Первая|Вторая) итерация/.test(title)}if(active&&n.type==='paragraph'&&!(n.children||[]).some(c=>c.type==='image')){acc.push(n);continue}if(active&&n.type==='list'){acc.push(n);continue}if(active&&n.type==='heading'&&n.attrs?.level===3){acc.push(n);continue}if(active&&n.type==='paragraph'&&(n.children||[]).some(c=>c.type==='image')){flush();entries.push(block(n,index++));continue}if(!active)flush();entries.push(block(n,index++))}flush();return <section className="ozon-buildin__chapter" key={g.heading}>{isProcess?entries:g.nodes.map(block)}<hr className="ozon-buildin__chapter-divider"/></section>})}</div></div>;
}
