"""Read the original workbook and regenerate evidence CSV/JSON. pip install openpyxl."""
import openpyxl,sys,csv,json,re,collections,hashlib
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit
src=Path(sys.argv[1]);out=Path(__file__).resolve().parents[1]/'audit'
out.mkdir(exist_ok=True)
w=openpyxl.load_workbook(src,data_only=True);s=w.active
values=list(s.values);headers=list(values.pop(0));rows=[dict(zip(headers,r)) for r in values if any(x is not None for x in r)]
def norm(u):
 p=urlsplit(u);path=p.path or '/'
 if not Path(path).suffix:path=path.rstrip('/')+'/'
 return urlunsplit(('https',p.hostname.removeprefix('www.'),path,p.query,''))
def export(name,data):
 with (out/name).open('w',newline='') as f:
  d=csv.DictWriter(f,fieldnames=list(data[0]));d.writeheader();d.writerows(data)
groups=collections.Counter(norm(r['Page URL']) for r in rows)
metrics=collections.Counter(tuple(r[k] for k in ['Referring domains','Top DR','Links to target','Dofollow','Nofollow']) for r in rows)
inv=[];mapping=[]
for i,r in enumerate(rows,2):
 u=r['Page URL'];p=urlsplit(u);n=norm(u);path=p.path
 service= 'Restroom trailers' if 'restroom' in path else 'Mobile kitchens' if 'kitchen' in path else 'Workforce housing' if any(x in path for x in ['housing','workforce','basecamp','berthing']) else 'Other'
 typ='Home' if path=='/' else 'Asset' if '/wp-content/' in path else 'Service/location candidate'
 location='Houston, Texas' if 'houston' in path else (re.search(r'(?:-in-)([^/]+)/?$',path).group(1).replace('-',' ').title() if re.search(r'(?:-in-)([^/]+)/?$',path) else 'Unknown')
 rd=r['Referring domains'] or 0;links=r['Links to target'] or 0;dr=r['Top DR'] or 0
 flags=[]
 if links>=1000 and rd<=4:flags.append('Possible sitewide pattern; source review required')
 if (r['Dofollow'] or 0)+(r['Nofollow'] or 0)!=links:flags.append('Link totals do not reconcile')
 if metrics[tuple(r[k] for k in ['Referring domains','Top DR','Links to target','Dofollow','Nofollow'])]>=5:flags.append('Repeated aggregate metrics; not proof of duplicate content')
 if r['Page HTTP code'] in [403,None]:flags.append('Live fetch/indexability unresolved')
 if typ=='Asset':flags.append('Asset rights and exact replacement unresolved')
 strong=path=='/' or 'houston-texas-mobile-kitchen' in path or 'portable-restroom-trailers-in-california' in path
 if strong:priority='B' if u!=n else 'A';reason='Protect high-value candidate; verify source links and business relevance'
 elif flags and any('sitewide' in f or 'Repeated' in f or 'reconcile' in f for f in flags):priority='C';reason='Manual quality review before any migration decision'
 elif r['Page HTTP code'] in [403,None] or not r['Page title']:priority='E';reason='Insufficient content and backlink source evidence'
 else:priority='C';reason='Review commercial relevance and equivalent content'
 missing=['Source URLs','Anchor text','Link context','Live canonical','Google indexation','Traffic/conversions','Business coverage','Approved target origin']
 row={'Row ID':f'URL-{i:03}', 'Original URL':u,'Normalized URL':n,'Host variant':p.hostname,'Scheme':p.scheme,'Path':path,'Page type':typ,'Topic/service':service,'State/city inferred from slug':location,'Export HTTP status':r['Page HTTP code'],'Live HTTP status':'Not verified','Canonical status':'Unknown','Page title':r['Page title'],'Referring domains':rd,'Top DR':dr,'UR':r['UR'],'Total links':links,'Dofollow':r['Dofollow'],'Nofollow':r['Nofollow'],'New links':r['New Links'],'Lost links':r['Lost Links'],'Redirect count (export metric)':r['Redirects'],'First seen':r['First seen'],'Last seen':r['Last seen'],'Variant group size':groups[n],'Estimated business importance':'High candidate' if strong else 'Unverified','Priority':priority,'Migration risk':'High' if strong or links>1000 else 'Unresolved','Recommended action':'Preserve path pending review' if strong else 'Escalate for manual review','Destination URL':'Unassigned — production origin/content unapproved','Reason':reason,'Review flags':'; '.join(flags),'Missing data':'; '.join(missing),'Review status':'Pending owner and source-level evidence'}
 inv.append(row)
 mapping.append({'Row ID':row['Row ID'],'Old URL':u,'New URL':'','Proposed retained path':urlsplit(n).path,'Action':row['Recommended action'],'Redirect code':'','Canonical target':'','Priority':priority,'Reason':reason,'Link-equity evidence':f'{rd} referring domains; Top DR {dr}; {links} links (export snapshot)','Content-equivalence evidence':'Not established','QA status':'Not activated','Owner':'Business owner + SEO lead','Approval status':'Pending'})
