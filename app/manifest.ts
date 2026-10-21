import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Abhishek Panda',
    short_name: 'Abhishek Panda',
    description: 'Abhishek Panda — Enterprise AI Solution Architect',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#bd123b',
    icons: [
      { src: '/abhishek-panda-icon.png', sizes: 'any', type: 'image/png', purpose: 'any' },
    ],
  };
}
