import fs from 'node:fs/promises';
const rows=Object.values(JSON.parse(await fs.readFile('../backlinks.json','utf8')))[0].slice(1);
const index=JSON.parse(await fs.readFile('content/route-index.json','utf8'));
const paths=new Set(index.map(p=>p.path));
const records=rows.map(r=>{const u=new URL(r[1]);const p=u.pathname.replace(/\/$/,'')+'/';return {original:r[1],path:u.pathname,referringDomains:r[5],sourceExportStatus:r[13],migrationStatus:p==='/'?'rebuilt_homepage':paths.has(p)?'source_content_recovered':'needs_source_recovery',target:'https://temporary123.com'+p};});
await fs.writeFile('audit/backlink-reconciliation.json',JSON.stringify(records,null,2));
const totals=records.reduce((a,r)=>(a[r.migrationStatus]=(a[r.migrationStatus]||0)+1,a),{});
await fs.writeFile('audit/migration-summary.json',JSON.stringify({checkedAt:new Date().toISOString(),spreadsheetRows:records.length,uniquePaths:new Set(records.map(r=>r.path)).size,recoveredPages:index.length,expectedPages:98253,backlinks:totals,cutoverReady:false,reason:'Full source export, missing legacy URL recovery and media verification required before domain migration.'},null,2));
console.log(totals);
