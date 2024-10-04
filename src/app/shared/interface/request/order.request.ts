import { IRequest } from "./request";

export interface IOrderDetailsRequest extends IRequest{
    orderStatus: string | null,
    deliveryType: string | null,
    startDate: string | null,
    endDate: string | null,
    customerId: number | null
}
