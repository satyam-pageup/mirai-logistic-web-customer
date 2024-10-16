import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelDownloadService {

  constructor() { }

  exportToExcelWithHeaders(headers: string[], fileName: string): void {
    // Create a new worksheet and add headers
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers]);

    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the workbook and download the file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
