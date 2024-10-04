export interface IRequest {
    search: string,
    pageIndex: number,
    top: number,
    showDeactivated: boolean,
    ordersBy: [{
        fieldName:string,
        sort:string
    }],
}
