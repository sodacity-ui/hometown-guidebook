import { cities as fallbackCities } from './cities';

const SUPABASE_URL = 'https://iitvfgyngunlbyumcxmu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_iCygNTEBYUQp1oqBa0p36A_r92b6y_3';
const headers = {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
};

function normalizePlace(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    region: row.region,
    summary: row.summary,
    population: row.population,
    growth: Number(row.growth_since_2020 ?? 0),
    home: row.median_home_value,
    rent: row.median_rent,
    income: row.median_household_income,
    commute: Number(row.mean_commute_minutes ?? 0),
    school: row.school_system,
    schoolUrl: row.school_url,
    airport: row.airport_name,
    airportUrl: row.airport_url,
    taxUrl: row.tax_url,
    best: row.best_for || [],
    trade: row.tradeoffs || [],
    scores: row.editorial_scores || {},
    budget: Number(row.budget_band ?? 0),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    content: row.editorial_content || {},
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    editorialUpdatedAt: row.editorial_updated_at,
    lastVerifiedAt: row.last_verified_at,
  };
}

async function supabaseFetch(path) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers,
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
  return response.json();
}

export async function getCities() {
  try {
    const rows = await supabaseFetch('places?select=*&is_published=eq.true&order=name.asc');
    if (!Array.isArray(rows) || rows.length === 0) return fallbackCities;
    return rows.map(normalizePlace);
  } catch (error) {
    console.error('Using fallback city data because Supabase could not be reached.', error);
    return fallbackCities;
  }
}

export async function getCityBySlug(slug) {
  try {
    const rows = await supabaseFetch(`places?select=*&is_published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`);
    if (!rows?.[0]) return fallbackCities.find((c) => c.slug === slug) || null;
    const city = normalizePlace(rows[0]);
    const sources = await supabaseFetch(`sources?select=title,url,publisher,source_type,data_period,last_checked_at&place_id=eq.${city.id}&order=source_type.asc`);
    return { ...city, sources: Array.isArray(sources) ? sources : [] };
  } catch (error) {
    console.error(`Using fallback data for ${slug}.`, error);
    return fallbackCities.find((c) => c.slug === slug) || null;
  }
}

export async function getCitiesBySlug() {
  const cities = await getCities();
  return Object.fromEntries(cities.map((city) => [city.slug, city]));
}

export async function getBusinessCategories() {
  try {
    const rows = await supabaseFetch('business_categories?select=*&is_active=eq.true&order=name.asc');
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}
