import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
const dir='content/catalog';
await fs.mkdir(dir,{recursive:true});
const cleanText=s=>load(s||'').text().replace(/\s+/g,' ').trim();
export function extract(page){
 const $=load(page.content?.rendered||'');
 $('script,style,noscript,form,iframe,nav,header,footer,svg,button,input,select,textarea').remove();
 const images=[];
 $('img').each((_,el)=>{const e=$(el);let src=e.attr('data-src')||e.attr('src');if(src?.startsWith('http'))images.push({src,alt:e.attr('alt')||''});});
 const title=cleanText($('h1').first().html())||cleanText(page.title?.rendered);
 const allowed=new Set(['h2','h3','h4','h5','h6','p','ul','ol','li','a','strong','b','em','i','br','table','thead','tbody','tr','th','td','blockquote','figure','figcaption','img']);
 $('h1').each((_,e)=>{$(e).replaceWith(`<h2>${$(e).html()}</h2>`)});
 $('*').get().reverse().forEach(el=>{if(['html','head','body'].includes(el.tagName))return;const e=$(el);if(!allowed.has(el.tagName)){e.replaceWith(e.contents());return;}
  const attrs={...el.attribs};for(const key of Object.keys(attrs))e.removeAttr(key);
  if(el.tagName==='a'){let h=attrs.href||'';if(/^https?:\/\/(www\.)?temporary123\.com\//i.test(h))h=new URL(h).pathname+new URL(h).search+new URL(h).hash;if(h.startsWith('/')||h.startsWith('#')||/^https?:|^mailto:|^tel:/.test(h))e.attr('href',h);}
  if(el.tagName==='img'){let src=attrs['data-src']||attrs.src;if(src?.startsWith('http')){e.attr('src',src);e.attr('alt',attrs.alt||'');e.attr('loading','lazy');e.attr('decoding','async');}else e.remove();}
 });
 $('p,h2,h3,h4,h5,h6,a,li').each((_,e)=>{if(!$(e).text().trim()&&!$(e).find('img').length)$(e).remove();});
 const html=($('body').html()||'').replace(/\s+/g,' ').trim();
 return {id:page.id,path:new URL(page.link).pathname,title,html,images,modified:page.modified,description:cleanText(page.excerpt?.rendered).slice(0,165)||cleanText(html).slice(0,165)};
}
async function request(url){for(let i=0;i<7;i++)try{const r=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error(`HTTP ${r.status}`);return {data:await r.json(),total:Number(r.headers.get('x-wp-total')),pages:Number(r.headers.get('x-wp-totalpages'))};}catch(e){if(i===6)throw e;}}
async function run(){
const fields='id,link,title,content,excerpt,modified';
const base=`https://temporary123.com/wp-json/wp/v2/pages?per_page=100&orderby=id&order=asc&_fields=${fields}`;
const first=await request('https://temporary123.com/wp-json/wp/v2/pages?per_page=100&_fields=id');
await fs.writeFile('content/import-meta.json',JSON.stringify({source:'https://temporary123.com',startedAt:new Date().toISOString(),total:first.total,batches:first.pages,scope:'All public WordPress pages',sanitization:'Preserves text, semantic markup, links and image references; removes executable scripts, styles, forms and layout wrappers.'},null,2));
let next=1,done=0;const errors=[];
async function worker(){while(next<=first.pages){const n=next++;const file=`${dir}/${String(n).padStart(4,'0')}.json.gz`;try{try{await fs.access(file);done++;continue;}catch{}const r=await request(base+'&page='+n);const pages=r.data.map(extract);await fs.writeFile(file,gzipSync(JSON.stringify(pages)));done++;if(done%10===0||done===1)console.log(JSON.stringify({done,total:first.pages,pages:done*100}));}catch(e){errors.push({batch:n,error:e.message});console.log('FAILED',n,e.message);}}}
await Promise.all(Array.from({length:6},()=>worker()));
await fs.writeFile('content/import-errors.json',JSON.stringify(errors,null,2));
console.log('COMPLETE',done,'batches',errors.length,'errors');
if(errors.length)process.exitCode=1;
}
if(process.argv[1]?.endsWith('import-wordpress.mjs'))await run();
