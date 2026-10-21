'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  BrainCircuit,
  Braces,
  Check,
  ChevronDown,
  Cloud,
  Database,
  Download,
  Eye,
  GitBranch,
  Home,
  Mail,
  MapPin,
  Network,
  PanelLeftClose,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import BlogCatalog, { type BlogPost } from './blog-catalog';
import ContactPage from './contact-page';
import { history, projects, skills, social } from './data';
import Emphasis from './emphasis';
import GuideHub from './guide-hub';
import logos from './logos.json';
import postsData from './posts.json';
import techIcons from './tech-icons.json';

const nav = [
  ['home', 'Home', Home],
  ['guide', 'Guide', BookMarked],
  ['blogs', 'Blogs', BookOpen],
  ['contact', 'Contact', Mail],
] as const;

const blogPosts = postsData as BlogPost[];

function Github({ size = 18 }: { size?: number }) {
  return <img src="/tech/github.svg" width={size} height={size} alt="" />;
}

function Linkedin({ size = 18 }: { size?: number }) {
  return <img src="/tech/linkedin.svg" width={size} height={size} alt="" />;
}

function Instagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Substack({ size = 18 }: { size?: number }) {
  return <img src="/logos/substack.svg" width={size} height={size} alt="" />;
}

function Social() {
  const links = [
    [Linkedin, 'LinkedIn', social.linkedin],
    [Instagram, 'Instagram', social.instagram],
    [Github, 'GitHub', social.github],
    [Substack, 'Substack', social.substack],
    [Mail, 'Email', social.email],
  ] as const;

  return (
    <div className="socials">
      {links.map(([Icon, label, url]) => (
        <a key={label} href={url} aria-label={label} title={label} target="_blank" rel="noreferrer">
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}

function pathFromPage(page: string) {
  return page === 'home' ? '/' : `/${page}`;
}

function pageFromPath(pathname: string) {
  return pathname.replace(/^\/+|\/+$/g, '') || 'home';
}

function Navigation({ page }: { page: string }) {
  const { setOpenMobile } = useSidebar();
  const colors = ['#bd123b', '#7652b8', '#e07031', '#209889'];

  return (
    <SidebarMenu>
      {nav.map(([id, label, Icon], index) => (
        <SidebarMenuItem key={id} style={{ '--nav-icon-color': colors[index] } as React.CSSProperties}>
          <SidebarMenuButton asChild className="navitem" isActive={page === id} tooltip={label}>
            <Link href={pathFromPage(id)} onClick={() => setOpenMobile(false)}>
              <Icon />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function Capsule({ text, compact = false }: { text: string; compact?: boolean }) {
  const Concept = /security|guardrail|oauth|jwt|secure|governance/i.test(text)
    ? ShieldCheck
    : /retrieval|rag|cag|vector|embedding|chunk|search|ranking|context/i.test(text)
      ? Database
      : /computer vision|image recognition|visual perception/i.test(text)
        ? Eye
        : /agent|orchestration|event|microservice|distributed|react|tool|kernel/i.test(text)
          ? Network
          : /ci\/cd|devops|gitops|sdlc/i.test(text)
            ? GitBranch
            : /cloud|availability|resilience/i.test(text)
              ? Cloud
              : /evaluation|observability|performance|cost|monitor/i.test(text)
                ? Activity
                : /api|output|code|design|architecture/i.test(text)
                  ? Braces
                  : /model|learning|llm|prompt|lora|peft|ner|bert|transformer|summarization|classification|anomaly/i.test(text)
                    ? BrainCircuit
                    : Wrench;
  const iconPath = (techIcons as Record<string, string>)[text];
  const icon = iconPath
    ? <img className="tech-icon" src={iconPath} alt="" />
    : <Concept className="concept-icon" size={18} />;

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild><button className="neo-tech" type="button" aria-label={text}>{icon}</button></TooltipTrigger>
        <TooltipContent className="tech-tooltip" sideOffset={10}>{text}</TooltipContent>
      </Tooltip>
    );
  }

  return <span className="capsule">{icon}{text}</span>;
}

function Capsules({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={compact ? 'capsules icon-tray' : 'capsules'}>{text.split('|').map((item) => <Capsule text={item} compact={compact} key={item} />)}</div>;
}

function Brand({ name, id }: { name: string; id: string }) {
  return (
    <div className={`company-logo ${id}`}>
      <img
        src={(logos as Record<string, string>)[id]}
        alt={name}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          event.currentTarget.nextElementSibling?.removeAttribute('hidden');
        }}
      />
      <span hidden>{name}</span>
    </div>
  );
}

function HomePage({ expandedCompanies, toggleCompany }: { expandedCompanies: string[]; toggleCompany: (company: string) => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> ENTERPRISE AI. MULTI-CLOUD. REAL-WORLD IMPACT.</div>
          <h1>Architecting <span className="hero-title-accent">intelligent</span><br className="hero-title-break" /> systems that scale.</h1>
          <p className="intro">Hi, I’m <strong>Abhishek Panda.</strong> An <strong>Enterprise AI Solution Architect</strong> designing secure, scalable, multi-cloud AI platforms and intelligent enterprise solutions.</p>
          <div className="hero-actions">
            <a className="btn primary" href="#experience">Explore my work <ArrowUpRight size={18} /></a>
            <a className="btn secondary" href="/Abhishek-Panda-CV-2026.pdf" download>Download CV <Download size={17} /></a>
          </div>
          <div className="hero-details"><span><MapPin size={14} /> Bengaluru, India</span><span>AI · Cloud · Enterprise Architecture</span></div>
        </div>
        <div className="profile-card">
          <div className="portrait-bg"><img src="/profile.png" alt="Abhishek Panda" className="portrait" /></div>
          <div className="profile-info">
            <h2>Abhishek Panda <span className="verified"><Check size={13} /></span></h2>
            <p className="profile-designation">Enterprise AI Solution Architect</p>
            <p className="profile-specialism">MultiCloud | Applied AI</p>
            <div className="current-company"><span>Technical Architect at</span> <strong>Quality-AI</strong></div>
            <Social />
          </div>
        </div>
      </section>

      <section className="stats">
        <div><strong>12.6<span>+</span></strong><span>Years of experience</span></div>
        <div><strong>{String(history.length).padStart(2, '0')}</strong><span>Career chapters</span></div>
        <div><strong>06</strong><span>Enterprise domains</span></div>
        <div><strong>AI <span>×</span> Cloud</strong><span>Built for production</span></div>
      </section>

      <section className="expertise-strip" aria-label="Technology stack">
        <Capsules compact text=".NET Core|Microservices|Azure|AWS|GCP|Python|Machine Learning|Semantic Kernel|SQL Server|LangChain|LangSmith|MLflow|Git|RAG|LLMs|TensorFlow|PyTorch|LangGraph|vLLMs|Cloudflare Workers|Docker|Kubernetes|Argo CD|Terraform|DataDog|New Relic|Grafana|n8n|Zapier|Temporal" />
      </section>

      <section className="career section" id="experience">
        <div className="section-title">
          <div><div className="eyebrow">THE JOURNEY</div><h2>Experience that builds perspective.</h2></div>
          <span className="section-note">2015 — PRESENT</span>
        </div>
        <div className="timeline">
          {history.map((item, index) => {
            const expanded = expandedCompanies.includes(item.company);
            return (
              <article className={`timeline-row ${index === 0 ? 'current' : 'completed'} ${expanded ? 'is-expanded' : 'is-collapsed'}`} style={{ '--chapter-color': ['#bd123b', '#2766bf', '#7d48ad', '#536bc4', '#c47a18', '#0c8c83', '#7856b5', '#3c7ca6'][index] } as React.CSSProperties} key={item.company}>
                <div className="timeline-date">
                  <strong>{item.period}</strong><span>{item.location}</span>
                  <span className="career-status">{index === 0 ? <span className="live-dot" /> : <Check size={12} />} {index === 0 ? 'Ongoing' : 'Completed'}</span>
                </div>
                <div className="timeline-node">
                  <button type="button" className="timeline-company-logo" aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.company}`} aria-expanded={expanded} onClick={() => toggleCompany(item.company)}><Brand name={item.company} id={item.logo} /></button>
                </div>
                <div className={`experience-card ${expanded ? 'expanded' : 'collapsed'}`}>
                  <div className="experience-heading">
                    <button type="button" className="career-company career-company-toggle" aria-expanded={expanded} aria-controls={`career-details-${index}`} onClick={() => toggleCompany(item.company)}>
                      <Brand name={item.company} id={item.logo} />
                      <span className="career-company-copy"><strong>{item.company}</strong><small>{item.role}</small></span>
                      <ChevronDown className="company-toggle-chevron" size={18} />
                    </button>
                    <span className="chapter">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="experience-details" id={`career-details-${index}`} hidden={!expanded}>
                    <div className="project-line">{item.client && <span className="client-pill">{item.client}</span>}<span>{item.project}</span></div>
                    <p className="description">{item.description}</p>
                    {(index === 5 || index === 7) ? (
                      <div className="company-projects">
                        <div className="nested-project-heading"><span>02 PROJECTS</span><strong>{item.period}</strong></div>
                        <div className="nested-project-timeline">
                          {projects.filter((project) => project.chapter === index).map((project, projectIndex) => (
                            <article className="nested-project" key={project.title}>
                              <span className="project-node">{String(projectIndex + 1).padStart(2, '0')}</span>
                              <div className="nested-project-top"><div><span>{project.client}</span><h4><Emphasis text={project.title} /></h4></div></div>
                              <p><Emphasis text={project.summary} /></p><span className="project-period">{project.period}</span>
                              <details open><summary>Project responsibilities <ChevronDown size={14} /></summary><ul>{project.details.map((detail) => <li key={detail}><Emphasis text={detail} /></li>)}</ul></details>
                            </article>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <details open><summary>Responsibilities & impact <ChevronDown size={15} /></summary><ul>{item.points.map((point) => <li key={point}><Emphasis text={point} /></li>)}</ul></details>
                    )}
                    <div className="stack-label">TECHNOLOGY STACK <span>Hover or focus to explore</span></div>
                    <Capsules text={item.tech} compact />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-title"><div><div className="eyebrow">TRUSTED ENTERPRISE CONTEXTS</div><h2>Across industries. At enterprise scale.</h2></div></div>
        <p className="client-context">Clients and enterprise products across my engineering journey, ordered from most recent to earliest.</p>
        <div className="clients">
          {[
            ['Hiscox', 'hiscox', 'Insurance', '2026–Present'], ['SmartDrive · Solera', 'solera', 'Automotive & fleet technology', '2023–2025'], ['DELL', 'dell', 'Technology', '2022'], ['Wells Fargo', 'wells', 'Banking', '2020–2022'], ['Citi Bank', 'citi', 'Financial services', '2019–2020'], ['Qatar Airways', 'qatar', 'Aviation', '2018–2019'], ['JD Sports Fashion', 'jd', 'Retail & sportswear', '2018'], ['Bank of America / Merrill Lynch', 'boa', 'Banking & financial services', '2016–2017'], ['MetLife', 'metlife', 'Insurance & financial services', '2015–2016'],
          ].map(([name, id, domain, period], index) => (
            <div key={id} style={{ '--context-color': ['#bd123b', '#cf711c', '#2267b5', '#3d6fba', '#5661bf', '#008f95', '#a63e69', '#287d64', '#8852a4'][index] } as React.CSSProperties}>
              <Brand name={name} id={id} /><span>{name}</span><small className="client-domain">DOMAIN · {domain}</small><small className="client-period">{period}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title"><div><div className="eyebrow">THE FULL STACK</div><h2>From the model to the mission.</h2></div></div>
        <div className="skills-grid">{skills.map(([title, tech], index) => <article className={`skill-card${title.startsWith('Azure Cloud & AI') ? ' skill-card-primary' : ''}`} key={title}><span className="skill-number">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><Capsules text={tech} /></article>)}</div>
      </section>
      <section className="education"><span className="eyebrow">FOUNDATIONS</span><h3>B.Tech — Computer Science & Engineering</h3><p>Government College of Engineering | BPUT · Odisha · April 2010–May 2014</p></section>
    </>
  );
}

export default function Portfolio() {
  const pathname = usePathname();
  const page = pageFromPath(pathname);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>([]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);

  function toggleCompany(company: string) {
    setExpandedCompanies((current) => current.includes(company) ? current.filter((name) => name !== company) : [...current, company]);
  }

  const content = page === 'guide'
    ? <GuideHub />
    : page === 'blogs'
      ? <BlogCatalog posts={blogPosts} substackUrl={social.substack} />
      : page === 'contact'
        ? <ContactPage />
        : <HomePage expandedCompanies={expandedCompanies} toggleCompany={toggleCompany} />;

  return (
    <SidebarProvider open={open || pinned} onOpenChange={setPinned} style={{ '--sidebar-width': '15rem', '--sidebar-width-icon': '5.3rem' } as React.CSSProperties}>
      <Sidebar collapsible="icon" className="navrail" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <SidebarHeader><Link className="site-mark" href="/" aria-label="Abhishek Panda home"><img src="/brand.png" alt="AP" /><span>Abhishek Panda<span className="small-sub">Architect & builder</span></span></Link></SidebarHeader>
        <SidebarContent><Navigation page={page} /></SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton className="navitem" tooltip="Pin navigation" onClick={() => setPinned(!pinned)}><PanelLeftClose /><span>{pinned ? 'Collapse navigation' : 'Pin navigation'}</span></SidebarMenuButton>
          <Link className="rail-profile" href="/contact" aria-label="Contact Abhishek Panda"><img src="/profile.png" alt="Abhishek Panda" /><span>Abhishek Panda<small>Available to connect</small></span><ArrowUpRight size={15} /></Link>
        </SidebarFooter>
      </Sidebar>
      <main className="main">
        <header className="topbar">
          <div className="breadcrumb"><SidebarTrigger className="mobile-trigger" /><span>Abhishek Panda</span><span className="slash">/</span><span>{nav.find(([id]) => id === page)?.[1] || 'Home'}</span></div>
          <a href={social.email} className="contact-top">Let’s talk <ArrowUpRight size={16} /></a>
        </header>
        {content}
        <footer><div><strong>Let’s build something meaningful.</strong><a href={social.email}>hello@abhishekpanda.com <ArrowUpRight size={17} /></a></div><Social /><span>© {new Date().getFullYear()} Abhishek Panda</span></footer>
      </main>
    </SidebarProvider>
  );
}
