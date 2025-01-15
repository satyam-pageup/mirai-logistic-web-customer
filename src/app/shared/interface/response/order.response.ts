export interface IOrderDetails {
    id: number;
    customerId: number;
    customerName: string;
    orderDate: string;
    orderId: string;
    orderNo: string;
    totalAmount: number;
    deliveryType: string;
    sourcePincode: string;
    destinationPincode: string;
    sourceCity: string;
    destinationCity: string;
    orderStatus: string;
    isActive: boolean;
    pickUpCreated: boolean;
    pickUpDays: number;
    customerOrderStatus: string;
}

export interface IResponseOrder<T> {
    total: number;
    orders: Array<T>
}

export class IROrderDetailsData {
    id: number = 0;
  orderDate: string = '';
  orderId: string = '';
  orderNo: string = '';
  totalAmount: number = 0;
  deliveryType: string = '';
  orderStatus: string = '';
  customerOrderStatus: string = '';
  sourcePincode: string = '';
  waybillNo: string = '';
  isActive: boolean=false;
  pendingBalance: number = 0;
  isDebit: boolean=false;
  cancelledFromCustomer:boolean=false;
  forwardShipments: ForwardShipment[] = [new ForwardShipment()];
  paymentStatusLogs: PaymentStatusLog[] = [new PaymentStatusLog()];
  pickupRequests: PickupRequest[] = [new PickupRequest()];
  orderStatusLogs: OrderStatusLog[] = [new OrderStatusLog()];
  pickups: Pickup[] = [new Pickup()];
  paymentType: string = '';
  customer: Customer = new Customer();
  warehouse: Warehouse = new Warehouse();
  pickUpCreated: boolean = false;
  pickUpDays: number = 0;
  isReceivedOrder:boolean=false;
  receivedCustomerId:number = 0;
}

export class PickupRequest {
    id: number = 0;
    pickupId: number = 0;
    employeeId: number = 0;
    assignDate: string = '';
    requestStatus: string = '';
    denyMessage: string = '';
    statusChangedBy: string = '';
    isActive: boolean = true;
    employeeName: string = '';
    orderNo: string = '';
    orderGuid: string = '';
    name: string = '';
    address: string = '';
    phone: string = '';
    pincode: string = '';
    wheelerType: string = '';
  }

export class OrderStatusLog {
    id: number = 0;
    orderId: number = 0;
    orderStatus: string = '';
    updatedTime: string = '';
    updatedBy: number = 0;
    statusChangedBy: string = '';
    status: string = '';
  }

export class Warehouse {
    id: number = 0;
    name: string = '';
    phone: string = '';
    address: string = '';
    pincode: string = '';
    city: string = '';
    state: string = '';
    country: string = '';
    isActive: boolean = true;
  }

export class Customer {
    address: string = "";
    city: string = "";
    contact: string = "";
    customerType: string = "";
    email: string = "";
    firstName: string = "";
    id: number = 0;
    isLogin: boolean = false;
    lastName: string = "";
    pinCode: string = "";
    state: string = "";
}

export class OrderStatus {
    id: number = 0;
    orderId: number = 0;
    orderStatus: string = "";
    updatedTime: string = "";
    updatedBy: number = 0;
    statusChangedBy: string = "";
}

export class Pickup {
    id: number = 0;
    orderId: number = 0;
    orderNo: string = '';
    pickupDate: string = '';
    packageCount: number = 0;
    isSelfPickup: boolean = false;
    status: string = '';
    wheelerType: string = '';
    name: string = '';
    phone: string = '';
    pincode: string = '';
    address: string = '';
    city: string = '';
    state: string = '';
}
export interface PickupRequest {
    id: number;
    pickupId: number;
    employeeId: number;
    assignDate: string;
    requestStatus: string;
    denyMessage: string;
    statusChangedBy: string;
    isActive: boolean;
    employeeName: string;
    orderNo: string;
    orderGuid: string;
    name: string;
    address: string;
    phone: string;
    pincode: string;
    wheelerType: string;
  }
export class PaymentStatusLog {
    id: number = 0;
    orderId: number = 0;
    customerId: number = 0;
    dabit: number = 0;
    credit: number = 0;
    createdTime: string = '';
    status: string = '';
    paymentStatus: string = '';
}

export class ForwardShipment {
    id: number = 0;
    name: string = '';
    phone: string = '';
    address: string = '';
    pincode: string = '';
    city: string = '';
    state: string = '';
    country: string = '';
    addressType: string = '';
    paymentMode: string = '';
    shipmentMode: string = '';
    codAmount: number = 0;
    totalAmount: number = 0;
    products: Product[] = [];
    orderCharges: OrderCharge[] = [];
}

export class OrderCharge {
    id: number = 0;
    orderForwardShipmentId: number = 0;
    percent: number = 0;
    charge: number = 0;
    name: string = '';
}

export class Product {
    id: number = 0;
    productDescription: string = '';
    hsnCode: string = '';
    quantity: number = 0;
    waybillNo: string = '';
    weight: number = 0;
    volumes: Volume[] = [];
}

export class Volume {
    id: number = 0;
    quantity: number = 0;
    width: number = 0;
    length: number = 0;
    height: number = 0;
    barcodes: string[] = [];
    isMatchBarcode: boolean = false;
    wayBills: string[] = [];
}

export class VolumeForWaybill extends Volume{
    orderId:number = 0;
    skipWaybill:boolean = false;
}