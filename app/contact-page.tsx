import { ArrowUpRight, Mail, MapPin, MessageSquareText } from 'lucide-react';
import Image from 'next/image';
import { social } from './data';

export default function ContactPage() {
  return (
    <section className="contact-page">
      <div className="contact-hero">
        <div>
          <span className="contact-kicker"><span/> OPEN TO MEANINGFUL CONVERSATIONS</span>
          <h1>Let&apos;s build something<br/><em>that matters.</em></h1>
          <p>For enterprise AI architecture, cloud platforms, technical leadership, or a thoughtful engineering conversation—send a note.</p>
          <a className="contact-email" href={social.email}><span><Mail size={22}/></span><span><small>EMAIL ME DIRECTLY</small><strong>hello@abhishekpanda.com</strong></span><ArrowUpRight size={20}/></a>
        </div>
        <aside className="contact-note">
          <span className="contact-note-icon"><MessageSquareText size={25}/></span>
          <span className="contact-note-label">A GOOD FIRST MESSAGE</span>
          <h2>Tell me what you&apos;re building.</h2>
          <p>Share the problem, where you are today, and the outcome you want. Context makes for a much better first conversation.</p>
          <div className="contact-location"><MapPin size={17}/><span><strong>Bengaluru, India</strong><small>Working across global teams</small></span></div>
        </aside>
      </div>
      <div className="contact-links">
        <a href={social.linkedin} target="_blank" rel="noreferrer"><Image src="/tech/linkedin.svg" width={23} height={23} alt=""/><span><small>PROFESSIONAL NETWORK</small><strong>Connect on LinkedIn</strong></span><ArrowUpRight/></a>
        <a href={social.github} target="_blank" rel="noreferrer"><Image src="/tech/github.svg" width={23} height={23} alt=""/><span><small>CODE & PROJECTS</small><strong>Explore GitHub</strong></span><ArrowUpRight/></a>
        <a href={social.substack} target="_blank" rel="noreferrer"><MessageSquareText/><span><small>ENGINEERING WRITING</small><strong>Read StackedIn</strong></span><ArrowUpRight/></a>
      </div>
      <p className="contact-response"><span/> I personally read every thoughtful message.</p>
    </section>
  );
}
