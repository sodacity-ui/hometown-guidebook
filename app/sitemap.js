import { getCities } from '../data/supabase';

const baseUrl = 'https://hometownguidebook.com';
const guides = [
  'moving-to-south-carolina',
  'best-places-to-live-south-carolina',
  'choosing-schools-in-south-carolina',
  'south-carolina-property-taxes',
  'south-carolina-relocation-checklist',
];
const comparisons = [
  'greenville-vs-charleston',
  'greenville-vs-columbia',
  'lexington-vs-fort-mill',
  'lexington-vs-bluffton',
  'charleston-vs-bluffton',
  'columbia-vs-lexington',
];

export default async function sitemap() {
  const cities = await getCities();
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/explore`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...cities.map((city) => ({
      url: `${baseUrl}/south-carolina/${city.slug}`,
      lastModified: city.editorialUpdatedAt || city.lastVerifiedAt || now,
      changeFrequency: 'monthly',
      priority: 0.9,
    })),
    ...comparisons.map((slug) => ({
      url: `${baseUrl}/compare/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    })),
    ...guides.map((slug) => ({
      url: `${baseUrl}/guides/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    })),
  ];
}
