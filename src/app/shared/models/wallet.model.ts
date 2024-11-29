import { FormControl } from "@angular/forms";
import { orderFormData } from "./order.model";

export interface walletRechargeForm {
    amount: FormControl<number | null>,
    transactionId: FormControl<string | null>,
    customerId: FormControl<number | null>,
}

export interface walletRechargeFormData {
    amount: number,
    transactionId: string,
    customerId: number,
    onlinePaymentId: number
}


export interface RazorpayForm {
    amount: FormControl<number | null>,
}

export interface RazorpayFormData {
    amount: number,
    from: string,
    orderData: unknown | null
}

export interface RazorpayVerificationForm {
    onlinePaymentId: FormControl<number | null>,
    razorpayOrderId: FormControl<string | null>,
    razorpayPaymentId: FormControl<string | null>,
    razorpaySignature: FormControl<string | null>,
    customerId: FormControl<number | null>,
    addressId: FormControl<number | null>,
    paymentRef: FormControl<string | null>
}
export interface RazorpayVerificationData {
    onlinePaymentId: number,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    customerId: number,
    razorPayPaymentType: string,
    upsertOrderDto: orderData | null,
    rechargeWalletDto: walletRechargeFormData | null
}

export interface orderData extends orderFormData {
    onlinePaymentId: number
}