export('url-inventory.csv',inv);export('migration-map.csv',mapping)
export('high-value-candidates.csv',[r for r in inv if r['Priority'] in ['A','B'] or r['Top DR']>=50 or r['Referring domains']>2])
export('manual-review.csv',[r for r in inv if r['Priority'] in ['C','E'] or r['Review flags']])
meanings=['Exported target page title','Destination URL, not referring source','Detected target language','Detected target platform','Provider URL rating, not Google metric','Aggregate referring-domain count; overlaps unknown','Highest source Domain Rating, not a quality verdict','Aggregate links to this target','Provider new-link count; time window not supplied','Provider lost-link count; time window not supplied','Aggregate followed links','Aggregate nofollow links','Provider redirect metric; NOT verified chain length','Crawler HTTP snapshot, not live status','Provider first observation timestamp','Provider last observation timestamp']
fields=[{'Spreadsheet field':k,'Available or missing':'Available','Interpreted meaning':v,'Reliability':'Historical provider snapshot; semantics need original export documentation','Use':'Inventory and prioritization only','Blank count':sum(r[k] is None for r in rows),'Additional data required':'Original provider report settings and fresh crawl'} for k,v in zip(headers,meanings)]
for f in ['Referring page URL','Referring domain identity','Anchor text','Per-link follow status','Sponsored/UGC attributes','Link placement','Organic traffic','Redirect destination/chain','Source topical context','Google-selected canonical','Search Console clicks/impressions','Conversions']:
 fields.append({'Spreadsheet field':f,'Available or missing':'Missing','Interpreted meaning':'Not present','Reliability':'Unavailable','Use':'Required before final migration/quality decisions','Blank count':len(rows),'Additional data required':'Backlink-level export, crawl, analytics or Search Console as appropriate'})
export('field-mapping.csv',fields)
dates={k:{'minimum':min(str(r[k]) for r in rows if r[k]),'maximum':max(str(r[k]) for r in rows if r[k])} for k in ['First seen','Last seen']}
summary={'workbook':src.name,'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'sheets':w.sheetnames,'data_rows':len(rows),'columns':len(headers),'exact_unique_urls':len(set(r['Page URL'] for r in rows)),'normalized_strategic_targets':len(groups),'scheme_preserving_www_normalized_targets':len(set(urlunsplit((urlsplit(r['Page URL']).scheme,'temporary123.com',urlsplit(r['Page URL']).path,urlsplit(r['Page URL']).query,'')) for r in rows)),'status_counts':dict(collections.Counter(str(r['Page HTTP code']) for r in rows)),'missing_by_field':{k:sum(r[k] is None for r in rows) for k in headers},'dates':dates,'priority_counts':dict(collections.Counter(r['Priority'] for r in inv)),'nonreconciling_rows':sum('reconcile' in r['Review flags'] for r in inv),'host_counts':dict(collections.Counter(urlsplit(r['Page URL']).hostname for r in rows)),'scheme_counts':dict(collections.Counter(urlsplit(r['Page URL']).scheme for r in rows)),'repeated_metric_groups':[{'metrics':list(k),'rows':v} for k,v in metrics.items() if v>=5]}
(out/'summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
