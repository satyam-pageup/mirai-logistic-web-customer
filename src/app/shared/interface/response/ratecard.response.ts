export interface RateCard {
    id: number;
    rate: number;
    sourceZoneId: number;
    destinationZoneId: number;
}

export interface IB2BListData {
    rateCard: RateCard[];
    customerId: number;
    accountType: string;
    serviceType: string;
}