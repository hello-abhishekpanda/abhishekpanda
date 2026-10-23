import type { MetadataRoute } from 'next';

const base = 'https://www.abhishekpanda.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/blogs', '/contact'];
  const learningPages = [
    '/learning/index.html',
    '/learning/ai-solution-architect-curriculum.html',
    '/learning/dotnet-solution-architect.html',
    '/learning/handbook.html',
    '/learning/chapter-01-introduction.html',
    '/learning/chapter-02-python-numpy.html',
    '/learning/chapter-03-linear-algebra.html',
    '/learning/azure-services.html',
    '/learning/aws-services.html',
  ];

  return [...pages, ...learningPages].map((path, index) => ({
    url: `${base}${path || '/'}`,
    changeFrequency: 'monthly' as const,
    priority: index === 0 ? 1 : index < pages.length ? 0.8 : 0.6,
  }));
}
