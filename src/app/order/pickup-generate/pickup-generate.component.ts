import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';
import { IOrderDetails } from '../../shared/interface/response/order.response';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pickupGenerateForm, pickupGenerateFormData } from '../../shared/models/pickup.model';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';

@Component({
  selector: 'app-pickup-generate',
  templateUrl: './pickup-generate.component.html',
  styleUrl: './pickup-generate.component.scss'
})
export class PickupGenerateComponent extends ComponentBase implements OnInit{
  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() referenceData!: {orderId:number,packageCount:number};
  public isSubmitting: boolean = false;

  public pickupForm: FormGroup<pickupGenerateForm> = new FormGroup<pickupGenerateForm>({
    id: new FormControl(0),
    orderId: new FormControl(null),
    pickupDate: new FormControl(null, [Validators.required]),
    packageCount: new FormControl(null),
    isSelfPickup: new FormControl(false),
    wheelerType: new FormControl(null, [Validators.required]),
  })

  constructor() {
    super();
  }

  ngOnInit(): void {
    
  }

  public confirm() {
    if (this.pickupForm.valid) {
      this.isSubmitting = true;
      const data: pickupGenerateFormData = {
        id: 0,
        orderId: this.referenceData.orderId,
        pickupDate: this.pickupForm.controls.pickupDate.value!,
        packageCount: this.referenceData.packageCount,
        isSelfPickup: false,
        wheelerType: this.pickupForm.controls.wheelerType.value!,
      }

      this.postAPICallPromise<pickupGenerateFormData, Identity<boolean>>(ApiRoutes.pickup.generatePickup, data, this.headerOption).then(
        (res) => {
          if (res.data) {
            this.toasterService.success("Pickup Generated Successfully");
            this.pickupForm.reset();
            this.EEformValue.emit(true);
          }
          else {
            this.toasterService.error(res.errorMessage)
          }
          this.isSubmitting = false;
        }
      ).catch(() => {
        this.isSubmitting = false;
      })
    }
  }

  public decline() {
    this.EEformValue.emit(false);
  }
}
