const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const prisma = new PrismaClient();

async function main() {
  const baseDir = '/Users/ronitmittal/Documents/Sneha_Furniture_website/sofas - Copy ';
  const publicImagesDir = path.join(__dirname, '../public/products/sofas');

  // Create public directory if not exists
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  // Clear existing database records!
  console.log('Wiping existing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.product.deleteMany({});

  const dirs = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

  for (const dir of dirs) {
    console.log(`Processing ${dir}...`);
    const dirPath = path.join(baseDir, dir);
    const files = fs.readdirSync(dirPath);

    // Find Excel and Images
    const excelFile = files.find(f => f.endsWith('.xlsx'));
    const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

    if (!excelFile) {
      console.log(`Skipping ${dir}: No excel file found`);
      continue;
    }

    // Process Excel
    const workbook = xlsx.readFile(path.join(dirPath, excelFile));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const title = data[0][0];
    const description = data[1] && data[1][0] ? data[1][0] : 'Premium Sofa by Sneha Furnitures';

    // Extract key values
    const dict = {};
    for (const row of data) {
      if (row.length >= 2) {
        dict[row[0].trim()] = row[1];
      }
    }

    // Default values
    const price = Math.floor(Math.random() * (60000 - 30000) + 30000);
    const discountPrice = Math.floor(price * 0.85); // 15% discount
    const stock = 10;

    // Process Images
    const imageUrls = [];
    let imgCounter = 1;
    for (const img of imageFiles) {
      const srcPath = path.join(dirPath, img);
      const ext = path.extname(img);
      const destFilename = `${dir.replace(/\s+/g, '-')}-${imgCounter}${ext}`;
      const destPath = path.join(publicImagesDir, destFilename);
      
      fs.copyFileSync(srcPath, destPath);
      imageUrls.push(`/products/sofas/${destFilename}`);
      imgCounter++;
    }

    // Construct Product Object
    const productData = {
      title: title,
      description: description,
      price: price,
      discountPrice: discountPrice,
      category: 'Sofa',
      primaryMaterial: dict['Primary Material (Upholstery)'] || dict['Primary Material'] || 'Premium Fabric',
      dimensions: `L: ${dict['Length']} x W: ${dict['Width']} x H: ${dict['Height']}`,
      finish: dict['Leg & Base Finish'] || dict['Colour'] || 'Standard Finish',
      warranty: dict['Warranty'] || '12 Months',
      stock: stock,
      images: JSON.stringify(imageUrls),
      additionalSpecs: JSON.stringify({
        'Color': dict['Colour'],
        'Assembly': dict['Product Assembly'],
        'Seating Capacity': dict['Seating Capacity']
      })
    };

    await prisma.product.create({
      data: productData
    });
    console.log(`✅ Created Product: ${title}`);
  }

  console.log('Migration Complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
