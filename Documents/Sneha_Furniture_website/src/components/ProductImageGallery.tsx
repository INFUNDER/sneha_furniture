'use client';

import { useState, useRef, useEffect } from 'react';

export default function ProductImageGallery({ images, title }: { images: string[], title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Default fallback if no images provided
  if (!images || images.length === 0) {
    images = ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'];
  }

  // Handle clicking a thumbnail
  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * index;
      container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle native swipe updating the active index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const imageWidth = container.clientWidth;
      const newIndex = Math.round(scrollPosition / imageWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image Carousel */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full bg-[#F5F5F5] overflow-x-auto flex snap-x snap-mandatory hide-scrollbar rounded-xl border border-gray-100"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="min-w-full flex-shrink-0 snap-center flex items-center justify-center p-8 h-[50vh] lg:h-[70vh]">
            <img 
              src={img} 
              alt={`${title} - Image ${idx + 1}`} 
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
        ))}
      </div>

      {/* Thumbnails Row */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => scrollToImage(idx)}
            className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${
              activeIndex === idx ? 'border-black opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center">
              <img 
                src={img} 
                alt={`Thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>
      
      {/* CSS for hide-scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
