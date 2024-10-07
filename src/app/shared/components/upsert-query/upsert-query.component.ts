import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentBase } from '../../classes/component-base';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { comboResponse, Identity } from '../../interface/response/response';
import { activeModule, queryForm, queryFormData } from '../../models/query-support.model';
import { ApiRoutes } from '../../constants/apiRoutes';
import { IQueryDetails } from '../../interface/response/query-support.response';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-upsert-query',
  templateUrl: './upsert-query.component.html',
  styleUrl: './upsert-query.component.scss'
})
export class UpsertQueryComponent extends ComponentBase implements OnInit {

  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() referenceData!: IQueryDetails;
  @Input() activeModule!: activeModule;
  public queryId: number = 0;
  public customerId: number = 0;
  public isEditCase: boolean = false;
  public isSubmitting: boolean = false;
  public customerList!: comboResponse[];


  public queryForm: FormGroup<queryForm> = new FormGroup<queryForm>({
    id: new FormControl(0),
    customerId: new FormControl(null),
    customerName: new FormControl(''),
    orderId: new FormControl(null),
    pickupId: new FormControl(null),
    question: new FormControl(null, [Validators.required]),
  })

  public config = {
    displayKey: "name",
    search: true,
    height: '500px',
    placeholder: 'Select',
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

  constructor() {
    super();
  }

  ngOnInit(): void {
    const customerData = JSON.parse(localStorage.getItem(environment.customerData)!);
    this.queryForm.controls.customerId.setValue(parseInt(customerData.id));
    this.queryForm.controls.customerName.setValue(customerData.firstName + " " + customerData.lastName);

    console.log(this.queryForm.value)

    // if (this.referenceData.id > 0) {
    //   this.isEditCase = true;
    //   if (this.referenceData.pickupId) {
    //     this.queryForm.controls.pickupId.setValue(parseInt(this.referenceData.pickupId))
    //   }
    //   if (this.referenceData.orderId) {
    //     this.queryForm.controls.orderId.setValue(parseInt(this.referenceData.orderId));
    //   }
    //   this.patchExpenseDetails(this.referenceData)
    // }

    if (this.activeModule?.name == 'pickup') {
      this.queryForm.controls.pickupId.setValue(parseInt(this.activeModule.id!))
    }

    if (this.activeModule?.name == 'order') {
      this.queryForm.controls.orderId.setValue(parseInt(this.activeModule.id!));
    }
  }


  // private patchExpenseDetails(data: IQueryDetails) {
  //   const expense = {
  //     id: data.id,
  //     customerId: data.customerId,
  //     customerName: data.customerName,
  //     orderId: parseInt(data.orderId),
  //     pickupId: parseInt(data.pickupId),
  //     question: data.question
  //   }
  //   this.queryId = data.id
  //   this.queryForm.patchValue(expense);
  //   this.customerId = data.customerId;
  // }

  public confirm() {
    this.queryForm.markAllAsTouched();
    if (this.queryForm.valid) {
      this.isSubmitting = true;
      if (this.isEditCase) {
        const expenceData: queryFormData = {
          id: this.queryId,
          customerId: this.customerId,
          orderId: this.queryForm.controls.orderId.value,
          pickupId: this.queryForm.controls.pickupId.value,
          question: this.queryForm.controls.question.value!,
        }

        this.upsertExpense(expenceData);
      }
      else {
        const expenceData: queryFormData = {
          id: 0,
          customerId: this.customerId,
          orderId: this.queryForm.controls.orderId.value!,
          pickupId: this.queryForm.controls.pickupId.value!,
          question: this.queryForm.controls.question.value!,
        }

        this.upsertExpense(expenceData);
      }
    }
  }

  private upsertExpense(data: queryFormData) {
    this.postAPICallPromise<queryFormData, Identity<boolean>>(ApiRoutes.query.addQuery, data, this.headerOption).then(
      (res) => {
        if (res.data) {
          this.toasterService.success("Query Added Successfully");
          this.queryForm.reset();
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

  public onOptionSelected(event: any) {
    this.customerId = event.value.id;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const datePart = dateString.split('T')[0];
    return datePart;
  }

  public decline() {
    this.EEformValue.emit(false);
  }
}
