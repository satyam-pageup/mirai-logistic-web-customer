import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICityDetails, IStateDetails } from '../../interface/response/locationService.response';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { ComponentBase } from '../../classes/component-base';
import { Customer } from '../../interface/response/auth.response';
import { googleUpdateForm, googleUpdateFormData } from '../../models/customer.model';
import { Identity } from '../../interface/response/response';
import { ApiRoutes } from '../../constants/apiRoutes';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent extends ComponentBase implements OnInit {
  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() referenceData!: Customer;
  public isEditCase: boolean = false;
  public isSubmitting: boolean = false;
  public customerId: number = 0;

  public states: IStateDetails[] = [];
  public cities: ICityDetails[] = [];

  public registrationFormGroup: FormGroup<googleUpdateForm> = new FormGroup<googleUpdateForm>({
    id: new FormControl(0),
    firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    email: new FormControl('', [Validators.pattern(/[a-zA-Z0-9_\-\.]+@[a-z]+\.[c][o][m]/)]),
    contact: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]),
    address: new FormControl('', [Validators.required]),
  })

  constructor(private locationService: LocationService) {
    super()
  }

  ngOnInit(): void {
    if (this.referenceData.id > 0) {
      this.isEditCase = true;
      this.patchCustomerDetails(this.referenceData);
      if (this.referenceData.state)
        this.getCities(this.referenceData.state)
    }

    console.log(this.referenceData)
    // else {
    //   // this.registrationFormGroup.controls.customerAccountType.disable();
    // }

    this.locationService.getStateDetails().then(
      (res) => {
        this.states = res
      }
    )
  }

  private patchCustomerDetails(data: Customer) {
    const customerData: googleUpdateFormData = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contact: data.contact,
      address: data.address,
      city: data.city,
      pinCode: data.pinCode,
      state: data.state,
    }
    this.customerId = data.id;
    this.registrationFormGroup.patchValue(customerData);
  }

  public confirm() {
    this.registrationFormGroup.markAllAsTouched();
    if (this.registrationFormGroup.valid) {
      this.isSubmitting = true;
      const employeeData: googleUpdateFormData = {
        id: this.customerId,
        firstName: this.registrationFormGroup.controls.firstName.value,
        lastName: this.registrationFormGroup.controls.lastName.value,
        address: this.registrationFormGroup.controls.address.value,
        city: this.registrationFormGroup.controls.city.value,
        contact: this.registrationFormGroup.controls.contact.value,
        email: this.registrationFormGroup.controls.email.value,
        pinCode: this.registrationFormGroup.controls.pinCode.value,
        state: this.registrationFormGroup.controls.state.value,
      }
      this.updateCustomer(employeeData);
    }
  }

  private updateCustomer(data: googleUpdateFormData) {
    this.postAPICallPromise<googleUpdateFormData, Identity<boolean>>(ApiRoutes.customer.updateCustomer, data, this.headerOption).then(
      (res) => {
        if (res.data) {
          this.toasterService.success(this.customerId ? "Customer Updated Successfully" : "Customer Added Successfully");
          this.registrationFormGroup.reset();
          this.isEditCase = false;
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

  public decline() {
    this.EEformValue.emit(false);
  }

  public onStateChange() {
    const state = this.registrationFormGroup.controls.state.value
    if (state) {
      this.getCities(state);
    }
  }

  private getCities(state: string) {
    this.locationService.getCitiesDetails(state).then(
      (res) => {
        this.cities = res
      }
    )
  }
}
