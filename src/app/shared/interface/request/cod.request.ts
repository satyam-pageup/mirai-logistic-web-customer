import { IRequest } from "./request"

export interface IPaidCODRequest extends IRequest {
    customerId:number | null
}
