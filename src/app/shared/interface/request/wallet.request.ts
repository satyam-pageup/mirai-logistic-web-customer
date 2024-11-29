import { IRequest } from "./request"

export interface IWalletRequest extends IRequest {
    startDate: string | null,
    endDate: string | null,
    customerId: number | null,
}
