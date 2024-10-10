import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface IRateRequestForm {
  sourcePincode: FormControl<string | null>;
  destinationPincode: FormControl<string | null>;
  serviceType: FormControl<string | null>;
  boxInfos: FormArray<FormGroup<BoxInfoForm>>;
}

export interface BoxInfoForm {
  quantity: FormControl<number | null>;
  weight: FormControl<number | null>;
  volumes: FormArray<FormGroup<VolumeForm>>;
}

export interface VolumeForm {
  quantity: FormControl<number | null>;
  length: FormControl<number | null>;
  width: FormControl<number | null>;
  height: FormControl<number | null>;
}


export interface ITotalAmountReferenceData{
    volume: string,
    sourcePincode: string,
    quantity:number,
    serviceType: string,
    destinationPincode: string,
    price: number,
    totalPrice: number,
    charges: Icharges[];
}

export interface Icharges {
  percent: number,
  charge: number,
  name: string
}
