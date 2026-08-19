import { cities as fallbackCities } from './cities';

const SUPABASE_URL = 'https://iitvfgyngunlbyumcxmu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_iCygNTEBYUQp1oqBa0p36A_r92b6y_3';

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
    lastVerifiedAt: row.last_verified_at,
  };
}

export async function getCities() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/places?select=*&is_published=eq.true&order=name.asc`,
      {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) return fallbackCities;
    return rows.map(normalizePlace);
  } catch (error) {
    console.error('Using fallback city data because Supabase could not be reached.', error);
    return fallbackCities;
  }
}

export async function getCitiesBySlug() {
  const cities = await getCities();
  return Object.fromEntries(cities.map((city) => [city.slug, city]));
}

export async function getBusinessCategories() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/business_categories?select=*&is_active=eq.true&order=name.asc`,
      {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        next: { revalidate: 300 },
      }
    );
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
