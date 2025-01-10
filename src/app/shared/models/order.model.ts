import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface orderForm {
    id: FormControl<number | null>,
    customerId: FormControl<number | null>,
    warehouseId: FormControl<number | null>,
    totalAmount: FormControl<number | null>,
    sourcePincode: FormControl<string | null>,
    paymentType: FormControl<string | null>,
    forwardShipments: FormArray<FormGroup<shipmentForm>>;
    warehouse: FormGroup<warehouseForm>;
}

export interface orderFormData {
    id: number,
    customerId: number,
    warehouseId: number,
    totalAmount: number,
    sourcePincode: string,
    paymentType: string,
    forwardShipments: Partial<shipmentFormData>[];
    warehouse: Partial<warehouseFormData>;
}


export interface shipmentForm {
    id: FormControl<number | null>;
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
    totalAmount: FormControl<number | null>;
    // products: FormControl<FormArray<FormGroup<newOrderForm>> | null>;
    products: FormArray<FormGroup<productForm>>;
}
export interface shipmentFormData {
    id: number;
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
    codAmount: number;
    totalAmount: number;
    products: Partial<Product>[];
}


export interface productForm {
    id: FormControl<number | null>;
    productDescription: FormControl<string | null>;
    hsnCode: FormControl<string | null>;
    waybillNo: FormControl<string | null>;
    quantity: FormControl<number | null>;
    weight: FormControl<number | null>;
    productAmount: FormControl<number | null>;
    invoiceNo: FormControl<string | null>;
    invoiceDate: FormControl<string | null>;
    volumes: FormArray<FormGroup<volumeForm>>
}

export interface Product {
    id: number;
    productDescription: string;
    hsnCode: string;
    quantity: number;
    waybillNo: string;
    weight: number;
    productAmount: number;
    invoiceNo: string;
    invoiceDate: string;
    volumes: Volume[];
}
export interface volumeForm {
    id: FormControl<number | null>;
    quantity: FormControl<number | null>;
    width: FormControl<number | null>;
    length: FormControl<number | null>;
    height: FormControl<number | null>;
    barcodes: FormArray<FormControl<string | null>>;
    wayBills: FormArray<FormControl<string | null>>;
    isMatchBarcode: FormControl<boolean | null>;
}

export interface Volume {
    id: number;
    quantity: number;
    width: number;
    length: number;
    height: number;
    wayBills: Array<string>;
    barcodes: Array<string>;
    isMatchBarcode: boolean;
}


export interface warehouseForm {
    id: FormControl<number | null>,
    name: FormControl<string | null>,
    phone: FormControl<string | null>,
    address: FormControl<string | null>,
    pincode: FormControl<string | null>,
    city: FormControl<string | null>,
    state: FormControl<string | null>,
    country: FormControl<string | null>,
    isActive: FormControl<boolean | null>,
}


export interface warehouseFormData {
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


//update orderform
export interface UpdateOrderForm {
    id: FormControl<number | null>,
    forwardShipments: FormArray<FormGroup<UpdateForwardShipment>>;
}

export interface UpdateForwardShipment {
    id: FormControl<number | null>;
    paymentMode: FormControl<string | null>;
    codAmount: FormControl<number | null>;
    products: FormArray<FormGroup<UpdateProductForm>>;
}
export interface UpdateProductForm {
    id: FormControl<number | null>;
    productDescription: FormControl<string | null>,
    hsnCode: FormControl<string | null>,
}


export interface UpdateOrderFormData {
    id: number;
    forwardShipments: UpdateForwardShipmentData[];
  }
  
  export interface UpdateForwardShipmentData {
    id: number;
    paymentMode: string;
    codAmount: number;
    products: UpdateProductFormData[];
  }
  
  export interface UpdateProductFormData {
    id: number;
    productDescription: string;
    hsnCode: string;
  }