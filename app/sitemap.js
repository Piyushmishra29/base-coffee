export const dynamic = 'force-static';

export default function sitemap() {
  return [
    {
      url: 'https://basecoffee.in',
      lastModified: new Date('2026-08-20'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
