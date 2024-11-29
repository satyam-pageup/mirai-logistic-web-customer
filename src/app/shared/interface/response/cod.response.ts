export interface ICODResponse {
    id: number;
    customerId: number;
    customerName: string;
    returnDate: string;
    codAmount: number;
    codOrderInfos: CodOrderInfo[];
}

export interface CodOrderInfo {
    id: number;
    orderId: string;
    orderNo: string;
    orderDate: string;
    codAmount: number;
}

export interface IResponseC<T> {
    total: number;
    codReturns: Array<T>
}
