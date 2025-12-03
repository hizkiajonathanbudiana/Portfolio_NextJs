import { getHomeData } from '../lib/data'; // Import Fetcher Baru
import HomeClient from '../components/HomeClient';

export const revalidate = 0; // Fresh data always

export default async function Home() {
  // 1. Fetch Data dari Collection 'homes' (bukan pagecontents)
  const content = await getHomeData();

  // 2. Render Client Component
  return (
    <main>
      <HomeClient content={content} />
    </main>
  );
}