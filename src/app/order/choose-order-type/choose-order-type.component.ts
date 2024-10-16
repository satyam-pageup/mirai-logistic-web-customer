import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExcelDownloadService } from '../../shared/services/excel-download.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { ComponentBase } from '../../shared/classes/component-base';
import { ExcelDataService } from '../../shared/services/excel-data.service';

@Component({
  selector: 'app-choose-order-type',
  templateUrl: './choose-order-type.component.html',
  styleUrl: './choose-order-type.component.scss'
})
export class ChooseOrderTypeComponent extends ComponentBase implements OnInit {
  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  public hoverClass: boolean = false;
  public headers: string[] = [
    'Warehouse Name',
    'Warehouse Phone No.',
    'Warehouse Address',
    'Warehouse Pincode',
    'Warehouse City',
    'Warehouse State',
    'Warehouse Country',
    'Consignee Name',
    'Consignee Phone No.',
    'Consignee Address',
    'Consignee Pincode',
    'Consignee City',
    'Consignee State',
    'Consignee Country',
    'Address Type',
    'Payment Mode',
    'Shipment Mode',
    'ToPay',
    'COD Amount',
    'Product Description',
    'HSN Code',
    'Quantity',
    'Weight',
    'Volume Quantity',
    'Width',
    'Length',
    'Height',
    'Product Amount',
    'Invoice No.',
    'Invoice Date',
  ]

  constructor(private excelDownloadService: ExcelDownloadService, private router: Router, private dataService: ExcelDataService) {
    super();
  }
  ngOnInit(): void {
  }

  public downloadExcel() {
    this.excelDownloadService.exportToExcelWithHeaders(this.headers, 'ShipmentData');
  }

  public uploadExcel(event: Event) {
    event.preventDefault();  // Prevent file from being handled by the browser
    event.stopPropagation(); // Stop further propagation of the event
    const target = event.target as HTMLInputElement;

    if (target.files && target.files[0]) {
      const file = target.files[0];

      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        console.log('File dropped:', file); // This should log file information properly
        this.readExcel(file);
      } else {
        console.log('Please upload a valid XLSX file.');
      }
    } else {
      console.log('No file was dropped.');
    }
  }

  private readExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result); // Read the file content as a byte array
      const workbook = XLSX.read(data, { type: 'array' }); // Parse the Excel file

      // Assuming the first sheet is what you need to read
      const firstSheetName = workbook.SheetNames[0]; // Get the name of the first sheet
      const worksheet = workbook.Sheets[firstSheetName]; // Get the first sheet

      // Convert the sheet into a JSON array and explicitly type it as any[][]
      const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const formattedData = excelData.map((row: any[],) => {
        row[29] = this.convertExcelDate(row[29]); // Convert date serial
        return row; 
      });
      this.dataService.setData(formattedData);
      this.router.navigate([this.appRoute.order.base, this.appRoute.order.bulkOrder]);
    };
    reader.readAsArrayBuffer(file);
    this.EEformValue.emit(true);
  }

  private convertExcelDate(excelDate: any): any {
    // Check if the value is a number and within a reasonable range for Excel date serials
    if (typeof excelDate === 'number' && excelDate > 0 && excelDate < 2958465) { // 2958465 is the Excel serial number for Dec 31, 9999
      const date = new Date(1900, 0, excelDate); // Subtract 1 because Excel dates start at 1900-01-01
      return date.toISOString().split('T')[0]; // Return the date in 'YYYY-MM-DD' format
    }

    return excelDate; // If it's not a valid number, return the original value
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.hoverClass = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.hoverClass = false;
  }

  // public accept() {
  //   this.EEformValue.emit(true)
  // }
  public decline() {
    this.EEformValue.emit(false);
  }
}
