export interface IQuerySupportResponse<T> {
    total: number;
    queries: Array<T>
}

export interface IQueryDetails {
    id: number,
    customerId: number,
    orderId: string,
    pickupId: string,
    customerName: string,
    orderNo: string,
    pickupNo: string,
    queryDate: string,
    queryId: string,
    question: string,
    queryStatus: string,
    isActive: boolean,
}


export class ISingleQueryDetail {
    id: number = 0;
    customerId: number = 0;
    orderId: number = 0;
    orderNo: string = '';
    pickupId: number = 0;
    queryDate: string = '';
    queryId: string = '';
    question: string = '';
    queryStatus: string = '';
    isActive: boolean = false;
    orderGuId: string = '';
    pickupNo: string = '';
    customerName: string = '';
    communications: IAllQueryCommunication[] =[]
}

export class IAllQueryCommunication {
    id: number = 0;
    date: string = '';
    employeeId: number = 0;
    communication: string = '';
    queryStatus: string = '';
    employeeName: string = '';
}