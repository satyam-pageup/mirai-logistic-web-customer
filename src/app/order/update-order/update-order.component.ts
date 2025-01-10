import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateForwardShipment, UpdateOrderForm, UpdateOrderFormData, UpdateProductForm } from '../../shared/models/order.model';
import { ComponentBase } from '../../shared/classes/component-base';
import { Identity } from '../../shared/interface/response/response';
import { IROrderDetailsData } from '../../shared/interface/response/order.response';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.scss'
})
export class UpdateOrderComponent extends ComponentBase implements OnInit {
  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() orderId: string = '';
  public isSubmitting: boolean = false;
  public isCODRequired: boolean = false;
  public updateOrderForm: FormGroup<UpdateOrderForm> = new FormGroup<UpdateOrderForm>({
    id: new FormControl(null),
    forwardShipments: new FormArray([this.forwardShipment()])
  })

  public forwardShipment(): FormGroup<UpdateForwardShipment> {
    return new FormGroup<UpdateForwardShipment>({
      id: new FormControl(null),
      paymentMode: new FormControl(null, [Validators.required]),
      codAmount: new FormControl(null, [Validators.required]),
      products: new FormArray([this.productForm()])
    })
  }

  public productForm(): FormGroup<UpdateProductForm> {
    return new FormGroup<UpdateProductForm>({
      id: new FormControl(null),
      productDescription: new FormControl(null, [Validators.required]),
      hsnCode: new FormControl(null, [Validators.required]),
    })
  }

  constructor() {
    super()
  }

  ngOnInit(): void {

    if (this.orderId) {
      this.getOrderDetails(this.orderId);
    }

    this.updateOrderForm.controls.forwardShipments.at(0).controls.paymentMode.valueChanges.subscribe(value => {
      if (value === 'COD') {
        this.isCODRequired = true;
        this.updateOrderForm.controls.forwardShipments.at(0).controls.codAmount.enable();
        this.updateOrderForm.controls.forwardShipments.at(0).controls.codAmount.setValidators([Validators.required]);
        this.updateOrderForm.controls.forwardShipments.at(0).controls.codAmount.markAsTouched();  // Mark it as touched
      } else {
        this.isCODRequired = false;
        this.updateOrderForm.controls.forwardShipments.at(0).controls.codAmount.disable();
        this.updateOrderForm.controls.forwardShipments.at(0).controls.codAmount.reset();
        this.updateOrderForm.controls.forwardShipments.at(0).controls.codAmount.clearValidators();
      }
      this.updateOrderForm.controls.forwardShipments.at(0).controls.codAmount.updateValueAndValidity();
    });
  }

  private async getOrderDetails(orderId: string) {
    try {
      const res = await this.getAPICallPromise<Identity<IROrderDetailsData>>(
        this.apiRoute.order.singleOrderView(orderId),
        this.headerOption
      );
      if (res?.data) {
        this.updateOrderForm.patchValue(res.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  }


  public confirm() {
    if (this.updateOrderForm.valid) {
      this.postAPICallPromise<UpdateOrderFormData,Identity<number>>(
        this.apiRoute.order.updateOrder,
        this.updateOrderForm.value as UpdateOrderFormData,
        this.headerOption
      ).then(
        (res)=>{
          if(res.data){
            this.EEformValue.emit(true);
            this.toasterService.success("Order Updated Successfully");
          }
        }
      ).catch(
        (err)=>{
          this.toasterService.error(err);
        }
      )
    }
  }

  public decline() {
    this.EEformValue.emit(false);
  }
}
