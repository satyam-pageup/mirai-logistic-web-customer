import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelDataService {
  private excelData: any[] = [];

  constructor() { }

  setData(data: any[]) {
    this.excelData = data;
  }


  getData(): any[] {
    return this.excelData;
  }
  

  clearData() {
    this.excelData = [];
  }
}
