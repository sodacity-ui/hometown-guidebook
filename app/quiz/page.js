import QuizClient from './QuizClient';
import { getCities } from '../../data/supabase';

export const metadata = { title: 'Hometown Match', description: 'Match your priorities to South Carolina communities.' };

export default async function QuizPage() {
  const cities = await getCities();
  return <main><section className="section alt"><div className="container"><QuizClient cities={cities} /></div></section></main>;
}
