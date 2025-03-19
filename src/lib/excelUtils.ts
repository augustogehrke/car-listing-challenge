import ExcelJS from "exceljs";

interface CarEntry {
    make?: string;
    model?: string;
    year?: number;
    price?: number;
    mileage?: number;
    color?: string;
    vin?: string;
    fieldErrors?: Record<string, string>;
  }
  
  export async function parseExcel(buffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];

    const expectedHeaders = ["make", "model", "year", "price", "mileage", "color", "vin"];
    
    const fileHeaders = worksheet.getRow(1).values
      .slice(1)
      .map(h => (typeof h === "string" ? h.trim().toLowerCase() : ""));

    const missingHeaders = expectedHeaders.filter(h => !fileHeaders.includes(h));

    if (missingHeaders.length > 0) {
        return { error: `Invalid headers. Missing: ${missingHeaders.join(", ")}` };
    }

    const validEntries: CarEntry[] = [];
    const invalidEntries: CarEntry[] = [];
  
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
  
      const entry: CarEntry = {};
      const fieldErrors: { [key: string]: string } = {};
  
      expectedHeaders.forEach((header, index) => {
        const cell = row.getCell(index + 1);
        let value = cell.value;
  
        if (typeof value === "string") {
          value = value.trim().toLowerCase();
        }
  
        if (["make", "model", "year", "price", "mileage", "vin"].includes(header) && !value) {
          fieldErrors[header] = `Field ${header} is required`;
        } else if (header === "year" && (isNaN(Number(value)) || Number(value) < 1900 || Number(value) > new Date().getFullYear())) {
          fieldErrors[header] = "Invalid year";
        } else if (header === "price" && (isNaN(Number(value)) || Number(value) <= 0)) {
          fieldErrors[header] = "Invalid price";
        } else if (header === "mileage" && (isNaN(Number(value)) || Number(value) < 0)) {
          fieldErrors[header] = "Invalid mileage";
        }
  
        entry[header] = value;
      });
  
      if (Object.keys(fieldErrors).length > 0) {
        entry.fieldErrors = fieldErrors;
        invalidEntries.push(entry);
  
        Object.keys(fieldErrors).forEach(errorColumn => {
          const columnIndex = expectedHeaders.indexOf(errorColumn) + 1;
          if (columnIndex > 0) {
            const errorCell = row.getCell(columnIndex);
            errorCell.border = {
              top: { style: "thin", color: { argb: "FF0000" } },
              left: { style: "thin", color: { argb: "FF0000" } },
              bottom: { style: "thin", color: { argb: "FF0000" } },
              right: { style: "thin", color: { argb: "FF0000" } }
            };
          }
        });
        
        row.getCell(expectedHeaders.length + 1).value = Object.values(fieldErrors).join("; ");
      } else {
        validEntries.push(entry);
      }
    });
  
    return { validEntries, invalidEntries, workbook };
  }


  export function generateErrorFile(invalidEntries: CarEntry[]) {
    if (invalidEntries.length === 0) return null;
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Errors");
  
    const headers = ["make", "model", "year", "price", "mileage", "color", "vin", "error description"];
    worksheet.addRow(headers).font = { bold: true };
  
    invalidEntries.forEach(entry => {
      const row = worksheet.addRow([
        entry.make || "",
        entry.model || "",
        entry.year || "",
        entry.price || "",
        entry.mileage || "",
        entry.color || "",
        entry.vin || "",
        Object.values(entry.fieldErrors || {}).join("; ")
      ]);
  
      Object.keys(entry.fieldErrors).forEach(errorField => {
        const columnIndex = headers.indexOf(errorField) + 1;
        if (columnIndex > 0) {
          row.getCell(columnIndex).border = {
            top: { style: "thin", color: { argb: "FF0000" } },
            left: { style: "thin", color: { argb: "FF0000" } },
            bottom: { style: "thin", color: { argb: "FF0000" } },
            right: { style: "thin", color: { argb: "FF0000" } }
          };
        }
      });
    });

    return workbook.xlsx.writeBuffer();
  }