import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const priceMap: Record<string, { price: number, discountPrice: number }> = {
  'cmtl4sa980000l204zcyklnc3': { price: 38999, discountPrice: 28999 }, // Classic Beige Fabric
  'cmtn6rmaj0002l98wc6wtobzi': { price: 85999, discountPrice: 62999 }, // Premium Leather Apricot
  'cmtn6rmj30003l98wek1d25ij': { price: 115999, discountPrice: 89999 }, // Luxury Italian Leather Cognac
  'cmtn6rmy20005l98wiovr1ry5': { price: 34999, discountPrice: 24999 }, // Elegant Fabric Cream
  'cmtn6rndk0007l98wbd76nds5': { price: 42999, discountPrice: 32999 }, // Designer Fabric Monochrome
  'cmtn6rnkk0008l98w1uce3cls': { price: 48999, discountPrice: 36999 }, // Signature Fabric Forest Green
  'cmtn6rntx0009l98wz0xh2voa': { price: 32999, discountPrice: 22999 }, // Minimalist Fabric Baltic Blue
  'cmtn6rlu70000l98wzw7tbfpv': { price: 92999, discountPrice: 68999 }, // Contemporary Leather Olive
  'cmtn6rm3p0001l98wqbg1ouzc': { price: 36999, discountPrice: 26999 }, // Modern Fabric Rust
  'cmtn6rmp70004l98wn5huifn5': { price: 65999, discountPrice: 48999 }, // Royal Half Leather Bordeaux
  'cmtn6rn4g0006l98w7jm4d2e2': { price: 45999, discountPrice: 34999 }  // Classic Leatherette Burgundy
};

async function main() {
  for (const [id, prices] of Object.entries(priceMap)) {
    await prisma.product.update({
      where: { id },
      data: {
        price: prices.price,
        discountPrice: prices.discountPrice
      }
    });
    console.log(`Updated product ${id} to Price: ${prices.price}, Discount: ${prices.discountPrice}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
