import { FormControl, FormGroup } from "@angular/forms";

export interface bulkOrderForm {
    id: FormControl<number | null>;
    warehouseId: FormControl<number | null>;
    sourcePincode: FormControl<string | null>;
    totalAmount: FormControl<number | null>;
    name: FormControl<string | null>;
    phone: FormControl<string | null>;
    address: FormControl<string | null>;
    pincode: FormControl<string | null>;
    city: FormControl<string | null>;
    state: FormControl<string | null>;
    country: FormControl<string | null>;
    addressType: FormControl<string | null>;
    paymentMode: FormControl<string | null>;
    shipmentMode: FormControl<string | null>;
    toPay: FormControl<boolean | null>;
    codAmount: FormControl<number | null>;
    codReturn: FormControl<boolean | null>;
    productDescription: FormControl<string | null>;
    hsnCode: FormControl<string | null>;
    quantity: FormControl<number | null>;
    weight: FormControl<number | null>;
    volumeQuantity: FormControl<number | null>;
    width: FormControl<number | null>;
    length: FormControl<number | null>;
    height: FormControl<number | null>;
    productAmount: FormControl<number | null>;
    invoiceNo: FormControl<string | null>;
    invoiceDate: FormControl<string | null>;
    warehouse: FormGroup<warehouseForm>;
}


export interface warehouseForm {
    wId: FormControl<number | null>,
    wName: FormControl<string | null>,
    wPhone: FormControl<string | null>,
    wAddress: FormControl<string | null>,
    wPincode: FormControl<string | null>,
    wCity: FormControl<string | null>,
    wState: FormControl<string | null>,
    wCountry: FormControl<string | null>,
    wIsActive: FormControl<boolean | null>,
}


export interface bulkOrderFormData {
    id: number;
    warehouseId: number;
    sourcePincode: string;
    totalAmount: number;
    name: string;
    phone: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    addressType: string;
    paymentMode: string;
    shipmentMode: string;
    toPay: boolean;
    codAmount: number;
    codReturn: boolean;
    productDescription: string;
    hsnCode: string;
    quantity: number;
    weight: number;
    volumeQuantity: number;
    width: number;
    length: number;
    height: number;
    productAmount: number;
    invoiceNo: string;
    invoiceDate: string;
    warehouse: Warehouse;
  }
  
  export interface Warehouse {
    id: number;
    name: string;
    phone: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    isActive: boolean;
  }