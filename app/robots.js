export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://basecoffee.in/sitemap.xml',
    host: 'https://basecoffee.in',
  };
}
