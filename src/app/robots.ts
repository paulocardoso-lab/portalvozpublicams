import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/eu/',
        '/_next/',
        '/login',
        '/signup',
      ],
    },
    sitemap: 'https://vozpublicams.com.br/sitemap.xml',
  };
}
