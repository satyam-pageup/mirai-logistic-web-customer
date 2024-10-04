export interface IRateDetails<T> {
    price: number,
    totalPrice: number,
    charges: Array<T>
}

export interface Icharges {
    percent: number,
    charge: number,
    name: string
}
