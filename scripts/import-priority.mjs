import fs from 'node:fs/promises';
import { extract } from './import-wordpress.mjs';
const nav=JSON.parse(await fs.readFile('../live/navigation.json','utf8'));
const book=Object.values(JSON.parse(await fs.readFile('../backlinks.json','utf8')))[0].slice(1);
const urls=[...new Set([...nav.map(x=>x.url),...book.map(x=>x[1])].filter(x=>/^https?:\/\/(www\.)?temporary123.com\//.test(x)).map(x=>new URL(x).pathname))].filter(x=>x!=='/');
await fs.mkdir('content/priority',{recursive:true});
let next=0;const failures=[];
async function worker(){while(next<urls.length){const path=urls[next++],slug=path.split('/').filter(Boolean).at(-1);try{const file=`content/priority/${encodeURIComponent(path)}.json`;try{await fs.access(file);continue;}catch{}let data;for(let retry=0;retry<6;retry++)try{let r=await fetch(`https://temporary123.com/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id,link,title,content,excerpt,modified`,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error(String(r.status));data=await r.json();break;}catch(e){if(retry===5)throw e;}
const page=data.find(p=>new URL(p.link).pathname.replace(/\/$/,'')===path.replace(/\/$/,''));if(!page)throw Error('No matching published page');await fs.writeFile(file,JSON.stringify(extract(page)));console.log('OK',path);}catch(e){failures.push({path,error:e.message});console.log('FAIL',path,e.message);}}}
await Promise.all([worker(),worker()]);await fs.writeFile('content/priority-errors.json',JSON.stringify(failures,null,2));
