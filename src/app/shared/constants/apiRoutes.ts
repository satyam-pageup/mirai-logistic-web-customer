export const ApiRoutes = {
    //dashboard
    getDashboardDetail: 'Dashboard',

    //login
    sendOtp:'Login/phoneno',
    verifyOtp:'Login/phoneno/otp',

    //customer
    customer: {
        getCustomer: 'Customer',
        registerCustomer: 'Login/RegisterCustomer',
        deleteCustomer: (id: number) => `Customer/${id}`,
        customerById: (id: number) => `Customer/${id}`,
        newCustomerList: 'Customer/NewCustomer',
        customerConfirmation: 'Customer/ConfirmCustomer',
        getCustomerCombo: 'Customer/Combo',
        getCallLogs: 'Customer/CallLogs',

        //Warehouse 
        getWarehouseDetails: (id: number) => `Customer/CustomersWarehouse/${id}`,

        //payment history
        getPaymentHistory: 'Customer/PaymentLogs',
    },
}