export function formatPrice(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

const SMALL_WORDS = new Set(['and', 'with', 'of', 'the', 'a', 'an', 'in', 'on', 'for', 'to']);

// Some product titles were imported in ALL CAPS; show them in title case so the
// catalogue reads consistently. Mixed-case titles are left exactly as entered.
export function displayTitle(title: string) {
  if (title !== title.toUpperCase()) return title;
  return title
    .toLowerCase()
    .split(' ')
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.replace(/(^|-)(\p{L})/gu, (m) => m.toUpperCase())))
    .join(' ');
}

export function discountPercent(price: number, discountPrice: number | null) {
  if (discountPrice == null || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}
