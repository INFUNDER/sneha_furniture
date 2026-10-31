'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import MinimalProductCard from '@/components/MinimalProductCard';

type Product = {
  id: string;
  title: string;
  price: number;
  discountPrice: number | null;
  category: string;
  primaryMaterial: string | null;
  stock: number;
  images: string;
  createdAt: Date;
};

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

const INTROS: Record<string, string> = {
  All: 'Every piece in our showroom, from deep-seated sofas to marble-topped dining sets.',
  Sofa: 'Deep seats, soft fabrics and frames built to be lived on, every single day.',
  Bedroom: 'Upholstered beds and panel headboards for a calmer end to the day.',
  Dining: 'Tables and chairs made for long dinners and every festival gathering.',
  'Living Room': 'Accent chairs and statement pieces to complete the room.',
};

export default function ShopUI({ 
  initialProducts, 
  categories,
  initialCategory = 'All'
}: { 
  initialProducts: Product[], 
  categories: string[],
  initialCategory?: string
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    // Keep the URL shareable without a server round trip.
    const url = category === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(category)}`;
    window.history.replaceState(null, '', url);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(lowerQ) ||
        p.category.toLowerCase().includes(lowerQ) ||
        (p.primaryMaterial ?? '').toLowerCase().includes(lowerQ)
      );
    }

    result.sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const title = selectedCategory === 'All' ? 'All furniture' : selectedCategory;
  const pill = (active: boolean) =>
    `shrink-0 h-10 px-5 rounded-full text-[13px] font-medium transition-colors duration-300 ${
      active ? 'bg-ink text-ivory' : 'bg-transparent text-ink border border-line hover:border-ink'
    }`;

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 pb-24">
      {/* Heading */}
      <header className="pt-10 md:pt-16 pb-10 md:pb-14 grid md:grid-cols-[1fr_auto] gap-6 items-end border-b border-line">
        <div>
          <p className="eyebrow">The collection</p>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] mt-5">{title}</h1>
          <p className="mt-5 max-w-xl text-stone leading-relaxed">{INTROS[selectedCategory] ?? INTROS.All}</p>
        </div>
        <p className="text-sm text-stone" aria-live="polite">
          {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'piece' : 'pieces'}
        </p>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-30 -mx-5 md:-mx-10 px-5 md:px-10 py-4 bg-ivory/90 backdrop-blur-md border-b border-line flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0" role="group" aria-label="Filter by category">
          <button onClick={() => chooseCategory('All')} aria-pressed={selectedCategory === 'All'} className={pill(selectedCategory === 'All')}>
            All
          </button>
          {categories.map((c) => (
            <button key={c} onClick={() => chooseCategory(c)} aria-pressed={selectedCategory === c} className={pill(selectedCategory === c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <label className="relative flex-1 lg:w-72">
            <span className="sr-only">Search products</span>
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone" aria-hidden="true" />
            <input 
              type="search" 
              placeholder="Search sofas, beds, velvet…" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-full bg-[#FBF8F3] border border-line pl-10 pr-4 text-sm outline-none focus:border-ink transition-colors placeholder:text-stone/70"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 rounded-full bg-[#FBF8F3] border border-line pl-4 pr-9 text-sm outline-none focus:border-ink cursor-pointer appearance-none"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </label>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-32 text-center flex flex-col items-center">
          <p className="font-display text-4xl">Nothing matches that just yet.</p>
          <p className="mt-3 text-stone">Try another word, or browse the whole collection.</p>
          <button onClick={() => { chooseCategory('All'); setSearchQuery(''); }} className="btn btn-outline mt-8">
            <X size={16} /> Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16 pt-10">
          {filteredAndSortedProducts.map((product, i) => (
            <div key={product.id} data-reveal style={{ '--reveal-delay': `${(i % 4) * 80}ms` } as React.CSSProperties}>
              <MinimalProductCard product={product} priority={i < 4} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
