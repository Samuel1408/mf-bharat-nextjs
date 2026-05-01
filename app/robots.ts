import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/kyc', '/api/'],
      },
    ],
    sitemap: 'https://mfbharat.in/sitemap.xml',
  };
}
