export interface IResponseWalletLogs<T> {
    total: number;
    payments: Array<T>
}

export interface IWalletDetails {
    id: number,
    orderId: number,
    customerId: number,
    dabit: number,
    credit: number,
    createdTime: string,
    status: string,
    paymentStatus: string,
}


export interface IRazorpayApiResponse {
    onlinePaymentId: number,
    amount: number,
    orderId: string,
    currency: string,
    status: string,
}

//verification api response


export interface IVerificationResponse {
    verificationStatus: string;
    razorPayPaymentType: string;
    walletRecharge: boolean;
    upsertOrderResponseDto: UpsertOrderResponseDto;
}

export interface UpsertOrderResponseDto {
    id: number;
    orderId: string;
    leftDays: number;
}