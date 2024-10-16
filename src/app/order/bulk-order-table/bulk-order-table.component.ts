import { Component, OnInit } from '@angular/core';
import { ExcelDataService } from '../../shared/services/excel-data.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { bulkOrderForm, bulkOrderFormData, warehouseForm } from '../../shared/models/bulkOrder.model';
import { ComponentBase } from '../../shared/classes/component-base';
import { IPincodeDetails } from '../../shared/interface/response/pincode.response';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { IRateRequest } from '../../shared/interface/request/rateCalculator.request';
import { Icharges, IRateDetails } from '../../shared/interface/response/rateCalculator.response';
import { Router } from '@angular/router';
import { appRoutes } from '../../shared/constants/appRoutes';

@Component({
  selector: 'app-bulk-order-table',
  templateUrl: './bulk-order-table.component.html',
  styleUrl: './bulk-order-table.component.scss'
})
export class BulkOrderTableComponent extends ComponentBase implements OnInit {
  excelData: any[] = [];
  excelHeaders: any[] = [];
  public shipmentMode: IPincodeDetails[] = [];
  public totalOrderPrice: number = 0; // Initialize totalOrderPrice
  public bulkOrderForm: FormGroup<{ orders: FormArray<FormGroup<bulkOrderForm>> }>;

  constructor(private dataService: ExcelDataService, private router: Router) {
    super();
    this.bulkOrderForm = this.createForm();
  }

  ngOnInit(): void {
    this.excelData = this.dataService.getData();
    this.excelHeaders = this.excelData[0];
    this.excelData = this.excelData.slice(1);

    const structuredData = this.excelData.map((row: any[]) => {
      const obj: any = {};
      this.excelHeaders.forEach((header: string, index: number) => {
        obj[header] = row[index]; // Map each column based on the header
      });
      return obj;
    });

    console.log(structuredData); // The parsed data with headers as keys
    console.log(this.excelData)
    if (this.excelData.length > 0) {
      this.patchFormData(structuredData);

    }
  }

  public onPaymentModeChange(index: number) {
    if (this.bulkOrderForm.controls.orders.at(index).controls.paymentMode.value === 'COD') {
      this.bulkOrderForm.controls.orders.at(index).controls.codAmount.enable();
      this.bulkOrderForm.controls.orders.at(index).controls.codAmount.setValidators([Validators.required]);
      this.bulkOrderForm.controls.orders.at(index).controls.codAmount.markAsTouched();
    }
    else {
      this.bulkOrderForm.controls.orders.at(index).controls.codAmount.disable();
      this.bulkOrderForm.controls.orders.at(index).controls.codAmount.reset();
      this.bulkOrderForm.controls.orders.at(index).controls.codAmount.clearValidators();
    }
    this.bulkOrderForm.controls.orders.at(index).controls.codAmount.updateValueAndValidity();
  }

  private createForm(): FormGroup<{ orders: FormArray<FormGroup<bulkOrderForm>> }> {
    return new FormGroup<{ orders: FormArray<FormGroup<bulkOrderForm>> }>({
      orders: new FormArray<FormGroup<bulkOrderForm>>([])
    });
  }

