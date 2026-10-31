'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';

type AccordionItem = {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

export default function ProductAccordion({ items }: { items: AccordionItem[] }) {
  const baseId = useId();
  const [openIndices, setOpenIndices] = useState<number[]>(
    items.map((item, idx) => (item.defaultOpen ? idx : -1)).filter(idx => idx !== -1)
  );

  const toggleIndex = (index: number) => {
    setOpenIndices((open) => (open.includes(index) ? open.filter(i => i !== index) : [...open, index]));
  };

  return (
    <div className="mt-10 border-t border-line">
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const panelId = `${baseId}-panel-${idx}`;

        return (
          <div key={idx} className="border-b border-line">
            <button
              type="button"
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between py-5 text-left group"
            >
              <span className="font-display text-2xl text-ink">{item.title}</span>
              <Plus
                size={18}
                strokeWidth={1.5}
                className={`text-stone transition-transform duration-500 ease-out-soft group-hover:text-brass ${isOpen ? 'rotate-45' : ''}`}
              />
            </button>
            {/* grid-rows trick animates to the content's natural height */}
            <div
              id={panelId}
              role="region"
              className={`grid transition-[grid-template-rows] duration-500 ease-out-soft ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="pb-6 text-sm leading-relaxed text-stone">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
