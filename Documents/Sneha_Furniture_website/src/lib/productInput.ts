import { PRODUCT_CATEGORIES } from '@/lib/site';

type ProductInput = {
  title: string;
  description: string;
  price: number;
  discountPrice: number | null;
  category: string;
  primaryMaterial: string | null;
  dimensions: string | null;
  finish: string | null;
  warranty: string | null;
  stock: number;
  images: string;
};

const optionalText = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);

// Validates admin product form data. Returns an error message or the cleaned input.
export function parseProductInput(data: Record<string, unknown>): { error: string } | { value: ProductInput } {
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description = typeof data.description === 'string' ? data.description.trim() : '';
  const category = typeof data.category === 'string' ? data.category.trim() : '';
  const price = Number(data.price);
  const discountPrice = data.discountPrice === '' || data.discountPrice == null ? null : Number(data.discountPrice);
  const stock = Number(data.stock);
  const images = Array.isArray(data.images) ? data.images.filter((u): u is string => typeof u === 'string' && u.trim() !== '') : [];

  if (!title || !description) return { error: 'Title and description are required' };
  if (!PRODUCT_CATEGORIES.includes(category)) return { error: 'Invalid category' };
  if (!Number.isFinite(price) || price <= 0) return { error: 'Price must be a positive number' };
  if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice <= 0 || discountPrice >= price)) {
    return { error: 'Discount price must be lower than the regular price' };
  }
  if (!Number.isInteger(stock) || stock < 0) return { error: 'Stock must be a whole number of 0 or more' };
  if (images.some((u) => !u.startsWith('/') && !u.startsWith('https://'))) return { error: 'Image URLs must be https or site paths' };

  return {
    value: {
      title,
      description,
      price,
      discountPrice,
      category,
      primaryMaterial: optionalText(data.primaryMaterial),
      dimensions: optionalText(data.dimensions),
      finish: optionalText(data.finish),
      warranty: optionalText(data.warranty),
      stock,
      images: JSON.stringify(images),
    },
  };
}
