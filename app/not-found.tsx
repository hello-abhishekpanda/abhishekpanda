import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This portfolio page could not be found. Return to Abhishek Panda’s portfolio or explore the learning guides.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <img src="/brand.png" width="48" height="48" alt="Abhishek Panda" />
        <span className="eyebrow">404 / PAGE NOT FOUND</span>
        <h1>This route didn’t make it to production.</h1>
        <p>The page may have moved or the address may be incorrect. Choose a destination below to continue exploring.</p>
        <div className="not-found-actions">
          <Link className="btn primary" href="/"><ArrowLeft size={16}/> Portfolio home</Link>
          <Link className="btn secondary" href="/learning/ai-solution-architect-curriculum.html"><Compass size={16}/> Learning guide</Link>
          <Link className="not-found-blog" href="/blogs">Read the blog <ArrowUpRight size={15}/></Link>
        </div>
      </div>
    </main>
  );
}
