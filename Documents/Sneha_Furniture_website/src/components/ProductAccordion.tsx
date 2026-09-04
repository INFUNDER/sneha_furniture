'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type AccordionItem = {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

export default function ProductAccordion({ items }: { items: AccordionItem[] }) {
  // Keep track of which indices are currently open
  const [openIndices, setOpenIndices] = useState<number[]>(
    items.map((item, idx) => (item.defaultOpen ? idx : -1)).filter(idx => idx !== -1)
  );

  const toggleIndex = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter(i => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  return (
    <div className="flex flex-col border-t border-black w-full">
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);

        return (
          <div key={idx} className="border-b border-black">
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full flex items-center justify-between py-6 text-left hover:opacity-70 transition group"
            >
              <h3 className="text-xl font-black uppercase tracking-widest text-black">
                {item.title}
              </h3>
              <ChevronDown 
                className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                size={24} 
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? 'max-h-[2000px] opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0'
              }`}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
