import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function auditSite({ baseURL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3210', external = true, quick = false, log = console.log } = {}) {
  const origin = new URL(baseURL).origin;
  const started = new Date();
  const runId = started.toISOString().replace(/[:.]/g,'-');
  const out = path.resolve('output/audits', runId);
  await mkdir(path.join(out,'screenshots'), {recursive:true});
  const results = [], links = new Map(), pages = new Set(['/', '/blogs', '/contact', '/guide', '/sitemap.xml', '/robots.txt', '/manifest.webmanifest']);
  for (const file of await readdir('public/learning')) if (file.endsWith('.html')) pages.add('/learning/'+file);
  const add = (page, profile, check, status, detail='') => results.push({page,profile,check,status,detail});
  const profiles = quick ? [{width:1440,height:1000,theme:'light'}] : [320,390,768,1440,1920].flatMap(width=>['light','dark'].map(theme=>({width,height:900,theme})));
  const browser = await chromium.launch();
  try {
    for (const route of pages) {
      if (!route.endsWith('.html') && route !== '/' && !['/blogs','/contact','/guide'].includes(route)) continue;
      for (const p of profiles) {
        const profile = `${p.width}px / ${p.theme}`; log(`Scanning ${route} · ${profile}`);
        const context = await browser.newContext({viewport:{width:p.width,height:p.height},colorScheme:p.theme,reducedMotion:'reduce'});
        await context.addInitScript(theme=>{try{localStorage.setItem('ap-theme',theme);localStorage.setItem('tech-guides-theme',theme)}catch{}},p.theme);
        const page = await context.newPage(); const errors=[], failed=[];
        page.on('pageerror',e=>errors.push(e.message));
        page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
        page.on('requestfailed',r=>{if(!r.failure()?.errorText.includes('ERR_ABORTED'))failed.push(`${r.failure()?.errorText} ${r.url()}`)});
        try {
          const response = await page.goto(origin+route,{waitUntil:'load',timeout:60000});
          await page.evaluate(async()=>{
            await document.fonts.ready;
            const visibleImages=[...document.images].filter(img=>img.loading!=='lazy'||img.getBoundingClientRect().top<innerHeight*2);
            await Promise.race([
              Promise.all(visibleImages.map(img=>img.decode().catch(()=>{}))),
              new Promise(resolve=>setTimeout(resolve,15000)),
            ]);
          });
          add(route,profile,'Navigation',response?.ok()?'pass':'fail',`${response?.status()} ${page.url()}`);
          // Traverse open shadow roots too: shared learning headers and footers use them.
          const evidence = await page.evaluate(()=>{
            const all=[];function collect(root){root.querySelectorAll('*').forEach(el=>{all.push(el);if(el.shadowRoot)collect(el.shadowRoot)})}collect(document);
            const images=all.filter(el=>el.tagName==='IMG');
            const broken=images.filter(img=>img.complete&&img.naturalWidth===0).map(img=>img.currentSrc||img.src);
            const hidden=images.filter(img=>{const r=img.getBoundingClientRect(),s=getComputedStyle(img);return img.naturalWidth>0&&(r.width===0||r.height===0||s.visibility==='hidden'||s.opacity==='0')}).map(img=>({src:img.src,context:img.closest('[hidden],details:not([open])')?'collapsed content':'hidden image'}));
            return {images:images.length,broken,hidden,title:document.title,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+2,
              overflowElements:all.filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+2&&!el.closest('.sequence-scroll')}).slice(0,10).map(el=>el.tagName+'.'+el.className),
              links:all.filter(el=>el.tagName==='A'&&el.href).map(a=>a.href),
              topics:document.querySelectorAll('.topic-check').length,logos:document.querySelectorAll('.technology-strip img').length};
          });
          add(route,profile,'Image decoding',evidence.broken.length?'fail':'pass',JSON.stringify({total:evidence.images,broken:evidence.broken}));
          add(route,profile,'Image visibility inventory','info',JSON.stringify(evidence.hidden));
          add(route,profile,'Horizontal overflow',evidence.overflow?'fail':'pass',JSON.stringify(evidence.overflowElements));
          add(route,profile,'Page semantics',evidence.title&&evidence.h1===1?'pass':'warn',`Title: ${evidence.title}; H1 count: ${evidence.h1}`);
          for(const url of evidence.links){if(!links.has(url))links.set(url,new Set());links.get(url).add(route)}
          if(route.includes('dotnet-solution')) {
            add(route,profile,'Curriculum enhancement',evidence.topics===422&&evidence.logos>=27?'pass':'fail',`${evidence.topics} topics; ${evidence.logos} technology logos`);
            const options=page.locator('.player-select option');
            add(route,profile,'Animation catalog',await options.count()===53?'pass':'fail',`${await options.count()} options (timeline + 52 flows expected)`);
            if(await options.count()===53){
              for(let i=0;i<52;i++){await page.locator('.player-select select').selectOption(String(i));const count=await page.locator('.message').count();if(!count)add(route,profile,'Animation '+i,'fail','No directed messages rendered')}
              await page.locator('.player-select select').selectOption('0');
              await page.getByRole('button',{name:'Next step',exact:true}).click();
              add(route,profile,'Animation stepping',await page.locator('.message.current').count()===1?'pass':'fail','REST first message becomes active');
            }
            await page.locator('#curriculumSearch').fill('delegates');
            add(route,profile,'Topic search',await page.locator('.part:not(.filtered) .module:not(.hidden)').count()>0?'pass':'fail','Delegates search yields modules');
            await page.locator('#curriculumSearch').fill('');
            await page.locator('.module').first().evaluate(el=>el.open=true);
            const checkbox=page.locator('[data-topic]').first();await checkbox.check();await page.reload({waitUntil:'load'});
            add(route,profile,'Progress persistence',await page.locator('[data-topic]').first().isChecked()?'pass':'fail','Checked topic survives reload');
          }
          const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
          add(route,profile,'Accessibility',axe.violations.length?'warn':'pass',JSON.stringify(axe.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,url:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,12)}))));
          await page.screenshot({path:path.join(out,'screenshots',`${route.replace(/\W/g,'_')||'home'}-${p.width}-${p.theme}.png`),fullPage:false});
        } catch(error) {add(route,profile,'Scan execution','fail',error.stack||error.message)}
        finally {add(route,profile,'JavaScript runtime',errors.length?'fail':'pass',errors.join('\n'));add(route,profile,'Network resources',failed.length?'warn':'pass',[...new Set(failed)].join('\n'));await context.close()}
      }
    }
    // Inventory every local static image, including logos not currently rendered.
    async function assets(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const name=path.join(dir,entry.name);if(entry.isDirectory())await assets(name);else if(/\.(svg|png|jpe?g|webp|ico|pdf)$/i.test(name))links.set(origin+'/'+name.replace(/^public\//,''),new Set(['static asset inventory']))}}
    await assets('public');
    for(const route of ['/sitemap.xml','/robots.txt','/manifest.webmanifest'])links.set(origin+route,new Set(['metadata inventory']));
    const entries=[...links]; let cursor=0;
    async function linkWorker(){while(cursor<entries.length){const [href,sources]=entries[cursor++];let url;try{url=new URL(href)}catch{continue}if(!['http:','https:'].includes(url.protocol)){add(href,'links','Non-HTTP link','info','Manual check required');continue}if(url.port==='8787'){add(href,'links','Local audit dashboard','info','Only available while pnpm audit:serve runs');continue}const local=url.origin===origin;if(!local&&!external){add(href,'links','External link','skipped','External checking disabled');continue}try{let response;for(let attempt=0;attempt<2;attempt++){response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(15000)});await response.body?.cancel();if(response.status<500)break}add(href,'links',local?'Local resource':'External reference',response.ok?'pass':local?'fail':'warn',`HTTP ${response.status}; linked from ${[...sources].join(', ')}`)}catch(e){add(href,'links',local?'Local resource':'External reference',local?'fail':'warn',e.message)}}}
    log(`Checking ${entries.length} unique links and assets`);await Promise.all(Array.from({length:6},linkWorker));
  } finally {await browser.close()}
  const summary={};for(const r of results)summary[r.status]=(summary[r.status]||0)+1;
  const report={runId,baseURL:origin,started:started.toISOString(),finished:new Date().toISOString(),profiles,summary,results,limitations:['Chromium only; not a certification of every browser or device.','Automated accessibility findings require human review.','External rate limits/authentication/timeouts are warnings, not proof of broken pages.','No destructive actions, third-party sign-ins, form submissions, or load/security penetration tests.','Image decoding cannot establish logo authenticity or visual quality. Screenshots support manual review.']};
  await writeFile(path.join(out,'results.json'),JSON.stringify(report,null,2));
  const counts=['pass','fail','warn','skipped','info'];const colors={pass:'#09866b',fail:'#c43251',warn:'#a36a08',skipped:'#64748b',info:'#4564b7'};
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>Website Quality Report</title><style>@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font:11px/1.6 Arial,sans-serif;color:#243047;margin:0}h1{font-size:34px;line-height:1.1;margin:14px 0}h2{font-size:20px;margin-top:28px}small{color:#607087}.cover{padding:25px;background:#edf3ff;border-top:6px solid #5364cc;border-radius:8px}.stats{display:flex;gap:12px;margin:24px 0}.stat{flex:1;padding:12px;background:#f1f5f9;border-radius:7px}.stat b{font-size:24px;display:block}.bar{height:24px;display:flex;border-radius:5px;overflow:hidden}.bar span{display:block}.legend{margin-top:10px}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{text-align:left;padding:7px;border-bottom:1px solid #dde3ed;vertical-align:top;overflow-wrap:anywhere}th{background:#eef2f9}thead{display:table-header-group}tr{break-inside:avoid}.detail{white-space:pre-wrap;font-size:9px}.finding{break-inside:avoid;border-left:3px solid #b06c0a;padding:10px;margin:12px 0;background:#f8fafc}.finding p{overflow-wrap:anywhere}.appendix{break-before:page}.status{font-weight:bold}.footer{color:#708098;font-size:9px}a{color:#3155a5}</style></head><body><div class="cover"><small>ENGINEERING QUALITY / AUTOMATED EVIDENCE</small><h1>Website audit report</h1><p>${escape(origin)}</p><p>${escape(report.started)} · Chromium / Playwright + axe-core</p><strong>${summary.fail?'ACTION REQUIRED':'No automated failures detected'}${summary.warn?' · review warnings':''}</strong></div><div class="stats">${counts.map(k=>`<div class="stat"><b style="color:${colors[k]}">${summary[k]||0}</b>${k.toUpperCase()}</div>`).join('')}</div><div class="bar">${counts.map(k=>`<span style="background:${colors[k]};width:${100*(summary[k]||0)/Math.max(1,results.length)}%"></span>`).join('')}</div><p class="legend">${counts.map(k=>`<span style="color:${colors[k]}">■ ${k}</span>`).join(' &nbsp; ')}</p><h2>Scope and method</h2><p>${profiles.length} viewport/theme combinations. Local HTML pages, portfolio routes, loaded image decoding, hidden-image inventory, JavaScript errors, failed requests, overflow, semantics, WCAG rules, .NET animation selection/stepping, search, saved progress, static assets and discovered hyperlinks.</p><h2>Coverage limits</h2><ul>${report.limitations.map(x=>`<li>${escape(x)}</li>`).join('')}</ul><h2>Page checks</h2><table><thead><tr><th>Page</th><th>Passed</th><th>Failed</th><th>Warnings</th></tr></thead><tbody>${[...new Set(results.filter(r=>r.profile!=='links').map(r=>r.page))].map(p=>`<tr><td>${escape(p)}</td>${['pass','fail','warn'].map(s=>`<td>${results.filter(r=>r.page===p&&r.status===s).length}</td>`).join('')}</tr>`).join('')}</tbody></table><h2>Findings requiring review</h2>${results.filter(r=>['fail','warn'].includes(r.status)).map(r=>`<div class="finding"><strong>${escape(r.status.toUpperCase()+' · '+r.check)}</strong><p>${escape(r.page+' · '+r.profile)}</p><div class="detail">${escape(r.detail)}</div></div>`).join('')||'<p>No failed checks or warnings.</p>'}<div class="appendix"><h2>Complete execution ledger</h2><p>Full machine-readable evidence: results.json. Viewport screenshots are stored in the screenshots directory.</p><table><thead><tr><th style="width:30%">Target</th><th style="width:20%">Check</th><th style="width:10%">Status</th><th>Evidence</th></tr></thead><tbody>${results.map(r=>`<tr><td>${escape(r.page)}<br>${escape(r.profile)}</td><td>${escape(r.check)}</td><td style="color:${colors[r.status]}">${escape(r.status)}</td><td class="detail">${escape(r.detail)}</td></tr>`).join('')}</tbody></table></div></body></html>`;
  await writeFile(path.join(out,'report.html'),html);
  const pdfBrowser=await chromium.launch();try{const page=await pdfBrowser.newPage();await page.goto(pathToFileURL(path.join(out,'report.html')).href);await page.pdf({path:path.join(out,'report.pdf'),format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:9px;width:100%;text-align:center;color:#64748b">Website quality audit · <span class="pageNumber"></span> / <span class="totalPages"></span></div>',margin:{top:'16mm',bottom:'18mm',left:'16mm',right:'16mm'}})}finally{await pdfBrowser.close()}
  await writeFile('output/audits/latest.json',JSON.stringify({runId,summary}));log(`Report: ${out}/report.pdf`);return {out,runId,summary};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){auditSite({quick:process.argv.includes('--quick'),external:!process.argv.includes('--no-external')}).then(r=>{process.exitCode=r.summary.fail?1:0}).catch(e=>{console.error(e);process.exitCode=2})}
