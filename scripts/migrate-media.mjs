import fs from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const index=JSON.parse(await fs.readFile('content/route-index.json','utf8'));
const urls=new Set();for(const p of index){const page=JSON.parse(gunzipSync(await fs.readFile('content/pages/'+p.file)));for(const i of page.images||[])if(/^https:\/\/(www\.)?temporary123.com\/wp-content\/uploads\//.test(i.src))urls.add(i.src);}
let result={};try{result=JSON.parse(await fs.readFile('content/media-map.json','utf8'));}catch{}
const queue=[...urls].filter(u=>!result[u]);let next=0;await fs.mkdir('public/media',{recursive:true});
async function worker(){while(next<queue.length){const url=queue[next++];let entry;for(let attempt=0;attempt<2;attempt++){try{const r=await fetch(url,{signal:AbortSignal.timeout(5000)});if(!r.ok){entry={status:r.status};break;}const type=r.headers.get('content-type')||'';if(!type.startsWith('image/')){entry={status:'not_image'};break;}const bytes=Buffer.from(await r.arrayBuffer());const ext=type.includes('png')?'png':type.includes('webp')?'webp':type.includes('gif')?'gif':type.includes('jpeg')?'jpg':null;if(!ext){entry={status:'unsupported_image_type'};break;}const local='/media/'+createHash('sha256').update(url).digest('hex').slice(0,24)+'.'+ext;await fs.writeFile('public'+local,bytes);entry={status:200,local,bytes:bytes.length};break;}catch{entry={status:'fetch_failed'};}}
result[url]=entry;if(next%20===0){await fs.writeFile('content/media-map.json',JSON.stringify(result));console.log('Media',next,'/',queue.length);}}}
await Promise.all([worker(),worker()]);await fs.writeFile('content/media-map.json',JSON.stringify(result));console.log('Media complete',Object.keys(result).length);
