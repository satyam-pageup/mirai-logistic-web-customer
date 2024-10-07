import { FormControl } from "@angular/forms";

export interface queryForm {
    id: FormControl<number | null>;
    customerId: FormControl<number | null> ;
    customerName: FormControl<string | null>;
    orderId: FormControl<number | null>;
    pickupId: FormControl<number | null>;
    question: FormControl<string | null>;
}

export interface queryFormData {
    id: number | null;
    customerId: number | null;
    orderId: number | null;
    pickupId: number | null;
    question: string | null;
}

export interface activeModule {
    name: string | null;
    id: string | null
}

export interface communicationForm {
    id: FormControl<number | null>;
    queryId: FormControl<number | null> ;
    date: FormControl<string | null>;
    communication: FormControl<string | null>;
    queryStatus: FormControl<string | null>;
}

export interface communicationFormData {
    id: number | null;
    queryId: number | null;
    date: string | null;
    communication: string | null;
    queryStatus: string | null;
}

export interface communicationReferenceData {
    queryId: number | null;
    queryStatus: string | null;
}

