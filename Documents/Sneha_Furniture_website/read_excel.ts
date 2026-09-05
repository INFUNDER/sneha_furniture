import * as xlsx from 'xlsx';
const workbook = xlsx.readFile('chairs 1.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
console.log(JSON.stringify(data.slice(0, 30), null, 2));
