import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyProducts = [
  {
    title: 'Classic Teak Coffee Table',
    description: 'A beautifully handcrafted coffee table made from solid Teak wood. Features a sleek, modern design with a warm, natural finish that highlights the wood\'s grain.',
    price: 15000,
    discountPrice: 12500,
    category: 'Living Room',
    primaryMaterial: 'Teak Wood',
    dimensions: '40"W x 20"D x 16"H',
    finish: 'Natural Honey',
    warranty: '2 Years Standard',
    stock: 12,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 4.8,
    reviewsCount: 24
  },
  {
    title: 'Sheesham Wood King Bed',
    description: 'Experience luxury and comfort with our premium Sheesham wood king-size bed. Built to last with a sturdy frame and elegant headboard detailing.',
    price: 45000,
    discountPrice: null,
    category: 'Bedroom',
    primaryMaterial: 'Sheesham Wood',
    dimensions: '76"W x 80"L x 42"H',
    finish: 'Walnut',
    warranty: '5 Years Structural',
    stock: 5,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536349788264-1cb81f33fcd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 5.0,
    reviewsCount: 18
  },
  {
    title: 'Velvet Lounge Accent Chair',
    description: 'Add a pop of color and mid-century modern aesthetic to your living space. Upholstered in premium velvet with solid ash wood legs.',
    price: 18500,
    discountPrice: 16000,
    category: 'Living Room',
    primaryMaterial: 'Ash Wood & Velvet',
    dimensions: '28"W x 30"D x 34"H',
    finish: 'Emerald Green Velvet',
    warranty: '1 Year',
    stock: 8,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 4.5,
    reviewsCount: 32
  },
  {
    title: 'Solid Wood 6-Seater Dining Set',
    description: 'A complete dining solution crafted from solid mango wood. Includes a spacious rectangular table and 6 upholstered chairs.',
    price: 65000,
    discountPrice: 58000,
    category: 'Dining',
    primaryMaterial: 'Mango Wood',
    dimensions: '72"L x 36"W x 30"H',
    finish: 'Rustic Oak',
    warranty: '3 Years Standard',
    stock: 3,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1617806118233-18e1c0945594?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 4.9,
    reviewsCount: 15
  },
  {
    title: 'Modern Floating TV Unit',
    description: 'Minimalist wall-mounted TV console with ample storage. Features dual cabinets and a central display shelf.',
    price: 22000,
    discountPrice: null,
    category: 'Living Room',
    primaryMaterial: 'Engineered Wood & Teak Veneer',
    dimensions: '60"W x 14"D x 12"H',
    finish: 'Matte White & Natural Wood',
    warranty: '2 Years Standard',
    stock: 15,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 4.2,
    reviewsCount: 8
  },
  {
    title: 'Minimalist Oak Wood Desk',
    description: 'Perfect for your home office. Clean lines, a smooth oak finish, and two spacious drawers for all your essentials.',
    price: 16000,
    discountPrice: 14500,
    category: 'Office',
    primaryMaterial: 'Solid Oak Wood',
    dimensions: '48"W x 24"D x 30"H',
    finish: 'Natural Oak',
    warranty: '2 Years Standard',
    stock: 20,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 4.6,
    reviewsCount: 41
  },
  {
    title: 'Premium Leather Recliner Sofa',
    description: 'Sink into luxury with this top-grain Italian leather 3-seater recliner sofa. Unmatched comfort and durability.',
    price: 85000,
    discountPrice: null,
    category: 'Living Room',
    primaryMaterial: 'Italian Leather & Metal Frame',
    dimensions: '82"W x 38"D x 40"H',
    finish: 'Cognac Brown',
    warranty: '5 Years Structural',
    stock: 4,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 4.9,
    reviewsCount: 11
  },
  {
    title: 'Outdoor Teak Patio Set',
    description: 'Enjoy the outdoors with this weather-resistant teak wood patio set. Includes one round table and four folding chairs.',
    price: 42000,
    discountPrice: 38000,
    category: 'Outdoor',
    primaryMaterial: 'Grade A Teak Wood',
    dimensions: '48" Diameter Table',
    finish: 'Natural Teak Oil',
    warranty: '3 Years',
    stock: 7,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1595846519845-68e298c2cebc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 4.7,
    reviewsCount: 19
  },
  {
    title: 'Marble Top Nesting Tables',
    description: 'A set of two elegant nesting tables with genuine white marble tops and gold-finished iron bases.',
    price: 18500,
    discountPrice: 15500,
    category: 'Living Room',
    primaryMaterial: 'Marble & Iron',
    dimensions: '24" Dia (Large), 18" Dia (Small)',
    finish: 'White Marble / Brushed Gold',
    warranty: '1 Year',
    stock: 10,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]),
    ratings: 4.8,
    reviewsCount: 33
  }
];

async function main() {
  console.log('Seeding database with dummy products...');
  for (const product of dummyProducts) {
    await prisma.product.create({
      data: product
    });
  }
  console.log('Dummy products seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