  private async patchFormData(data: any[]) {
    const ordersArray = this.bulkOrderForm.get('orders') as FormArray;
    ordersArray.clear();

    for (const [index, item] of data.entries()) {
      console.log(item)
      const orderForm = new FormGroup<bulkOrderForm>({
        id: new FormControl<number | null>(0, [Validators.required]), // Placeholder for ID
        warehouseId: new FormControl<number | null>(0, [Validators.required]), // Placeholder for warehouseId
        sourcePincode: new FormControl<string | null>(item['Pincode'], [Validators.required, Validators.pattern(/^\d{6}$/)]), // Use Pincode from data
        totalAmount: new FormControl<number | null>(item['ProductAmount'], [Validators.required]), // ProductAmount from data
        name: new FormControl<string | null>(item['Consignee Name'], [Validators.required]), // Consignee Name from data
        phone: new FormControl<string | null>(item['Phone'], [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]), // Phone from data
        address: new FormControl<string | null>(item['Address'], [Validators.required]), // Address from data
        pincode: new FormControl<string | null>(item['Pincode'], [Validators.required, Validators.pattern(/^\d{6}$/)]), // Pincode from data
        city: new FormControl<string | null>(item['City'], [Validators.required]), // City from data
        state: new FormControl<string | null>(item['State'], [Validators.required]), // State from data
        country: new FormControl<string | null>(item['Country'], [Validators.required]), // Country from data
        addressType: new FormControl<string | null>(item['Address Type'], [Validators.required]), // Address Type from data
        paymentMode: new FormControl<string | null>(item['Payment Mode'], [Validators.required]), // Payment Mode from data
        shipmentMode: new FormControl<string | null>(item['Shipment Mode'], [Validators.required]), // Shipment Mode from data
        toPay: new FormControl<boolean | null>(item['ToPay'] === 'yes', [Validators.required]), // Convert ToPay to boolean
        codAmount: new FormControl<number | null>(item['codAmount'], []), // codAmount from data
        codReturn: new FormControl<boolean | null>(item['codReturn'] === 'yes', [Validators.required]), // If codReturn exists
        productDescription: new FormControl<string | null>(item['Product Description'], [Validators.required]), // Product Description from data
        hsnCode: new FormControl<string | null>(item['HSN Code'] || ''), // HSN Code from data (optional)
        quantity: new FormControl<number | null>(item['quantity'], [Validators.required]), // quantity from data
        weight: new FormControl<number | null>(item['weight'], [Validators.required]), // weight from data
        volumeQuantity: new FormControl<number | null>(item['volumeQuantity'], [Validators.required]), // volumeQuantity from data
        width: new FormControl<number | null>(item['width'], [Validators.required]), // width from data
        length: new FormControl<number | null>(item['length'], [Validators.required]), // length from data
        height: new FormControl<number | null>(item['height'], [Validators.required]), // height from data
        productAmount: new FormControl<number | null>(item['Product Amount'], [Validators.required]), // ProductAmount from data
        invoiceNo: new FormControl<string | null>(item['Invoice No.']), // Invoice No. from data
        invoiceDate: new FormControl<string | null>(item['Invoice Date']), // Invoice Date from data
        warehouse: new FormGroup<warehouseForm>({
          wId: new FormControl<number | null>(0, [Validators.required]), // Placeholder for warehouse ID
          wName: new FormControl<string | null>(item['Warehouse Name'], [Validators.required]), // Warehouse Name from data
          wPhone: new FormControl<string | null>(item['Warehouse Phone No.'], [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]), // Warehouse Phone No. from data
          wAddress: new FormControl<string | null>(item['Warehouse Address'], [Validators.required]), // Warehouse Address from data
          wPincode: new FormControl<string | null>(item['Warehouse Pincode'], [Validators.required, Validators.pattern(/^\d{6}$/)]), // Warehouse Pincode from data
          wCity: new FormControl<string | null>(item['Warehouse City'], [Validators.required]), // Warehouse City from data
          wState: new FormControl<string | null>(item['Warehouse State'], [Validators.required]), // Warehouse State from data
          wCountry: new FormControl<string | null>(item['Warehouse Country'], [Validators.required]), // Warehouse Country from data
          wIsActive: new FormControl<boolean | null>(true, [Validators.required]), // Assume warehouse is active
        }),
      });

      console.log(orderForm)

      if (orderForm.controls.pincode.value) {
        await this.checkShipmentAvailability(orderForm.controls.pincode.value, index); // Assuming this function returns a promise
      }

      if (orderForm.controls.paymentMode.value) {
        if (orderForm.controls.paymentMode.value === 'COD') {
          orderForm.controls.codAmount.enable();
          orderForm.controls.codAmount.setValidators([Validators.required]);
          orderForm.controls.codAmount.markAsTouched();
        }
        else if (orderForm.controls.paymentMode.value == 'Prepaid') {
          orderForm.controls.codAmount.disable();
          orderForm.controls.codAmount.reset();
          orderForm.controls.codAmount.clearValidators();
        }
        else {
          orderForm.controls.paymentMode.setValue(null);
        }
        orderForm.controls.codAmount.updateValueAndValidity()
      }

      if (orderForm.controls.quantity.value && orderForm.controls.weight.value && orderForm.controls.volumeQuantity.value && orderForm.controls.width.value && orderForm.controls.length.value && orderForm.controls.height.value) {
        this.calculateTotalPrice(orderForm.controls)
      }

      console.log(this.shipmentMode)

      ordersArray.push(orderForm);// Add the new order form to the FormArray

    };
  }

