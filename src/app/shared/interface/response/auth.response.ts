export interface ILoginResponse {
    token: string,
    refreshToken:string,
    customer: Customer;
}

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    state: string;
    city: string;
    pinCode: string;
    email: string;
    contact: string;
    customerType: string;
    isLogin: boolean;
    isActive: boolean;
    isWallet: boolean;
    isCreditLimit: boolean;
    creditLimit: number;
    walletAmount: number;
    usedCreditLimit: number;
    pendingBalance: number;
    isDebit: boolean;
  }