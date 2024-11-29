import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOrderDetails, IROrderDetailsData } from '../../shared/interface/response/order.response';
import { IPincodeDetails } from '../../shared/interface/response/pincode.response';
import { ICityDetails, IStateDetails } from '../../shared/interface/response/locationService.response';
import { comboResponse, Identity } from '../../shared/interface/response/response';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { orderForm, productForm, shipmentForm, shipmentFormData, volumeForm, warehouseForm, warehouseFormData } from '../../shared/models/order.model';
import { LocationService } from '../../shared/services/location.service';
import { ComponentBase } from '../../shared/classes/component-base';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { IWarehouseResponse } from '../../shared/interface/response/warehouse.response';
import { BoxInfo, IRateRequest, Volume } from '../../shared/interface/request/rateCalculator.request';
import { Icharges, IRateDetails } from '../../shared/interface/response/rateCalculator.response';
import state from '../../shared/jsonFiles/state.json';
import { AuthService } from '../../shared/services/auth.service';
import { Customer } from '../../shared/interface/response/auth.response';
import { PaymentService } from '../../shared/services/payment.service';
import { RazorpayFormData } from '../../shared/models/wallet.model';

@Component({
  selector: 'app-add-manual-order',
  templateUrl: './add-manual-order.component.html',
  styleUrl: './add-manual-order.component.scss'
})
export class AddManualOrderComponent extends ComponentBase implements OnInit {
  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() referenceData!: IOrderDetails;
  public orderDetails: IROrderDetailsData = new IROrderDetailsData();
  public isWarehouseSelected: boolean = false;
  public isCODRequired: boolean = false;
  public loginUserdata!: Customer;

  public remainingQuantity: number = 0;
  public isEditCase: boolean = false;
  public skipBarcodeEntry: boolean = false;
  public customerId: number = 0;
  public warehouseId: number = 0;
  public steps: number = 1;
  public newQuantity: number = 0;
  public isSubmitting: boolean = false;
  public shipmentMode!: IPincodeDetails | null;
  public states: IStateDetails[] = [];
  public shipmentStates: IStateDetails[] = [];
  public cities: ICityDetails[] = [];
  public shipmentCities: ICityDetails[] = [];

  public warehouseList!: comboResponse[];
  public orderForm: FormGroup<orderForm> = new FormGroup<orderForm>({
    id: new FormControl(0),
    customerId: new FormControl(0),
    warehouseId: new FormControl(null),
    paymentType: new FormControl(null, Validators.required),
    sourcePincode: new FormControl(null),
    totalAmount: new FormControl(null),
    forwardShipments: new FormArray([this.shipmentForm()]),
    warehouse: new FormGroup(this.warehouseForm()),
  })

