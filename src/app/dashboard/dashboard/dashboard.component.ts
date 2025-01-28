import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IDashBoardDetails } from '../../shared/interface/response/dashboard.response';
import { ComponentBase } from '../../shared/classes/component-base';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { environment } from '../../../environments/environment.development';
import { Customer } from '../../shared/interface/response/auth.response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DashboardRequest } from '../../shared/interface/request/dashboard.request';
import { EmitDate } from '../../shared/models/dateRangePicker.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends ComponentBase implements OnInit {
  @ViewChild('updateOrderTemplate') modalTemplate1!: TemplateRef<any>;
  public modelRef?: BsModalRef;
  resolve: any;
  public dashboardDetails = new IDashBoardDetails();
  public customerData!: Customer;
  public payload: DashboardRequest = {
    startDate: this.getFormattedDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    endDate: this.getFormattedDate(new Date())
  }
  constructor(private modalService: BsModalService) {
    super();
  }

  async ngOnInit() {
    await this.getDashboardDetails();
    this.customerData = JSON.parse(localStorage.getItem(environment.customerData)!)
    if (this.customerData.id > 0 && this.checkCustomerProfileUpdated()) {
      this.toasterService.info("Update info")
      console.log(this.customerData)
      this.updateProfile();
    }
  }

  private checkCustomerProfileUpdated() {
    return (this.customerData.city.length == 0 && this.customerData.state.length == 0 && this.customerData.pinCode.length == 0)
  }

  // private async getDashboardDetails() {
  //   this.loaderService.showLoader();
  //   const res = await this.postAPICall<DashboardRequest, Identity<IDashBoardDetails>>(ApiRoutes.getDashboardDetail, this.payload, this.headerOption).subscribe({
  //     next: (res) => {
  //       if (res?.data) {
  //         this.dashboardDetails = res.data;
  //         this.loaderService.hideLoader();
  //       }
  //     },
  //     error: (err) => {
  //       this.loaderService.hideLoader();
  //     }
  //   })
  // }

  private async getDashboardDetails() {
    this.loaderService.showLoader();
    const res = await this.getAPICall<Identity<IDashBoardDetails>>(ApiRoutes.getDashboardDetail, this.headerOption).subscribe({
      next: (res) => {
        if (res?.data) {
          this.dashboardDetails = res.data;
          this.loaderService.hideLoader();
        }
      },
      error: (err) => {
        this.loaderService.hideLoader();
      }
    })

  }

  public getFormDataE(data: boolean) {
    if (data) {
      this.modelRef?.hide();
      this.resolve(true);
      // this.getCustomerList();
    }
    else {
      this.modelRef?.hide();
      this.resolve(false);
    }
  }

  private updateProfile() {
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.modelRef = this.modalService.show(this.modalTemplate1, config);
  }

  private getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  }


  // public datePicker(event: EmitDate) {
  //   console.log(event)
  //   this.payload.startDate = event.startDate;
  //   this.payload.endDate = event.endDate;
  //   this.getDashboardDetails();
  // }

}
