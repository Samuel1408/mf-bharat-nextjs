import { MetadataRoute } from 'next';

const SITE_URL = 'https://mfbharat.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                              priority: 1.0,  changeFrequency: 'daily',   lastModified: now },
    { url: `${SITE_URL}/explore`,                 priority: 0.9,  changeFrequency: 'daily',   lastModified: now },
    { url: `${SITE_URL}/categories`,              priority: 0.8,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/categories/equity`,       priority: 0.7,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/categories/sifs`,         priority: 0.7,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amcs`,                    priority: 0.8,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/axis`,                priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/hdfc`,                priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/icici`,               priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/kotak`,               priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/mirae`,               priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/nippon`,              priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/parag`,               priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/quant`,               priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/sbi`,                 priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/amc/tata`,                priority: 0.6,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/nfos`,                    priority: 0.8,  changeFrequency: 'daily',   lastModified: now },
    { url: `${SITE_URL}/learn`,                   priority: 0.8,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/calculators`,             priority: 0.8,  changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/calculators/sip`,         priority: 0.7,  changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/calculators/lumpsum`,     priority: 0.7,  changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/calculators/stepup`,      priority: 0.7,  changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/calculators/swp`,         priority: 0.7,  changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/compare`,                 priority: 0.7,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/sips`,                    priority: 0.7,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/sifs`,                    priority: 0.7,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/schemes/sbi-small-cap`,   priority: 0.6,  changeFrequency: 'daily',   lastModified: now },
    { url: `${SITE_URL}/about`,                   priority: 0.5,  changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/careers`,                 priority: 0.5,  changeFrequency: 'weekly',  lastModified: now },
    { url: `${SITE_URL}/contact`,                 priority: 0.5,  changeFrequency: 'monthly', lastModified: now },
    { url: `${SITE_URL}/privacy`,                 priority: 0.3,  changeFrequency: 'yearly',  lastModified: now },
    { url: `${SITE_URL}/terms`,                   priority: 0.3,  changeFrequency: 'yearly',  lastModified: now },
    { url: `${SITE_URL}/sebi-disclosures`,        priority: 0.4,  changeFrequency: 'monthly', lastModified: now },
  ];

  return staticRoutes;
}
