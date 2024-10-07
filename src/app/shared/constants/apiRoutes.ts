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
    },

    //order
    order: {
        getAllOrders: 'Order/All',
        singleOrderView: (id: string) => `Order/${id}`,
        deleteOrder: (id: string) => `Order/${id}`,
        addOrder: 'Order',
        getOrderByScanner: (scannerCode: string) => `Order/Barcode/${scannerCode}`,

        changeOrderStatus: 'Order/ChangeOrderStatus',
        changeDeliveryType: 'Order/SetDeliveryType',
        getSearchData: (data: string) => `Order/MasterSearch/${data}`,
        addSingleWaybill: 'Order/WaybillBarcode'
    },

    //ratecard
    ratecard: {
        getAllB2bRatecard: 'Ratecard/B2B/All',
        getAllB2bRatecardTable: 'Ratecard/B2B/Table/All',
        addB2bRatecard: 'Ratecard/B2B',
        addB2bRatecardTable: 'Ratecard/B2B/Table',
        deleteB2bRatecard: (id: number) => `Ratecard/B2B/${id}`,

        getAllCharges: 'Ratecard/Charges/All',
        deleteCharges: (id: number) => `Ratecard/Charges/${id}`,
        upsertCharges: 'Ratecard/Charges',

        //Calculate Rate
        getRateWithId: (id: number) => `Ratecard/CalculateRate/${id}`,
        getRate: 'Ratecard/CalculateRate',
        getPincodeDetails: (pincode: number) => `Ratecard/Pincode/${pincode}`,
    },

    //pickup
    pickup: {
        getAllPickup: 'Pickup/All',
        getAllPickupRequest: 'PickupRequest/All',
        addPickupRequest: 'PickupRequest',
        singlePickupView: (id: number) => `Pickup/${id}`,
        deletePickupRequest: (id: number) => `PickupRequest/${id}`,
        singlePickupRequestView: (id: number) => `PickupRequest/${id}`,

        generatePickup: 'Pickup',
    },

    
}