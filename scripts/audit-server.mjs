import http from 'node:http';
import {randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {auditSite} from './audit-site.mjs';
const token=randomBytes(24).toString('hex');let running=false,latest=null,error='',progress='Ready';
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1:8787');
  if(req.headers.host!=='127.0.0.1:8787'){res.writeHead(403);res.end();return}
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method==='POST'&&url.pathname==='/scan'){
    if(req.headers.origin!=='http://127.0.0.1:8787'||url.searchParams.get('token')!==token){res.writeHead(403);res.end('Invalid local request');return}
    if(!running){running=true;error='';auditSite({log:text=>progress=text}).then(r=>latest=r).catch(e=>error=e.message).finally(()=>running=false)}
    res.writeHead(303,{Location:'/'});res.end();return;
  }
  if(req.method==='GET'&&['/report.pdf','/results.json','/report.html'].includes(url.pathname)){
    if(!latest){try{latest=JSON.parse(await readFile('output/audits/latest.json','utf8'));latest.out='output/audits/'+latest.runId}catch{}}
    if(!latest){res.writeHead(404);res.end('Run an audit first');return}
    try{const data=await readFile(latest.out+url.pathname);res.setHeader('Content-Type',url.pathname.endsWith('.pdf')?'application/pdf':url.pathname.endsWith('.json')?'application/json':'text/html');if(url.pathname.endsWith('.pdf'))res.setHeader('Content-Disposition','attachment; filename="website-audit.pdf"');res.end(data)}catch{res.writeHead(404);res.end('Report unavailable')}return;
  }
  if(req.method!=='GET'||url.pathname!=='/'){res.writeHead(404);res.end();return}
  const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">${running?'<meta http-equiv="refresh" content="5">':''}<title>Local website audit</title><style>body{font:16px/1.7 system-ui;background:#eef2fa;color:#17243c;margin:0;padding:clamp(20px,6vw,80px)}main{max-width:850px;margin:auto;background:white;border-radius:22px;padding:32px;box-shadow:0 20px 60px #20325a12}h1{font-size:36px}button,a{display:inline-block;background:#5141b8;color:white;padding:12px 20px;border:0;border-radius:9px;text-decoration:none;margin:6px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f2f5fa;padding:20px}small{color:#53637b}</style></head><body><main><small>LOCAL ENGINEERING WORKSPACE</small><h1>Website quality scan</h1><p>Scans the configured site with Chromium at five widths in light and dark themes, audits accessibility, images, scripts, links and curriculum interactions, then creates PDF, HTML and JSON reports.</p><p>Target: ${esc(process.env.AUDIT_BASE_URL||'http://127.0.0.1:3210')}</p><form method="POST" action="/scan?token=${token}"><button ${running?'disabled':''}>${running?'Scan in progress…':'Run full website scan'}</button></form><pre>${esc(error||progress)}</pre>${latest?'<a href="/report.pdf">Download PDF report</a><a href="/report.html">Read report</a><a href="/results.json">JSON evidence</a>':''}<p>No automated scan can prove every visual detail or every user journey. Reports distinguish passed, failed, warning, skipped and informational checks.</p><small>The runner is available only on this computer. Keep the website development server running.</small></main></body></html>`);
});
server.listen(8787,'127.0.0.1',()=>console.log('Audit dashboard: http://127.0.0.1:8787'));
