import { IRequest } from "./request"

export interface IQuerySupportRequest extends IRequest {
    startDate: string | null,
    endDate: string | null,
    customerId: number | null,
    employeeId: number | null,
    queryStatus: string | null
}
