import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const EXCEL_PATH = path.join(__dirname, '../sofa.xlsx');
const IMAGES_SOURCE_DIR = path.join(__dirname, '../sofa');
const PUBLIC_INVENTORY_DIR = path.join(__dirname, '../public/inventory/sofas');

// Helper to sanitize text
function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/Urban Ladder/gi, 'Sneha Furnitures')
    .replace(/UrbanLadder/gi, 'Sneha Furnitures')
    .replace(/urbanladder\.com/gi, 'snehafurniture.in')
    .replace(/Reliance Retail Limited.*/gi, 'Sneha Furnitures, 7, Saharanpur Rd, Patel Nagar, Dehradun, Uttarakhand 248001')
    .replace(/hello@urbanladder\.com/gi, 'ronitmittal0@gmail.com')
    .replace(/080-46666777/gi, '+91 96343 12102');
}

async function main() {
  console.log('Starting bulk import...');

  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_INVENTORY_DIR)) {
    fs.mkdirSync(PUBLIC_INVENTORY_DIR, { recursive: true });
  }

  const workbook = xlsx.readFile(EXCEL_PATH);

  for (const sheetName of workbook.SheetNames) {
    console.log(`Processing ${sheetName}...`);
    const sheet = workbook.Sheets[sheetName];
    // Read as array of arrays
    const rows = xlsx.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    let currentSection = '';
    
    // Product fields
    let title = '';
    let description = '';
    let primaryMaterial = '';
    let dimensions = '';
    let finish = '';
    let warranty = '';
    
    // Arrays to collect multi-line text
    let careInstructionsArr: string[] = [];
    let returnsPolicyArr: string[] = [];
    let descriptionArr: string[] = [];
    
    // Generic specs
    let additionalSpecs: Record<string, string> = {};

    for (const row of rows) {
      if (!row || row.length === 0) continue;

      // Determine section based on the 'Link' column (index 0)
      if (row[0] && typeof row[0] === 'string' && row[0] !== 'Link') {
        currentSection = row[0].trim();
      }

      const key = row[1];
      const val = row[2];

      if (key === 'Name' && val) {
        title = sanitizeText(val);
        continue;
      }

      // If it's a generic description sentence (Urban Ladder puts descriptions as key-value where key is the URL and value is the text)
      if (!key && val && typeof val === 'string') {
        const sanitizedVal = sanitizeText(val);
        if (currentSection === 'Care & Maintenance') {
          careInstructionsArr.push(sanitizedVal);
        } else if (currentSection === 'Returns' || currentSection === 'Warranty') {
          returnsPolicyArr.push(sanitizedVal);
        } else if (currentSection === 'Specifications' || currentSection === 'Properties') {
          descriptionArr.push(sanitizedVal);
        }
        continue;
      }

      if (key && val) {
        const cleanKey = key.toString().trim();
        const cleanVal = sanitizeText(val.toString().trim());

        if (cleanKey === 'Primary Material Type' || cleanKey === 'Primary Material') primaryMaterial = cleanVal;
        else if (cleanKey === 'Dimensions') dimensions = cleanVal;
        else if (cleanKey === 'Finish' || cleanKey === 'Primary Finish') finish = cleanVal;
        else if (cleanKey === 'Warranty In Months') warranty = `${cleanVal} Months`;
        else {
          additionalSpecs[cleanKey] = cleanVal;
        }
      }
    }

    // Process Images
    // SheetName is like "Sofa 1" -> folder is "sofa 1"
    const sourceFolder = path.join(IMAGES_SOURCE_DIR, sheetName.toLowerCase());
    const destFolder = path.join(PUBLIC_INVENTORY_DIR, sheetName.toLowerCase().replace(' ', '_'));
    
    const imageUrls: string[] = [];

    if (fs.existsSync(sourceFolder)) {
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      const files = fs.readdirSync(sourceFolder);
      for (const file of files) {
        if (file.startsWith('.')) continue; // skip .DS_Store
        
        const srcPath = path.join(sourceFolder, file);
        const destPath = path.join(destFolder, file);
        
        // Copy file
        fs.copyFileSync(srcPath, destPath);
        
        // Web path
        imageUrls.push(`/inventory/sofas/${sheetName.toLowerCase().replace(' ', '_')}/${file}`);
      }
    }

    if (!title) {
      console.log(`Skipping ${sheetName}, no title found.`);
      continue;
    }

    // Insert to DB
    const productData = {
      title,
      description: descriptionArr.join('\n\n') || `${title} by Sneha Furnitures`,
      price: 25000,
      category: 'Sofa',
      stock: 10,
      primaryMaterial,
      dimensions,
      finish,
      warranty,
      careInstructions: careInstructionsArr.join('\n\n'),
      returnsPolicy: returnsPolicyArr.join('\n\n'),
      additionalSpecs: JSON.stringify(additionalSpecs),
      images: JSON.stringify(imageUrls)
    };

    await prisma.product.create({
      data: productData
    });

    console.log(`Successfully imported: ${title}`);
  }

  console.log('Import complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
