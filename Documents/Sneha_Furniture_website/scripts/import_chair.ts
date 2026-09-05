import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productData = {
    title: "Sneha Niyo Leatherette Lounge Chair",
    description: "Make an unforgettable impression with the Sneha Lounge Chair, a striking style icon for your home. Its contemporary silhouette and bold presence elevate the look of any living area. The chair's unique design and 360-degree swivel function bring a touch of comfort and sophistication, turning your space into a centre stage of modern flair.",
    price: 18500,
    category: "Chair",
    primaryMaterial: "Leatherette",
    finish: "Saddle Tan",
    dimensions: "85cm x 92cm x 79cm",
    stock: 12,
    images: JSON.stringify([
      "/inventory/chairs/chair1/chair 1 a.png",
      "/inventory/chairs/chair1/chair 1 b.png",
      "/inventory/chairs/chair1/chair 1 c.png",
      "/inventory/chairs/chair1/chair 1 d.png"
    ]),
    additionalSpecs: JSON.stringify({
      "Generic Name": "Lounge Chair",
      "Item Code": "FNSTLC5ITA16203",
      "Product Assembly": "Pre Assembled",
      "Primary Room": "Living Room",
      "Swivel Availability": "With Swivel",
      "Seating Capacity": "1 Seater",
      "Warranty In Months": 24,
      "Country of Origin": "India",
      "Manufactured By": "Sneha Furnitures, Dehradun",
      "Sold By": "Sneha Furnitures, Dehradun",
      "Consumer Care Details": "ronitmittal0@gmail.com, +91 96343 12102",
      "Net Weight (kg)": 37
    })
  };

  const created = await prisma.product.create({
    data: productData
  });

  console.log(`Successfully imported: ${created.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
