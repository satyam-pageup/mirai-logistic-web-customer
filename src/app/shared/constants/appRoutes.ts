import { query } from "@angular/animations";

export const appRoutes = {
    login: "login",
    dashboard: 'dashboard',

    order: {
        base: 'order-list',
        summary:"order-summary",
        bulkOrder:"bulk-order",
    },

    query:{
        base:'query'
    },

    wallet:{
        base:'wallet'
    },

    rateCalculator:{
        base:'rate-calculator'
    },

    cod:{
        base:"/cod",
        paidCod:"cod-returns"
    }
}