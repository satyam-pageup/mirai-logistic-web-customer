import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IDashBoardDetails } from '../../shared/interface/response/dashboard.response';
import { ComponentBase } from '../../shared/classes/component-base';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { LoaderService } from '../../shared/services/loader.service';
import { environment } from '../../../environments/environment.development';
import { Customer } from '../../shared/interface/response/auth.response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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

  private async getDashboardDetails() {
    this.loaderService.showLoader();
    try {
      const res = await this.getAPICallPromise<Identity<IDashBoardDetails>>(ApiRoutes.getDashboardDetail, this.headerOption)
      if (res?.data) {
        this.dashboardDetails = res.data;
        this.loaderService.hideLoader();
      }
    } catch (error) {
      this.loaderService.hideLoader();
    }
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

}
