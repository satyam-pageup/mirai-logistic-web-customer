import { IRequest } from "./request";

export interface NotificationRequest extends IRequest {
    userId: number,
    notificationType: string | null,
    isCustomer: boolean | null,
    isRead: boolean | null
}