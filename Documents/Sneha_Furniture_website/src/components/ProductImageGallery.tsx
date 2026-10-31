'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { productImage, PLACEHOLDER_IMAGE } from '@/lib/images';

export default function ProductImageGallery({ images: rawImages, title }: { images: string[], title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Default fallback if no images provided
  const images = rawImages && rawImages.length > 0 ? rawImages : [PLACEHOLDER_IMAGE];

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
        className="w-full overflow-x-auto flex snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="min-w-full flex-shrink-0 snap-center flex items-center justify-center p-0 h-[50vh] lg:h-[70vh] relative">
            <Image 
              src={productImage(img, 1200)} 
              alt={`${title} - Image ${idx + 1}`} 
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority={idx === 0}
              className="object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Thumbnails Row */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show image ${idx + 1}`}
            onClick={() => scrollToImage(idx)}
            className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${
              activeIndex === idx ? 'border-black opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <div className="w-full h-full bg-white flex items-center justify-center relative">
              <Image 
                src={productImage(img, 200)} 
                alt="" 
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
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
