export const ApiRoutes = {
    //dashboard
    getDashboardDetail: 'Dashboard/Customer',

    //login
    sendOtp: 'Login/phoneno',
    verifyOtp: 'Login/phoneno/otp',
    
    //customer
    customer: {
        getCustomer: 'Customer',
        updateCustomer: 'Customer/Update',
        registerCustomer: 'Login/RegisterCustomer',
        deleteCustomer: (id: number) => `Customer/${id}`,
        customerById: (id: number) => `Customer/${id}`,
        newCustomerList: 'Customer/NewCustomer',
        customerConfirmation: 'Customer/ConfirmCustomer',
        getCustomerCombo: 'Customer/Combo',
        getCallLogs: 'Customer/CallLogs',

        //Warehouse 
        getWarehouseCombo: 'Customer/WarehouseCombo',
        getWarehouseDetails: (id: number) => `Customer/Warehouse/${id}`,

        //payment history
        getPaymentHistory: 'Customer/PaymentLogs',
        
        //wallet History
        getWalletHistory: 'Customer/WalletPaymentLogs',
    },

    //order
    order: {
        getAllOrders: 'Order/All',
        singleOrderView: (id: string) => `Order/${id}`,
        deleteOrder: (id: string) => `Order/${id}`,
        addOrder: 'Order',
        updateOrder: 'Order/Update',
        addBulkOrder: 'Order/Bulk',
        getOrderByScanner: (scannerCode: string) => `Order/Barcode/${scannerCode}`,
        getSearchData: (data: string) => `Order/MasterSearch/${data}`,

        //cod
        getCodOrderOfCustomer: (customerId: number) => `Order/CODOrders/${customerId}`,
        getPaidCODList: 'Order/CompleteCODReturn',
    },

    //ratecard
    ratecard: {
        getAllB2bRatecardTable: 'Ratecard/B2B/Table/All',
        getRate: 'Ratecard/CalculateRate',
        getPincodeDetails: (pincode: number) => `Ratecard/Pincode/${pincode}`,
    },

    //pickup
    pickup: {
        generatePickup: 'Pickup',
    },

    //query
    query: {
        getQueryDetails: 'Query/All',
        deleteQuery: (id: number) => `Query/${id}`,
        addQuery: 'Query',
        singleQueryView: (id: number) => `Query/${id}`,
    },

    //notification
    notification:{
        getNotification:'Notification',
        readNotification:(id:number)=>`Notification/${id}`
    },

    zonecombo:'Zone/Combo',
    
}