  public warehouse: FormGroup<warehouseForm> = new FormGroup<warehouseForm>({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]),
    address: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
  })

  public warehouseForm(): warehouseForm {
    return {
      id: new FormControl(0),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]),
      address: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      isActive: new FormControl(true),
    };
  }

  public newShipmentForm: FormGroup<shipmentForm> = new FormGroup<shipmentForm>({
    id: new FormControl(0),
    name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]),
    state: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    country: new FormControl('India', [Validators.required]),
    pincode: new FormControl(null, [Validators.required, Validators.pattern(/^\d{6}$/)]),
    addressType: new FormControl(null, [Validators.required]),
    paymentMode: new FormControl(null, [Validators.required]),
    totalAmount: new FormControl(null, [Validators.required]),
    shipmentMode: new FormControl(null, [Validators.required]),
    toPay: new FormControl(false, [Validators.required]),
    codAmount: new FormControl({ value: null, disabled: true }, [Validators.required]),
    products: new FormArray([this.productForm()]),
  })

  public shipmentForm(): FormGroup<shipmentForm> {
    const shipment = new FormGroup<shipmentForm>({
      id: new FormControl(0),
      name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]),
      state: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      country: new FormControl('India', [Validators.required]),
      pincode: new FormControl(null, [Validators.required, Validators.pattern(/^\d{6}$/)]),
      addressType: new FormControl(null, [Validators.required]),
      paymentMode: new FormControl(null, [Validators.required]),
      totalAmount: new FormControl(null, [Validators.required]),
      shipmentMode: new FormControl(null, [Validators.required]),
      toPay: new FormControl(false, [Validators.required]),
      codAmount: new FormControl(null, [Validators.required]),
      products: new FormArray([this.productForm()]),
    })
    return shipment;
  }

  public shipmentFormWithData(shipmentForm: FormGroup<shipmentForm>): FormGroup<shipmentForm> {
    const shipmentData = new FormGroup<shipmentForm>({
      id: new FormControl(shipmentForm.controls.id.value),
      name: new FormControl(shipmentForm.controls.name.value),
      phone: new FormControl(shipmentForm.controls.phone.value),
      state: new FormControl(shipmentForm.controls.state.value),
      city: new FormControl(shipmentForm.controls.city.value),
      address: new FormControl(shipmentForm.controls.address.value),
      country: new FormControl(shipmentForm.controls.country.value),
      pincode: new FormControl(shipmentForm.controls.pincode.value),
      addressType: new FormControl(shipmentForm.controls.addressType.value),
      paymentMode: new FormControl(shipmentForm.controls.paymentMode.value),
      totalAmount: new FormControl(shipmentForm.controls.totalAmount.value),
      shipmentMode: new FormControl(shipmentForm.controls.shipmentMode.value),
      toPay: new FormControl(shipmentForm.controls.toPay.value),
      codAmount: new FormControl(shipmentForm.controls.codAmount.value),
      products: new FormArray(shipmentForm.controls.products.controls),
    });
    return shipmentData
  }

  public productForm(): FormGroup<productForm> {
    const product = new FormGroup<productForm>({
      id: new FormControl(0),
      productDescription: new FormControl(null, [Validators.required]),
      hsnCode: new FormControl(null, [Validators.required]),
      waybillNo: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      weight: new FormControl(null, [Validators.required]),
      productAmount: new FormControl(null, [Validators.required]),
      invoiceNo: new FormControl(null, [Validators.required]),
      invoiceDate: new FormControl(null, [Validators.required]),
      volumes: new FormArray([this.volumeForm()]),
    })
    return product;
  }

  public volumeForm() {
    const volume = new FormGroup<volumeForm>({
      id: new FormControl(0),
      quantity: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      height: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      length: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      width: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      barcodes: new FormArray<FormControl<string | null>>([]),
      wayBills: new FormArray<FormControl<string | null>>([]),
      isMatchBarcode: new FormControl(false),
    });
    return volume
  }

  public config = {
    displayKey: "name",
    search: true,
    height: '500px',
    placeholder: 'Select Warehouse',
    limitTo: 0,
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    searchOnKey: 'name',
    clearOnSelection: false,
    inputDirection: 'ltr',
    selectAllLabel: 'Select all',
    enableSelectAll: false,
  }

  constructor(private locationService: LocationService, private authService: AuthService, private paymentService: PaymentService) {
    super();
    //check online payment is done successfully 
    this.paymentService.paymentStatus.subscribe((status) => {
      if (status) {
        console.log('Payment process completed successfully!');
        this.EEformValue.emit(true);
        this.loaderService.showLoader();
      } else {
        console.log('Payment process failed or cancelled.');
      }
    });
  }

  async ngOnInit() {
    this.loginUserdata = this.authService.loginUserDetail;
    console.log(this.loginUserdata)

    await this.getWarehouseList();
    if (this.referenceData.id > 0) {
      this.isEditCase = true;
      try {
        const res = await this.getAPICallPromise<Identity<IROrderDetailsData>>(
          ApiRoutes.order.singleOrderView(this.referenceData.orderId),
          this.headerOption
        );
        if (res?.data) {
          this.orderDetails = res.data;
          this.customerId = res.data.customer.id;
          this.warehouseId = res.data.warehouse.id;
          this.patchOrderDetails();
          this.onStateChange('warehouse');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
      // this.patchOrderDetails(this.referenceData)
    }
    this.locationService.getStateDetails().then(
      (res) => {
        if (res.status) {
          this.states = res.data
        }
      }
    )

    this.newShipmentForm.controls.pincode.valueChanges.subscribe((value) => {
      if (this.newShipmentForm.controls.pincode.valid) {
        this.shipmentMode = null;
        const data: { pincode: string } = {
          pincode: this.newShipmentForm.controls.pincode.value!
        }
        this.postAPICallPromise<{ pincode: string }, Identity<IPincodeDetails>>(ApiRoutes.ratecard.getPincodeDetails(parseInt(this.newShipmentForm.controls.pincode.value!)), data, this.headerOption).then(
          (res) => {
            this.shipmentMode = res.data
          })
      }
    })

    this.orderForm.controls.forwardShipments.controls.pop();
    this.newShipmentForm.get('paymentMode')?.valueChanges.subscribe(value => {
      if (value === 'COD') {
        this.isCODRequired = true;
        this.newShipmentForm.controls.codAmount.enable();
        this.newShipmentForm.controls.codAmount.setValidators([Validators.required]);
        this.newShipmentForm.controls.codAmount.markAsTouched();  // Mark it as touched

      } else {
        this.isCODRequired = false;
        this.newShipmentForm.controls.codAmount.disable();
        this.newShipmentForm.controls.codAmount.reset();
        this.newShipmentForm.controls.codAmount.clearValidators();
      }
      this.newShipmentForm.controls.codAmount.updateValueAndValidity();

    });

    this.newShipmentForm.controls.products.at(0).controls.quantity.valueChanges.subscribe((res) => {
      this.onVolumeQuantityChange(0, this.newShipmentForm.controls.products.at(0).controls.volumes.length - 1, 0);
    })
  }

  private patchOrderDetails() {
    const warehouseData: warehouseFormData = {
      id: this.orderDetails.warehouse.id,
      name: this.orderDetails.warehouse.name,
      phone: this.orderDetails.warehouse.phone,
      address: this.orderDetails.warehouse.address,
      pincode: this.orderDetails.warehouse.pincode,
      city: this.orderDetails.warehouse.city,
      state: this.orderDetails.warehouse.state,
      country: this.orderDetails.warehouse.country,
      isActive: this.orderDetails.warehouse.isActive,
    }
    const shipmentData: shipmentFormData = {
      id: this.orderDetails.forwardShipments.at(0)?.id!,
      name: this.orderDetails.forwardShipments.at(0)?.name!,
      phone: this.orderDetails.forwardShipments.at(0)?.phone!,
      state: this.orderDetails.forwardShipments.at(0)?.state!,
      city: this.orderDetails.forwardShipments.at(0)?.city!,
      address: this.orderDetails.forwardShipments.at(0)?.address!,
      country: this.orderDetails.forwardShipments.at(0)?.country!,
      pincode: this.orderDetails.forwardShipments.at(0)?.pincode!,
      addressType: this.orderDetails.forwardShipments.at(0)?.addressType!,
      paymentMode: this.orderDetails.forwardShipments.at(0)?.paymentMode!,
      totalAmount: this.orderDetails.forwardShipments.at(0)?.totalAmount!,
      shipmentMode: this.orderDetails.forwardShipments.at(0)?.shipmentMode!,
      codAmount: this.orderDetails.forwardShipments.at(0)?.codAmount!,
      products: this.orderDetails.forwardShipments.at(0)?.products!,
    }
    let volumeFormLength = this.orderDetails.forwardShipments.at(0)?.products.at(0)?.volumes.length;
    if (volumeFormLength != 0) {
      while (volumeFormLength != 1) {
        this.newShipmentForm.controls.products.at(0).controls.volumes.push(this.volumeForm());
        volumeFormLength!--;
      }
    }
    this.orderForm.controls.id.setValue(this.orderDetails.id)
    this.orderForm.controls.paymentType.setValue(this.orderDetails.paymentType);
    this.newShipmentForm.patchValue(shipmentData);
    this.warehouse.patchValue(warehouseData);
    // this.warehouse.disable({ emitEvent: false });


    if (this.newShipmentForm.controls.pincode.valid) {
      this.shipmentMode = null;
      const data: { pincode: string } = {
        pincode: this.newShipmentForm.controls.pincode.value!
      }
      this.postAPICallPromise<{ pincode: string }, Identity<IPincodeDetails>>(ApiRoutes.ratecard.getPincodeDetails(parseInt(this.newShipmentForm.controls.pincode.value!)), data, this.headerOption).then(
        (res) => {
          this.shipmentMode = res.data
        })
    }

    if (this.newShipmentForm.controls.products.at(0).controls.quantity.value == 0) {
      this.newShipmentForm.controls.products.at(0).controls.quantity.setValue(null);
    }
  }

  private async getWarehouseList() {
    try {
      const res = await this.getAPICallPromise<Identity<comboResponse[]>>(
        ApiRoutes.customer.getWarehouseCombo,
        this.headerOption
      );
      if (res?.data) {
        this.warehouseList = res.data;
      }
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  }


  public onStateChange(type: string) {
    if (type == "warehouse") {
      this.cities = [];
      let state = this.warehouse.controls.state.value!;
      if (state) {
        this.locationService.getCitiesDetails(state).then(
          (res) => {
            if (res.status) {
              this.cities = res.data
            }
          }
        )
      }
    }
    else if (type == 'shipment') {
      this.shipmentCities = [];
      let state = this.newShipmentForm.controls.state.value!;
      if (state) {
        this.locationService.getCitiesDetails(state).then(
          (res) => {
            if (res.status) {
              this.shipmentCities = res.data
            }
          }
        )
      }
    }
  }

  public onOptionSelected(event: any) {
    const selectedOption = event.value;
    this.warehouseId = event.value.id;
    this.isWarehouseSelected = true;
    if (selectedOption.id) {
      this.getAPICallPromise<Identity<IWarehouseResponse>>(ApiRoutes.customer.getWarehouseDetails(selectedOption.id), this.headerOption).then(
        (res) => {
          if (res?.data) {
            this.patchWarehouseDetails(res.data)
            this.onStateChange('warehouse')
          }
        }
      )
    }
    else {
      this.warehouse.enable()
      this.warehouse.reset();
      this.warehouseId = 0;
      this.isWarehouseSelected = false;
    }
  }

  public next() {
    if (this.steps === 1) {
      this.warehouse.markAllAsTouched();
      if (this.warehouse.valid) {
        if (this.warehouseId === 0) {
          const warehouseData: warehouseFormData = {
            id: 0,
            name: this.warehouse.controls.name.value!,
            phone: this.warehouse.controls.phone.value!,
            address: this.warehouse.controls.address.value!,
            pincode: this.warehouse.controls.pincode.value!,
            city: this.warehouse.controls.city.value!,
            state: this.warehouse.controls.state.value!,
            country: this.warehouse.controls.country.value!,
            isActive: true,
          }
          // this.warehouse.patchValue(warehouseData);

          this.orderForm.controls.warehouse.patchValue(warehouseData)
        }
        else {
          this.orderForm.controls.warehouseId.setValue(this.warehouseId);
          this.orderForm.controls.warehouse.controls.id.setValue(this.warehouseId);
        }
        this.orderForm.controls.sourcePincode.setValue(this.warehouse.controls.pincode.value);
        console.log(this.orderForm.value)
        this.steps++;
      }
    }
    else if (this.steps === 2) {
      this.newShipmentForm.markAllAsTouched();
      if (this.newShipmentForm.controls.pincode.valid && this.newShipmentForm.controls.shipmentMode.valid) {
        this.steps++;
        this.newShipmentForm.markAsUntouched()
      }
      if (this.isEditCase && this.orderDetails.forwardShipments.at(0)?.products.at(0)?.volumes.length !== 0) {
        this.onVolumeQuantityChange(0, this.newShipmentForm.controls.products.at(0).controls.volumes.length - 1, 0);
      }
    }
    else if (this.steps === 3) {
      // this.newShipmentForm.controls.products.markAllAsTouched()
      // if(this.newShipmentForm.controls.products.at(0).controls.volumes.at(0).controls.barcodes.length == 0){
      //   console.log(this.newShipmentForm.controls.products.at(0).controls.volumes.value)
      //   this.updateBarcodesFormArray(this.newShipmentForm.controls.products.at(0).controls.volumes);
      // }
      if (this.remainingQuantity == 0) {
        this.steps++;
        // if (this.isEditCase) {
        //   this.onVolumeQuantityChange(0, this.newShipmentForm.controls.products.at(0).controls.volumes.length - 1, 0);
        // }
      }
    }
    else if (this.steps === 4) {
      this.newShipmentForm.controls.products.at(0).controls.volumes.markAllAsTouched()
      if (this.newShipmentForm.controls.products.at(0).controls.volumes.length == 0) {
        this.newShipmentForm.controls.products.at(0).controls.volumes.controls.pop();
        this.calculatePrice();
      }
      else {
        if (this.newShipmentForm.controls.products.at(0).controls.volumes.at(0).controls.barcodes.valid) {
          if (this.remainingQuantity == 0) {
            this.calculatePrice();
          }
        }
      }
    }
    else if (this.steps === 5) {
      this.removeBarcodeValidation(this.newShipmentForm.controls.products.at(0).controls.volumes);
      this.isSubmitting = true;
      console.log(this.orderForm.controls.paymentType.value)
      if (this.orderForm.controls.paymentType.valid && this.orderForm.controls.totalAmount.value !== 0) {
        this.loaderService.showLoader();
        if (this.orderForm.controls.paymentType.value == "OnlinePayment") {
          console.log(this.orderForm.controls.paymentType.value)
          const data: RazorpayFormData = {
            amount: this.orderForm.controls.totalAmount.value!,
            from: 'Order',
            orderData: this.orderForm.value
          }
          console.log(data)
          this.paymentService.createRzpayOrder(data);
        }
        else {
          console.log("else")
          this.postAPICall<unknown, Identity<{ data: boolean }>>(ApiRoutes.order.addOrder, this.orderForm.value, this.headerOption).subscribe({
            next: (res) => {
              if (res?.data) {
                this.toasterService.success("Order Generated Successfully");
                this.EEformValue.emit(true);
                this.loaderService.hideLoader();
              }
              else {
                this.toasterService.error(res.errorMessage)
                this.loaderService.hideLoader();
              }
            },
            error: (err) => {
              this.toasterService.error(err);
              this.isSubmitting = false;
            },
            complete: () => {
              this.isSubmitting = false;
            }
          })
        }

      }
    }
  }

  public onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedDate = new Date(input.value);
    const today = new Date();

    // Compare selected date with today's date
    if (selectedDate > today) {
      // Reset the input field if the date is in the future
      input.value = '';
      this.toasterService.error('Future dates are not allowed. Please select a valid date.');
    }
  }

  public skipBarcodes() {
    if (this.newShipmentForm.controls.products.at(0).controls.quantity.value == 0) {
      this.newShipmentForm.controls.products.at(0).controls.volumes.controls.pop();
    }
    this.removeBarcodeValidation(this.newShipmentForm.controls.products.at(0).controls.volumes);
    this.calculatePrice();
    this.skipBarcodeEntry = true;
  }

  private calculatePrice() {
    const data: IRateRequest = {
      destinationPincode: this.newShipmentForm.controls.pincode.value!,
      serviceType: this.newShipmentForm.controls.shipmentMode.value!,
      sourcePincode: this.orderForm.controls.sourcePincode.value!,
      boxInfos: this.boxInfo()
    }
    if (this.productDetailsValidation()) {
      this.postAPICallPromise<IRateRequest, Identity<IRateDetails<Icharges>>>(ApiRoutes.ratecard.getRate, data, this.headerOption).then(
        (res) => {
          if (res?.data) {
            this.orderForm.controls.totalAmount.setValue(Math.round(res.data.totalPrice));
            this.newShipmentForm.controls.totalAmount.setValue(Math.round(res.data.totalPrice));
            if (this.orderForm.controls.forwardShipments.length == 1) {
              this.orderForm.controls.forwardShipments.controls.pop();
            }
            this.orderForm.controls.forwardShipments.push(this.shipmentFormWithData(this.newShipmentForm))
            this.steps++;
          }
          else {
            this.toasterService.error("Source/ Destination Zone is not valid")
          }
        }
      )
        .catch(
          (err) => {
            this.toasterService.error("Something went wrong")
          }
        )
    }
  }

  private boxInfo() {
    let boxInfoDetails: BoxInfo[] = []
    this.newShipmentForm.controls.products.controls.forEach((res, i) => {
      const data: BoxInfo = {
        quantity: res.controls.quantity.value!,
        weight: res.controls.weight.value!,
        volumes: this.getVolume(i)
      }
      boxInfoDetails.push(data);
    })
    return boxInfoDetails;
  }

  private getVolume(index: number) {
    const obj: Array<Volume> = []
    this.newShipmentForm.controls.products.controls.at(index)?.controls.volumes.controls.forEach((res) => {
      const newObj: Volume = {
        quantity: res.controls.quantity.value!,
        width: res.controls.width.value!,
        length: res.controls.length.value!,
        height: res.controls.height.value!
      }
      obj.push(newObj);
    });
    return obj;
  }

  private productDetailsValidation() {
    return this.newShipmentForm.controls.products.controls.map((res, i) => {
      this.newShipmentForm.controls.products.at(i).controls.hsnCode && this.newShipmentForm.controls.products.at(i).controls.quantity && this.newShipmentForm.controls.products.at(i).controls.waybillNo && this.newShipmentForm.controls.products.at(i).controls.weight && this.newShipmentForm.controls.products.at(i).controls.quantity && this.newShipmentForm.controls.products.at(i).controls.productDescription && this.newShipmentForm.controls.products.at(i).controls.volumes.valid
    })
  }

  public prev() {
    if (this.steps > 1)
      this.steps--;

    if (this.steps == 4) {
      this.onVolumeQuantityChange(0, this.newShipmentForm.controls.products.at(0).controls.volumes.length - 1, 0);
      this.skipBarcodeEntry = false;
    }
  }

  public addNewProduct() {
    this.newShipmentForm.controls.products.push(this.productForm());
  }

  //todo
  public onVolumeQuantityChange(pIndex: number, vIndex: number, check: number) {
    this.newQuantity = 0;
    let inputValue;
    if (vIndex === -1 && this.remainingQuantity == 0) {
      vIndex = this.newShipmentForm.controls.products.at(pIndex).controls.volumes.length - 1;
      inputValue = this.newShipmentForm.controls.products.at(pIndex)?.controls.volumes.at(vIndex).controls.quantity.value!
    }
    else if (vIndex === -1 && this.remainingQuantity != 0) {
      vIndex = 0;
      if (this.newShipmentForm.controls.products.at(pIndex).controls.volumes.length >= 2) {
        inputValue = this.newShipmentForm.controls.products.at(pIndex)?.controls.volumes.at(vIndex).controls.quantity.value!
      }
      else {
        inputValue = 0;
      }
    }
    else {
      inputValue = this.newShipmentForm.controls.products.at(pIndex)?.controls.volumes.at(vIndex).controls.quantity.value
    }

    const totalQuantity = this.newShipmentForm.controls.products.at(pIndex)?.controls.quantity.value!;
    //check == -1 -> case of remove
    //check == 0 -> form input field
    if (check == 0) {
      for (let i = 0; i < this.newShipmentForm.controls.products.at(pIndex).controls.volumes.length; i++) {
        if (this.newShipmentForm.controls.products.at(pIndex).controls.volumes.controls.at(i)?.controls.quantity.value != null)
          this.newQuantity += parseInt(this.newShipmentForm.controls.products.at(pIndex).controls.volumes.controls.at(i)?.controls.quantity.value + "");
      }
    }
    else {
      if (this.remainingQuantity == 0) {
        for (let i = 0; i < this.newShipmentForm.controls.products.at(pIndex).controls.volumes.length; i++) {
          this.newQuantity += parseInt(this.newShipmentForm.controls.products.at(pIndex).controls.volumes.controls.at(i)?.controls.quantity.value + "");
        }
      }
      else {
        for (let i = 0; i < this.newShipmentForm.controls.products.at(pIndex).controls.volumes.length - 1; i++) {
          this.newQuantity += parseInt(this.newShipmentForm.controls.products.at(pIndex).controls.volumes.controls.at(i)?.controls.quantity.value + "");
        }
      }
    }
    if (totalQuantity >= this.newQuantity) {
      if (check == 0 && inputValue != 0 && inputValue != null && totalQuantity > this.newQuantity) {
        this.newShipmentForm.controls.products.at(pIndex).controls.volumes.push(this.volumeForm())
      }
      else if (check == -1 && this.remainingQuantity == 0 && totalQuantity > this.newQuantity) {
        this.newShipmentForm.controls.products.at(pIndex).controls.volumes.push(this.volumeForm())
      }
    }
    this.remainingQuantity = totalQuantity - this.newQuantity;

    if (this.remainingQuantity == 0) {
      this.updateBarcodesFormArray(this.newShipmentForm.controls.products.at(0).controls.volumes);
    }
  }

  public remove(pIndex: number, vIndex: number) {
    if (this.remainingQuantity != 0 && vIndex != this.newShipmentForm.controls.products.at(pIndex).controls.volumes.length - 1) {
      this.newShipmentForm.controls.products.at(pIndex).controls.volumes.controls.splice(vIndex, 1);
      this.onVolumeQuantityChange(pIndex, vIndex - 1, -1)
    }
    else if (this.remainingQuantity == 0 && this.newShipmentForm.controls.products.at(pIndex).controls.volumes.length > 0) {
      this.newShipmentForm.controls.products.at(pIndex).controls.volumes.controls.splice(vIndex, 1);
      this.onVolumeQuantityChange(pIndex, vIndex - 1, -1)
    }
    // else if(this.remainingQuantity ==0){
    //   this.newShipmentForm.controls.products.at(pIndex).controls.volumes.at(vIndex).reset();
    // }
  }

  private patchWarehouseDetails(data: IWarehouseResponse) {
    const warehouse: IWarehouseResponse = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      country: data.country,
      isActive: data.isActive,
    }
    this.warehouseId = data.id;
    this.warehouse.patchValue(warehouse);
    // this.warehouse.disable({ emitEvent: false });
  }

  private updateBarcodesFormArray(volumeArray: FormArray) {
    volumeArray.controls.forEach((volumeGroup, index) => {
      const quantity = volumeGroup.get('quantity')?.value;
      const barcodesArray = volumeGroup.get('barcodes') as FormArray;

      barcodesArray.clear();

      for (let i = 0; i < quantity; i++) {
        barcodesArray.push(new FormControl('', Validators.required));
      }
    })
  }

  private removeBarcodeValidation(volumeArray: FormArray) {
    volumeArray.controls.forEach((volumeGroup, index) => {
      const quantity = volumeGroup.get('quantity')?.value;
      const barcodesArray = volumeGroup.get('barcodes') as FormArray;

      barcodesArray.controls.forEach((barcodeControl) => {
        barcodeControl.setValidators(null); // Remove all validators
        barcodeControl.updateValueAndValidity(); // Update the control's validity
      });

      if (this.skipBarcodeEntry) {
        barcodesArray.clear();
        for (let i = 0; i < quantity; i++) {
          barcodesArray.controls.pop();
        }
      }
    })

  }

  public onPincodeChange(type: string) {
    if (this.steps == 1 && type == 'warehouse') {
      const pincode = this.warehouse.controls.pincode.value;
      if (pincode && this.warehouse.controls.pincode.valid) {
        this.locationService.getDetailsUsingPincode(pincode).then(
          (res) => {
            if (res[0].Status == "Success") {
              console.log("Status")
              this.states = res[0].PostOffice
                .map((x: { State: string }) => ({
                  name: x.State,
                  iso2: this.getStateAbbreviation(x.State),
                }))
                .filter((value: IStateDetails, index: number, self: IStateDetails[]) =>
                  index === self.findIndex((t) => t.name === value.name)
                );
              const StateName = this.getStateAbbreviation(res[0].PostOffice[0].State);
              const fullCityName = res[0].PostOffice[0].District;

              this.warehouse.controls.state.setValue(StateName);
              this.warehouse.controls.city.setValue(fullCityName);
              this.onStateChange(type);
            }
            else {
              this.toasterService.error("Invalid Pincode")
            }
          }
        )
      }
    }
    else if (this.steps == 2 && type == 'shipment') {
      const pincode = this.newShipmentForm.controls.pincode.value;
      if (pincode && this.newShipmentForm.controls.pincode.valid) {
        this.locationService.getDetailsUsingPincode(pincode).then(
          (res) => {
            if (res[0].Status == "Success") {
              console.log("Status")
              this.shipmentStates = res[0].PostOffice
                .map((x: { State: string }) => ({
                  name: x.State,
                  iso2: this.getStateAbbreviation(x.State),
                }))
                .filter((value: IStateDetails, index: number, self: IStateDetails[]) =>
                  index === self.findIndex((t) => t.name === value.name)
                );
              const StateName = this.getStateAbbreviation(res[0].PostOffice[0].State);
              const fullCityName = res[0].PostOffice[0].District;

              this.newShipmentForm.controls.state.setValue(StateName);
              this.newShipmentForm.controls.city.setValue(fullCityName);
              this.onStateChange(type);
            }
            else {
              this.toasterService.error("Invalid Pincode")
            }
          }
        )
      }
    }

  }

  private getStateAbbreviation(stateName: string): string {
    const stateObj: { [key: string]: string } = state;
    return stateObj[stateName];
  }

  public decline() {
    this.EEformValue.emit(false);
  }

}

