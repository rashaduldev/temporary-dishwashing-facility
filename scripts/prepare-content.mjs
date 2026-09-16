import fs from 'node:fs/promises';
import {gunzipSync,gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const pages=new Map();
for(const f of (await fs.readdir('content/catalog')).filter(f=>f.endsWith('.gz')).sort())for(const p of JSON.parse(gunzipSync(await fs.readFile('content/catalog/'+f))))pages.set(p.path,p);
for(const f of await fs.readdir('content/priority')){const p=JSON.parse(await fs.readFile('content/priority/'+f,'utf8'));pages.set(p.path,p);}
const manifest=[];
await fs.mkdir('content/pages',{recursive:true});
for(const p of pages.values()){
 p.path=p.path.replace(/\/$/,'')+'/';
 const file=createHash('sha256').update(p.path).digest('hex')+'.json.gz';
 await fs.writeFile('content/pages/'+file,gzipSync(JSON.stringify(p)));
 manifest.push({path:p.path,title:p.title,file,id:p.id,description:p.description});
}
manifest.sort((a,b)=>a.path.localeCompare(b.path));
await fs.writeFile('content/route-index.json',JSON.stringify(manifest));
const meta=JSON.parse(await fs.readFile('content/import-meta.json','utf8'));
await fs.writeFile('content/migration-status.json',JSON.stringify({source:meta.source,expected:meta.total,recovered:manifest.length,complete:manifest.length===meta.total,checkedAt:new Date().toISOString()},null,2));
console.log('Prepared',manifest.length,'of',meta.total,'source pages. Full cutover remains blocked until recovery and asset checks complete.');
