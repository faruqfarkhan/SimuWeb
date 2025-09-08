import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/services/product-service';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  // Get first 4 products as featured
  const { products: featuredProducts } = getProducts({ page: 1 });
  const topFeaturedProducts = featuredProducts.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: "url('https://picsum.photos/1600/900?random=hero')" }}
                data-ai-hint="musical instruments stage"
            ></div>
            <div className="relative z-10">
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-primary">
                    Simulasi Dunia Web Anda
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
                    Jelajahi platform e-commerce dan pemasaran simulasi kami. Beli produk, buat kampanye, dan analisis data. semua dalam satu tempat.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/products">
                            Mulai Belanja <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/campaign-assistant">Coba Campaign Assistant</Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">Produk Unggulan</h2>
            <p className="text-muted-foreground mt-2">Lihat beberapa instrumen dan perlengkapan terlaris kami.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topFeaturedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
           <div className="text-center mt-12">
                <Button asChild variant="secondary">
                    <Link href="/products">Lihat Semua Produk</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
