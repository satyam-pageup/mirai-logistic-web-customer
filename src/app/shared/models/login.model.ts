import { FormControl } from "@angular/forms";

export interface loginForm {
    phoneNo: FormControl<string | null>;
    otp: FormControl<string | null>;
    fcmToken: FormControl<string | null>;
}

export interface loginFormData {
    phoneNo: string;
    otp: string;
    fcmToken: string;
}
