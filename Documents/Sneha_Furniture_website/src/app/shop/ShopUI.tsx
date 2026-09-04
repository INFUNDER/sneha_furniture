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
    <div className="flex flex-col py-6 md:py-12 px-4 md:px-6 max-w-[1400px] mx-auto bg-white min-h-screen pb-20 md:pb-12">
      
      {/* Top Bar: Search & Sort */}
      <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black pb-6 mb-8">
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
        <div className="mb-6 md:mb-10 flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            {selectedCategory === 'All' ? 'All Furniture' : `${selectedCategory}`}
          </h1>
          <span className="text-sm font-medium opacity-50">{filteredAndSortedProducts.length} Products</span>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-2xl font-black uppercase tracking-widest opacity-50">No products found.</p>
            <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-8 border border-black rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-16">
            {filteredAndSortedProducts.map((product) => (
              <MinimalProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden flex justify-around items-center h-14 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        {/* Sort Select */}
        <div className="flex flex-col items-center justify-center flex-1 h-full border-r border-gray-200 relative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Sort By</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price Low</option>
            <option value="price_desc">Price High</option>
          </select>
          <span className="text-xs font-bold uppercase">{sortBy === 'newest' ? 'Newest' : sortBy === 'price_asc' ? 'Price Low' : 'Price High'}</span>
        </div>

        {/* Category Select */}
        <div className="flex flex-col items-center justify-center flex-1 h-full border-r border-gray-200 relative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Category</span>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>{c.category}</option>
            ))}
          </select>
          <span className="text-xs font-bold uppercase line-clamp-1 px-2 text-center w-full">{selectedCategory}</span>
        </div>

        {/* Search Toggle */}
        <div className="flex flex-col items-center justify-center flex-1 h-full cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Search</span>
          <span className="text-xs font-bold uppercase">Find</span>
        </div>

      </div>
    </div>
  );
}
