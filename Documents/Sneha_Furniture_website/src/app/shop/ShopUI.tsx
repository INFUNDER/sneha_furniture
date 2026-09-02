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
    <div className="flex flex-col md:flex-row gap-16 py-12 px-6 max-w-[1400px] mx-auto bg-white min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-12">
        
        {/* Search */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-black pb-4">Search</h2>
          <input 
            type="text" 
            placeholder="SEARCH..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-black rounded-none px-4 py-3 outline-none text-sm font-bold uppercase placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-black pb-4">Categories</h2>
          <ul className="space-y-4 text-sm font-bold uppercase tracking-wider">
            <li>
              <button 
                onClick={() => setSelectedCategory('All')} 
                className={`block w-full text-left transition-opacity ${selectedCategory === 'All' ? 'opacity-100 underline underline-offset-4' : 'opacity-50 hover:opacity-100'}`}
              >
                All Furniture
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.category}>
                <button 
                  onClick={() => setSelectedCategory(c.category)} 
                  className={`block w-full text-left transition-opacity ${selectedCategory === c.category ? 'opacity-100 underline underline-offset-4' : 'opacity-50 hover:opacity-100'}`}
                >
                  {c.category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 border-b border-black pb-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            {selectedCategory === 'All' ? 'All Furniture' : `${selectedCategory}`}
            <span className="text-xl font-medium opacity-50 ml-4">({filteredAndSortedProducts.length})</span>
          </h1>
          
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

        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-2xl font-black uppercase tracking-widest opacity-50">No products found.</p>
            <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-8 border border-black rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredAndSortedProducts.map((product) => (
              <MinimalProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
