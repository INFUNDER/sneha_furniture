'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { productImage, PLACEHOLDER_IMAGE } from '@/lib/images';

// Mobile: swipeable carousel with a counter. Desktop: an editorial stack of large images
// that scrolls past the sticky product details.
export default function ProductImageGallery({ images: rawImages, title }: { images: string[], title: string }) {
  const images = rawImages && rawImages.length > 0 ? rawImages : [PLACEHOLDER_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const newIndex = Math.round(container.scrollLeft / container.clientWidth);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  const scrollToImage = (index: number) => {
    const container = scrollContainerRef.current;
    if (container) container.scrollTo({ left: container.clientWidth * index, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Mobile carousel */}
      <div className="lg:hidden relative -mx-5">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        >
          {images.map((img, idx) => (
            <div key={idx} className="relative min-w-full aspect-[4/5] snap-center bg-sand">
              <Image
                src={productImage(img, 1000)}
                alt={`${title}, view ${idx + 1} of ${images.length}`}
                fill
                sizes="100vw"
                priority={idx === 0}
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show image ${idx + 1}`}
                aria-current={activeIndex === idx}
                onClick={() => scrollToImage(idx)}
                className="p-2"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-500 ${activeIndex === idx ? 'w-6 bg-ivory' : 'w-1.5 bg-ivory/60'}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop editorial stack */}
      <div className="hidden lg:grid grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl bg-sand ${idx === 0 || images.length === 2 ? 'col-span-2 aspect-[5/4]' : 'aspect-[4/5]'}`}
            data-reveal="image"
          >
            <div className="absolute inset-0">
              <Image
                src={productImage(img, idx === 0 ? 1600 : 900)}
                alt={`${title}, view ${idx + 1} of ${images.length}`}
                fill
                sizes={idx === 0 ? '55vw' : '28vw'}
                priority={idx === 0}
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