  public submitBulkOrder() {
    console.log(this.bulkOrderForm.controls.orders)
    this.bulkOrderForm.markAllAsTouched()
    let array: Array<Object> = []

    if (this.bulkOrderForm.valid) {
      this.loaderService.showLoader();
      this.bulkOrderForm.controls.orders.value.map((res, i) => {
        const data: bulkOrderFormData = {
          address: this.bulkOrderForm.controls.orders.at(i).controls.address.value!,
          addressType: this.bulkOrderForm.controls.orders.at(i).controls.addressType.value!,
          city: this.bulkOrderForm.controls.orders.at(i).controls.city.value!,
          codAmount: this.bulkOrderForm.controls.orders.at(i).controls.codAmount.value!,
          codReturn: this.bulkOrderForm.controls.orders.at(i).controls.codReturn.value!,
          country: this.bulkOrderForm.controls.orders.at(i).controls.country.value!,
          hsnCode: this.bulkOrderForm.controls.orders.at(i).controls.hsnCode.value!,
          id: this.bulkOrderForm.controls.orders.at(i).controls.id.value!,
          name: this.bulkOrderForm.controls.orders.at(i).controls.name.value!,
          paymentMode: this.bulkOrderForm.controls.orders.at(i).controls.paymentMode.value!,
          phone: this.bulkOrderForm.controls.orders.at(i).controls.phone.value?.toString()!,
          pincode: this.bulkOrderForm.controls.orders.at(i).controls.pincode.value?.toString()!,
          productDescription: this.bulkOrderForm.controls.orders.at(i).controls.productDescription.value!,
          quantity: this.bulkOrderForm.controls.orders.at(i).controls.quantity.value!,
          shipmentMode: this.bulkOrderForm.controls.orders.at(i).controls.shipmentMode.value!,
          sourcePincode: this.bulkOrderForm.controls.orders.at(i).controls.sourcePincode.value?.toString()!,
          state: this.bulkOrderForm.controls.orders.at(i).controls.state.value!,
          totalAmount: this.bulkOrderForm.controls.orders.at(i).controls.totalAmount.value!,
          productAmount: this.bulkOrderForm.controls.orders.at(i).controls.productAmount.value!,
          invoiceNo: this.bulkOrderForm.controls.orders.at(i).controls.invoiceNo.value?.toString()!,
          invoiceDate: this.bulkOrderForm.controls.orders.at(i).controls.invoiceDate.value?.toString()!,
          warehouse: {
            address: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wAddress.value!,
            city: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wCity.value!,
            country: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wCountry.value!,
            id: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wId.value!,
            isActive: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wIsActive.value!,
            name: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wName.value!,
            phone: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wPhone.value?.toString()!,
            pincode: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wPincode.value?.toString()!,
            state: this.bulkOrderForm.controls.orders.at(i).controls.warehouse.controls.wState.value!,
          },
          height: this.bulkOrderForm.controls.orders.at(i).controls.height.value!,
          length: this.bulkOrderForm.controls.orders.at(i).controls.length.value!,
          volumeQuantity: this.bulkOrderForm.controls.orders.at(i).controls.volumeQuantity.value!,
          warehouseId: this.bulkOrderForm.controls.orders.at(i).controls.warehouseId.value!,
          weight: this.bulkOrderForm.controls.orders.at(i).controls.weight.value!,
          width: this.bulkOrderForm.controls.orders.at(i).controls.width.value!,
          toPay: this.bulkOrderForm.controls.orders.at(i).controls.toPay.value!,
        }
        array.push(data);
      })
      this.postAPICall<unknown, Identity<{ data: boolean }>>(ApiRoutes.order.addBulkOrder, array, this.headerOption).subscribe({
        next: (res) => {
          if (res?.data) {
            this.toasterService.success("Order Generated Successfully");
            this.router.navigate([appRoutes.order.base])
          }
          else {
            this.toasterService.error(res.errorMessage)
          }
        },
        error: (err) => {
          this.toasterService.error(err);
          this.loaderService.hideLoader();
        },
        complete: () => {
          this.loaderService.hideLoader();
        }
      })
    }
  }

