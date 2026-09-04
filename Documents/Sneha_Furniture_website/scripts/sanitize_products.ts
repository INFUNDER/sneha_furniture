import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const nameReplacements: Record<string, string> = {
  'Luna': 'Classic',
  'Ronan': 'Modern',
  'Waverly': 'Premium',
  'Winchester': 'Luxury',
  'Farina': 'Royal',
  'Sehran': 'Elegant',
  'Ophelia': 'Designer',
  'Mia': 'Signature',
  'Wynn': 'Minimalist',
  'Vetra': 'Contemporary'
};

const BRAND_NAME = 'Sneha Furnitures';
const SNEHA_ADDRESS = 'Sneha Furnitures, 7, Saharanpur Rd, Patel Nagar, Dehradun, Uttarakhand 248001';

async function main() {
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    // 1. Sanitize Title
    let newTitle = product.title;
    for (const [oldName, newName] of Object.entries(nameReplacements)) {
      newTitle = newTitle.replace(oldName, `Sneha ${newName}`);
    }

    // 2. Sanitize Description
    let newDesc = product.description;
    if (newDesc.includes('by Sneha Furnitures') || newDesc.includes(product.title)) {
      newDesc = newDesc.replace(product.title, newTitle);
    }

    // 3. Sanitize Additional Specs
    let newSpecsStr = product.additionalSpecs;
    if (newSpecsStr) {
      try {
        const specs = JSON.parse(newSpecsStr);
        specs['Brand'] = BRAND_NAME;
        specs['Manufactured By'] = SNEHA_ADDRESS;
        specs['Sold By'] = SNEHA_ADDRESS;
        specs['Consumer Care Details'] = SNEHA_ADDRESS;
        specs['Marketer Details'] = SNEHA_ADDRESS;
        delete specs['Imported By'];
        delete specs['Item Code']; // Remove internal UL item codes
        
        newSpecsStr = JSON.stringify(specs);
      } catch(e) {
        console.error(`Failed to parse specs for ${product.id}`);
      }
    }

    // Update DB
    await prisma.product.update({
      where: { id: product.id },
      data: {
        title: newTitle,
        description: newDesc,
        additionalSpecs: newSpecsStr
      }
    });
    console.log(`Updated: ${product.title} -> ${newTitle}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
