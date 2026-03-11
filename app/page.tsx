import HeroSection from '@/components/hero-section';
import { getAllProducts, Product } from '@/lib/products';

export default async function Home() {
  // fetch once on the server so clients render immediately
  let featured: Product[] = []
  try {
    const products = await getAllProducts()
    featured = products.slice(0, 8)
  } catch (err) {
    console.error('Error loading products for home page', err)
  }

  return <HeroSection initialFeatured={featured} />;
}
