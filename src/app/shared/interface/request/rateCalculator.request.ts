

export interface IRateRequest {
    sourcePincode: string;
    destinationPincode: string;
    serviceType: string;
    boxInfos: BoxInfo[];
  }
  
  export interface BoxInfo {
    quantity: number;
    weight: number;
    volumes: Volume[];
  }
  
  export interface Volume {
    quantity: number;
    length: number;
    width: number;
    height: number;
  }