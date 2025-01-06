import { IRequest } from "./request"

export interface IB2BTableDetailsRequest {
    accountType: string | null,
    serviceType: string | null,
    customerId: number | null
}
export interface IB2BDetailsRequest extends IRequest {
    accountType: string | null,
    serviceType: string | null,
    cardSearchType: string | null,
    customerId: number | null
}