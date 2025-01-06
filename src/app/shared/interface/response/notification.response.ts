export interface ITotalNotification<T> {
    total: number;
    totalUnread: number;
    notifications: T;
  }
  
  export interface Notification {
    id: number;
    body: string;
    title: string;
    type: string;
    isRead: boolean;
  }