(function () {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const themeKey = 'ap-theme';
  const getTheme = () => {
    try {
      const saved = localStorage.getItem(themeKey) || localStorage.getItem('tech-guides-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(themeKey, theme);
      localStorage.setItem('tech-guides-theme', theme);
    } catch {}
  };
  applyTheme(getTheme());
  const pageTitles = {
    'index.html': 'Technology Guides',
    'ai-solution-architect-curriculum.html': 'AI Solution Architect Curriculum',
    'azure-services.html': 'Azure Services Guide',
    'aws-services.html': 'AWS Services Guide',
    'handbook.html': 'Deep Learning Handbook',
    'chapter-01-introduction.html': 'Chapter 01 · Deep Learning',
    'chapter-02-python-numpy.html': 'Chapter 02 · Python & NumPy',
    'chapter-03-linear-algebra.html': 'Chapter 03 · Linear Algebra',
  };

  const legacyHeader = document.querySelector([
    'body > header.header',
    'body > header.topbar',
    'body > header.nav',
    'body > nav.nav',
    'body > div.nav',
  ].join(','));

  const linkSources = [legacyHeader, document.querySelector('.toc'), document.querySelector('.side-nav'), document.querySelector('.side')].filter(Boolean);
  const seenLinks = new Set();
  const localLinks = [];

  linkSources.forEach((source) => {
    source.querySelectorAll('a[href^="#"]').forEach((link) => {
      const href = link.getAttribute('href');
      const label = link.textContent.replace(/\s+/g, ' ').trim();
      if (!href || href === '#' || !label || seenLinks.has(href) || localLinks.length >= 6) return;
      seenLinks.add(href);
      localLinks.push({ href, label: label.replace(/^\d+\s*[·/.:-]\s*/, '').slice(0, 30) });
    });
  });

  if (legacyHeader) {
    legacyHeader.hidden = true;
    legacyHeader.style.display = 'none';
  }
  document.querySelectorAll('footer.footer, body > .footer').forEach((footer) => {
    footer.hidden = true;
    footer.style.display = 'none';
  });
  document.querySelectorAll('body > a[style*="position:fixed"], body > div[style*="position:fixed"]').forEach((floatingItem) => {
    floatingItem.style.display = 'none';
  });
  document.documentElement.style.scrollPaddingTop = localLinks.length ? '132px' : '78px';
  document.querySelectorAll('.side,.side-nav,.toc,.learning-rail').forEach((rail) => {
    rail.style.top = localLinks.length ? '142px' : '88px';
    rail.style.maxHeight = localLinks.length ? 'calc(100vh - 164px)' : 'calc(100vh - 110px)';
  });

  class APSiteHeader extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });
      const localMenu = localLinks.length
        ? `<div class="context"><span class="page"><i></i>${pageTitles[currentFile] || 'Learning Guide'}</span><nav aria-label="On this page">${localLinks.map(({ href, label }) => `<a href="${href}">${label}</a>`).join('')}</nav></div>`
        : `<div class="context"><span class="page"><i></i>${pageTitles[currentFile] || 'Learning Guide'}</span></div>`;

      shadow.innerHTML = `
        <style>
          :host{display:block;position:sticky;top:0;z-index:2147483000;font-family:Arial,Helvetica,sans-serif;color:#f7f8fb}
          *{box-sizing:border-box}a{text-decoration:none;color:inherit}
          .header{background:rgba(11,17,29,.97);border-bottom:1px solid #273247;box-shadow:0 10px 34px #02050b38;backdrop-filter:blur(18px)}
          .row{width:min(1460px,100%);min-height:74px;margin:auto;padding:0 clamp(18px,4.5vw,66px);display:flex;align-items:center;gap:28px}
          .brand{display:flex;align-items:center;gap:12px;min-width:max-content}
          .brand img{width:44px;height:44px;border-radius:50%;object-fit:cover;object-position:center 20%;border:2px solid #bd4967;background:#fff;box-shadow:0 0 0 4px #bd123b20}
          .identity{display:grid;gap:3px;line-height:1.1}.identity strong{font-size:14px;letter-spacing:.01em}.identity small{color:#9ca8ba;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
          .primary{display:flex;align-items:center;gap:5px;margin-left:auto}.primary a{display:flex;align-items:center;min-height:40px;padding:0 13px;border:1px solid transparent;border-radius:10px;color:#aeb8c8;font-size:12px;font-weight:700;transition:.18s}.primary a:hover{color:#fff;background:#192337;border-color:#334158}.primary a.active{color:#fff;background:#bd123b;border-color:#d34264;box-shadow:0 6px 18px #bd123b32}.guide-menu{position:relative}.guide-menu summary{display:flex;align-items:center;gap:7px;min-height:40px;padding:0 13px;border:1px solid #d34264;border-radius:10px;background:#bd123b;color:#fff;box-shadow:0 6px 18px #bd123b32;cursor:pointer;font-size:12px;font-weight:700;list-style:none}.guide-menu summary::-webkit-details-marker{display:none}.guide-menu summary::after{content:'⌄';font-size:16px;line-height:1;transition:transform .18s}.guide-menu[open] summary::after{transform:rotate(180deg)}.guide-menu-panel{position:absolute;top:calc(100% + 9px);right:0;z-index:2;display:grid;min-width:230px;padding:7px;border:1px solid #344158;border-radius:12px;background:#101827;box-shadow:0 16px 38px #0008}.guide-menu-panel a{min-height:38px;padding:0 11px;border-radius:8px;color:#c2cad7}.guide-menu-panel a:hover,.guide-menu-panel a[aria-current=page]{background:#1b2a41;color:#fff}
          .talk{display:flex;align-items:center;min-height:40px;padding:0 14px;border-radius:10px;background:#fff;color:#171d28;font-size:12px;font-weight:800}.theme{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid #344158;border-radius:10px;background:#172134;color:#f6f8fc;font-size:17px;cursor:pointer;transition:.18s}.theme:hover{border-color:#60728d;background:#26364e}.toggle{display:none;width:42px;height:42px;border:1px solid #344158;border-radius:10px;background:#172134;color:#fff;font-size:20px}
          .context{min-height:43px;border-top:1px solid #202b3c;display:flex;align-items:center;gap:22px;width:min(1460px,100%);margin:auto;padding:6px clamp(18px,4.5vw,66px);overflow:hidden}.page{display:flex;align-items:center;gap:8px;flex:none;color:#f1f3f7;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.page i{width:7px;height:7px;border-radius:50%;background:#e04469;box-shadow:0 0 0 4px #e0446922}.context nav{display:flex;align-items:center;gap:5px;min-width:0;overflow-x:auto;scrollbar-width:none}.context nav::-webkit-scrollbar{display:none}.context nav a{flex:none;padding:7px 10px;border-radius:8px;color:#8f9caf;font-size:10px;font-weight:650}.context nav a:hover{background:#182235;color:#fff}
          :host([data-theme=light]){color:#202731}:host([data-theme=light]) .header{background:rgba(255,253,250,.97);border-color:#e7e1e5;box-shadow:0 10px 34px #48293812}:host([data-theme=light]) .identity small,:host([data-theme=light]) .primary a,:host([data-theme=light]) .context nav a{color:#738091}:host([data-theme=light]) .primary a:hover,:host([data-theme=light]) .context nav a:hover{background:#fff1f5;border-color:#efd6df;color:#981534}:host([data-theme=light]) .guide-menu-panel{background:#fff;border-color:#e3dce1;box-shadow:0 16px 38px #40242d1a}:host([data-theme=light]) .guide-menu-panel a{color:#536071}:host([data-theme=light]) .guide-menu-panel a:hover,:host([data-theme=light]) .guide-menu-panel a[aria-current=page]{background:#fff1f5;color:#981534}:host([data-theme=light]) .talk{background:#bd123b;color:#fff}:host([data-theme=light]) .theme,:host([data-theme=light]) .toggle{border-color:#e4dde2;background:#fff;color:#3d4653}:host([data-theme=light]) .theme:hover{background:#fff4f7;border-color:#dcb9c5}:host([data-theme=light]) .context{border-color:#eee7eb}:host([data-theme=light]) .page{color:#343e4a}:host([data-theme=light]) .primary{background:#fff}:host([data-theme=light]) .primary.open{box-shadow:0 20px 50px #4a25301a}
          @media(max-width:760px){.row{min-height:66px;padding:0 14px;gap:10px}.brand{gap:9px}.brand img{width:38px;height:38px}.identity strong{font-size:13px}.identity small{font-size:7px}.primary{display:none;position:absolute;top:66px;right:10px;left:10px;margin:0;padding:9px;border:1px solid #344158;border-radius:13px;background:#101827;box-shadow:0 20px 50px #0008;grid-template-columns:1fr 1fr}.primary.open{display:grid}.primary a{justify-content:center}.guide-menu{grid-column:1/-1}.guide-menu summary{justify-content:center}.guide-menu-panel{position:static;min-width:0;margin-top:6px;border-color:#29384e;box-shadow:none}.guide-menu-panel a{justify-content:flex-start}.talk{display:none}.toggle{display:block;margin-left:auto}.context{padding:6px 14px;gap:13px}.page{font-size:9px;max-width:45%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.context nav a{padding-inline:8px}}
          @media(max-width:390px){.identity small{display:none}.identity strong{font-size:12px}.context{min-height:41px}.page{max-width:42%}}
          @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
        </style>
        <header class="header">
          <div class="row">
            <a class="brand" href="/" aria-label="Abhishek Panda home"><img src="/profile.png" alt=""><span class="identity"><strong>Abhishek Panda</strong><small>Enterprise AI Solution Architect</small></span></a>
            <nav class="primary" id="primary" aria-label="Primary navigation"><a href="/">Home</a><details class="guide-menu"><summary aria-label="Open guide navigation">Guide</summary><div class="guide-menu-panel"><a href="/learning/ai-solution-architect-curriculum.html"${currentFile === 'ai-solution-architect-curriculum.html' ? ' aria-current="page"' : ''}>AI / ML curriculum</a><a href="/learning/azure-services.html"${currentFile === 'azure-services.html' ? ' aria-current="page"' : ''}>Azure services</a><a href="/learning/aws-services.html"${currentFile === 'aws-services.html' ? ' aria-current="page"' : ''}>AWS services</a></div></details><a href="/blogs">Blogs</a><a href="/contact">Contact</a></nav>
            <button class="theme" type="button" aria-label="Switch theme" title="Switch theme"></button><a class="talk" href="mailto:hello@abhishekpanda.com">Let’s talk ↗</a>
            <button class="toggle" type="button" aria-label="Open navigation menu" aria-controls="primary" aria-expanded="false">☰</button>
          </div>
          ${localMenu}
        </header>`;

      const button = shadow.querySelector('.toggle');
      const navigation = shadow.querySelector('.primary');
      const themeButton = shadow.querySelector('.theme');
      const setHeaderTheme = (theme) => {
        this.dataset.theme = theme;
        themeButton.textContent = theme === 'dark' ? '☀' : '☾';
        themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        themeButton.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      };
      setHeaderTheme(getTheme());
      themeButton.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        setHeaderTheme(nextTheme);
      });
      button.addEventListener('click', () => {
        const open = navigation.classList.toggle('open');
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        button.textContent = open ? '×' : '☰';
      });
      navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navigation.classList.remove('open')));
    }
  }

  class APSiteFooter extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <style>
          :host{display:block;margin-top:64px;font-family:Arial,Helvetica,sans-serif;color:#f5f7fb}*{box-sizing:border-box}a{text-decoration:none;color:inherit}
          footer{background:#0b111d;border-top:1px solid #293347}.inner{width:min(1460px,100%);margin:auto;padding:42px clamp(18px,4.5vw,66px) 26px}.top{display:grid;grid-template-columns:minmax(260px,1fr) auto;align-items:center;gap:30px}.profile{display:flex;align-items:center;gap:14px}.profile img{width:54px;height:54px;border-radius:50%;object-fit:cover;object-position:center 20%;border:2px solid #bd4967}.profile strong{display:block;font-size:18px}.profile span{display:block;margin-top:5px;color:#9da8b9;font-size:11px}.nav{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px}.nav a{padding:9px 11px;border-radius:9px;color:#aab4c4;font-size:11px;font-weight:700}.nav a:hover{background:#172236;color:#fff}.bottom{display:flex;justify-content:space-between;gap:18px;margin-top:30px;padding-top:19px;border-top:1px solid #242f42;color:#778397;font-size:10px}.bottom a{color:#d96783}
          @media(max-width:700px){:host{margin-top:44px}.inner{padding-top:32px}.top{grid-template-columns:1fr}.nav{justify-content:flex-start}.bottom{flex-direction:column}.profile strong{font-size:16px}}
        </style>
        <footer><div class="inner"><div class="top"><div class="profile"><img src="/profile.png" alt="Abhishek Panda"><div><strong>Abhishek Panda</strong><span>Enterprise AI Solution Architect · Bengaluru, India</span></div></div><nav class="nav" aria-label="Footer navigation"><a href="/">Home</a><a href="/learning/ai-solution-architect-curriculum.html">Guide</a><a href="/blogs">Blogs</a><a href="/contact">Contact</a><a href="https://www.linkedin.com/in/iamabhishekpanda/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/abhishekpandaOfficial" target="_blank" rel="noreferrer">GitHub ↗</a></nav></div><div class="bottom"><span>© ${new Date().getFullYear()} Abhishek Panda</span><a href="mailto:hello@abhishekpanda.com">hello@abhishekpanda.com ↗</a></div></div></footer>`;
    }
  }

  customElements.define('ap-site-header', APSiteHeader);
  customElements.define('ap-site-footer', APSiteFooter);
  document.body.prepend(document.createElement('ap-site-header'));
  document.body.append(document.createElement('ap-site-footer'));
  document.documentElement.classList.add('ap-shell-ready');
}());
