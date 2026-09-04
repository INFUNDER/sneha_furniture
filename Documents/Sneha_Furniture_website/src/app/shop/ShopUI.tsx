'use client';

import { useState, useMemo } from 'react';
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

export default function ShopUI({ 
  initialProducts, 
  categories,
  initialCategory = 'All'
}: { 
  initialProducts: Product[], 
  categories: { category: string }[],
  initialCategory?: string
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(lowerQ) || p.category.toLowerCase().includes(lowerQ));
    }

    // 3. Sort
    result.sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex flex-col py-12 px-6 max-w-[1400px] mx-auto bg-white min-h-screen">
      
      {/* Top Bar: Search & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black pb-6 mb-8">
        {/* Search */}
        <div className="w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="SEARCH PRODUCTS..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none px-0 py-2 outline-none text-sm font-bold uppercase placeholder-gray-400 bg-transparent"
          />
        </div>
        
        {/* Sort */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4">
          <span className="text-sm font-bold uppercase tracking-widest opacity-50">Sort By</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-none px-0 py-2 text-sm font-bold uppercase tracking-widest focus:outline-none bg-transparent cursor-pointer"
          >
            <option value="newest">NEWEST</option>
            <option value="price_asc">PRICE: LOW TO HIGH</option>
            <option value="price_desc">PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex items-center gap-10 overflow-x-auto hide-scrollbar pb-8 mb-4 border-b border-black/10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button 
          onClick={() => setSelectedCategory('All')} 
          className={`text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'opacity-100 underline underline-offset-8' : 'opacity-50 hover:opacity-100'}`}
        >
          All Furniture
        </button>
        {categories.map((c) => (
          <button 
            key={c.category}
            onClick={() => setSelectedCategory(c.category)} 
            className={`text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all ${selectedCategory === c.category ? 'opacity-100 underline underline-offset-8' : 'opacity-50 hover:opacity-100'}`}
          >
            {c.category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            {selectedCategory === 'All' ? 'All Furniture' : `${selectedCategory}`}
            <span className="text-xl font-medium opacity-50 ml-4">({filteredAndSortedProducts.length} Products)</span>
          </h1>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-2xl font-black uppercase tracking-widest opacity-50">No products found.</p>
            <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-8 border border-black rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {filteredAndSortedProducts.map((product) => (
              <MinimalProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
