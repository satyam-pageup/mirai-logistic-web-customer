import { FormControl } from "@angular/forms";

export interface customerRegistrationForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    address: FormControl<string | null>;
    state: FormControl<string | null>;
    city: FormControl<string | null>;
    pinCode: FormControl<string | null>;
    email: FormControl<string | null>;
    contact: FormControl<string | null>;
    customerType: FormControl<string | null>;
    isLogin: FormControl<boolean | null>;
}

export interface customerRegistrationFormData {
    id: number | null,
    firstName: string | null;
    lastName: string | null;
    state: string | null;
    city: string | null;
    pinCode: string | null;
    email: string | null;
    contact: string | null;
    address: string | null;
    customerType: string | null;
    isLogin: boolean | null;
    userName: string | null;
    password: string | null;
    fcmToken: string | null;
}


//google update form
export interface googleUpdateForm {
    id: FormControl<number | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    address: FormControl<string | null>;
    state: FormControl<string | null>;
    city: FormControl<string | null>;
    pinCode: FormControl<string | null>;
    email: FormControl<string | null>;
    contact: FormControl<string | null>;
}

export interface googleUpdateFormData {
    id: number | null,
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    state: string | null;
    city: string | null;
    pinCode: string | null;
    email: string | null;
    contact: string | null;
}