import { FormControl } from "@angular/forms";

export interface pickupGenerateForm {
    id: FormControl<number | null>,
    orderId: FormControl<number | null>,
    pickupDate: FormControl<string | null>,
    packageCount: FormControl<number | null>,
    isSelfPickup: FormControl<boolean | null>,
    wheelerType: FormControl<string | null>,
}

export interface pickupGenerateFormData {
    id: number,
    orderId: number,
    pickupDate: string,
    packageCount: number,
    isSelfPickup: boolean,
    wheelerType: string,
}
