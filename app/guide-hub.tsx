import {
  ArrowRight,
  BookMarked,
  BookOpenCheck,
  BrainCircuit,
  Cloud,
  Code2,
  Layers3,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

const library = [
  {
    title: 'AI Solution Architect Curriculum',
    label: 'FLAGSHIP LEARNING PATH',
    description: 'A complete, visual path from foundations and deep learning to agents, cloud architecture, delivery, and production operations.',
    href: '/learning/ai-solution-architect-curriculum.html',
    icon: BrainCircuit,
    tone: 'rose',
    meta: ['15 connected parts', 'Interactive visual lab', 'Saved progress'],
  },
  {
    title: '.NET Solution Architect Curriculum',
    label: 'C# 14 · .NET 10 · AZURE',
    description: 'Go from language and CLR foundations to APIs, microservices, observability, Azure delivery, and production AI integration.',
    href: '/learning/dotnet-solution-architect.html',
    icon: Code2,
    tone: 'violet',
    meta: ['48 modules', '24 animated flows', '422 topics'],
  },
  {
    title: 'Deep Learning Handbook',
    label: 'FOUNDATIONS · PART I',
    description: 'A practical handbook for building intuition through mathematics, PyTorch, projects, and interview preparation.',
    href: '/learning/handbook.html',
    icon: BookOpenCheck,
    tone: 'teal',
    meta: ['Chapter map', 'Math lab', 'Practice projects'],
  },
  {
    title: 'Technology Guide Library',
    label: 'EXPLORE THE FULL COLLECTION',
    description: 'Browse every available guide and see how AI, cloud, software, data, and delivery technologies connect.',
    href: '/learning/index.html',
    icon: Layers3,
    tone: 'violet',
    meta: ['Visual maps', 'Architecture flows', 'Builder focused'],
  },
  {
    title: 'Microsoft Azure Services',
    label: 'CLOUD FIELD GUIDE',
    description: 'Navigate Azure services by capability, architecture role, and the decisions that matter in real systems.',
    href: '/learning/azure-services.html',
    icon: Cloud,
    tone: 'blue',
    meta: ['Service catalog', 'Architecture patterns', 'Decision support'],
  },
  {
    title: 'Amazon Web Services',
    label: 'CLOUD FIELD GUIDE',
    description: 'Explore the AWS platform through structured service groups, practical patterns, and connected architecture concepts.',
    href: '/learning/aws-services.html',
    icon: Cloud,
    tone: 'amber',
    meta: ['Service catalog', 'System design', 'Cloud patterns'],
  },
] as const;

const chapters = [
  ['01', 'What is Deep Learning?', 'Build the complete mental model—from prediction and loss to gradients and backpropagation.', '/learning/chapter-01-introduction.html'],
  ['02', 'Python & NumPy for ML', 'Learn shapes, broadcasting, vectorization, stability, and the mechanics behind model code.', '/learning/chapter-02-python-numpy.html'],
  ['03', 'Linear Algebra You Can See', 'Explore vectors, matrices, transformations, eigenvectors, and SVD through interactive labs.', '/learning/chapter-03-linear-algebra.html'],
] as const;

export default function GuideHub() {
  return (
    <section className="guide-hub">
      <div className="guide-hero">
        <div className="guide-hero-copy">
          <span className="guide-kicker"><Sparkles size={14}/> THE LEARNING LIBRARY</span>
          <h1>Learn the stack.<br/><em>See how it connects.</em></h1>
          <p>Visual, practical guides for engineers moving from first principles to production-ready AI and cloud architecture.</p>
          <div className="guide-hero-actions">
            <a className="btn primary" href="/learning/ai-solution-architect-curriculum.html">Start the curriculum <ArrowRight size={17}/></a>
            <a className="btn secondary" href="#guide-library">Browse all guides</a>
          </div>
        </div>
        <div className="guide-orbit" aria-label="Learning journey from foundations to production">
          <div className="guide-orbit-core"><BrainCircuit size={30}/><strong>AI</strong><span>ARCHITECTURE</span></div>
          <span className="orbit-node orbit-one"><Code2 size={18}/> Foundations</span>
          <span className="orbit-node orbit-two"><BookMarked size={18}/> Practice</span>
          <span className="orbit-node orbit-three"><Cloud size={18}/> Production</span>
        </div>
      </div>

      <div className="guide-proof" aria-label="Learning library highlights">
        <span><strong>09</strong> interactive experiences</span>
        <span><strong>03</strong> deep learning chapters</span>
        <span><strong>02</strong> cloud field guides</span>
        <span><strong>01</strong> connected learning path</span>
      </div>

      <div className="guide-library" id="guide-library">
        <div className="guide-section-heading">
          <div><span>CURATED PATHS</span><h2>Choose where you want to grow.</h2></div>
          <p>Each experience opens as a focused, full-screen guide while staying on abhishekpanda.com.</p>
        </div>
        <div className="guide-card-grid">
          {library.map(({title,label,description,href,icon:Icon,tone,meta}, index) => (
            <a className={`learning-card ${index === 0 ? 'learning-card-featured' : ''} learning-${tone}`} href={href} key={title}>
              <div className="learning-card-top"><span className="learning-icon"><Icon size={24}/></span><span className="learning-index">{String(index + 1).padStart(2, '0')}</span></div>
              <span className="learning-label">{label}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="learning-meta">{meta.map(item => <span key={item}>{item}</span>)}</div>
              <span className="learning-open">Open guide <ArrowRight size={16}/></span>
            </a>
          ))}
        </div>
      </div>

      <div className="chapter-shelf">
        <div className="guide-section-heading">
          <div><span>START FROM FIRST PRINCIPLES</span><h2>Deep learning, chapter by chapter.</h2></div>
          <a href="/learning/handbook.html">Open the handbook <ArrowRight size={15}/></a>
        </div>
        <div className="chapter-list">
          {chapters.map(([number,title,description,href]) => (
            <a href={href} key={number}>
              <span className="chapter-number">{number}</span>
              <span><strong>{title}</strong><small>{description}</small></span>
              <PlayCircle size={21}/>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