  public onPincodeChange(index: number) {
    if (this.bulkOrderForm.controls.orders.at(index).controls.pincode.valid) {
      const data: { pincode: string } = {
        pincode: this.bulkOrderForm.controls.orders.at(index).controls.pincode.value!
      }
      this.postAPICallPromise<{ pincode: string }, Identity<IPincodeDetails>>(ApiRoutes.ratecard.getPincodeDetails(parseInt(this.bulkOrderForm.controls.orders.at(index).controls.pincode.value!)), data, this.headerOption).then(
        (res) => {
          if (res?.data) {
            console.log("first")
            if (!this.shipmentMode) {
              this.shipmentMode = [];
            }

            this.shipmentMode[index] = res.data;
            console.log(index, this.shipmentMode)
          }
          else {
            console.log("sec")
            this.shipmentMode[index] = {} as IPincodeDetails;;
            this.bulkOrderForm.controls.orders.at(index).controls.shipmentMode.setValue(null);
            console.log(index, this.shipmentMode)
          }
        })
    }
  }

  // Method to check shipment availability
  private async checkShipmentAvailability(pincode: string, index: number) {
    const data: { pincode: string } = {
      pincode: pincode
    }
    try {
      const res = await this.postAPICallPromise<{ pincode: string }, Identity<IPincodeDetails>>(
        ApiRoutes.ratecard.getPincodeDetails(parseInt(pincode)),
        data,
        this.headerOption
      );
      if (!this.shipmentMode) {
        this.shipmentMode = [];
      }
      this.shipmentMode[index] = res.data;
    } catch (error) {
      console.error("Error fetching pincode details:", error);
    }
  }

  private async calculateTotalPrice(orderForm: bulkOrderForm) {
    const data: IRateRequest = {
      destinationPincode: orderForm.pincode.value?.toString()!,
      serviceType: orderForm.shipmentMode.value?.toString()!,
      sourcePincode: orderForm.sourcePincode.value?.toString()!,
      boxInfos: [{
        quantity: orderForm.quantity.value!,
        weight: orderForm.weight.value!,
        volumes: [{
          quantity: orderForm.quantity.value!,
          width: orderForm.width.value!,
          length: orderForm.length.value!,
          height: orderForm.height.value!
        }]
      }]
    }

    try {
      const res = await this.postAPICallPromise<IRateRequest, Identity<IRateDetails<Icharges>>>(
        ApiRoutes.ratecard.getRate,
        data,
        this.headerOption
      );

      if (res?.data) {
        console.log(res.data)
        orderForm.totalAmount.setValue(res.data.totalPrice);
        this.totalOrderPrice += res.data.totalPrice;
      } else {
        this.toasterService.error("Source/ Destination Zone is not valid");
      }
    } catch (err) {
      this.toasterService.error("Something went wrong");
    }
  }


}



