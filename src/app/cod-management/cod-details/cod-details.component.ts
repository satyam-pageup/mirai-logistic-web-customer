import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';
import { ICODResponse } from '../../shared/interface/response/cod.response';
import { comboResponse, Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-cod-details',
  templateUrl: './cod-details.component.html',
  styleUrl: './cod-details.component.scss'
})
export class CodDetailsComponent extends ComponentBase implements OnInit{
  public codList: ICODResponse[] = [];
  public isErrorComing: boolean = false;
  public errorMessage: string = '';
  public customerId: number = 0;
  public customerList: comboResponse[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    const customerData = JSON.parse(localStorage.getItem(environment.customerData)!);
    this.customerId = parseInt(customerData.id);
    this.getCodDetails();
  }

  private getCodDetails() {
    this.loaderService.showLoader();
    this.getAPICallPromise<Identity<ICODResponse[]>>(ApiRoutes.order.getCodOrderOfCustomer(this.customerId), this.headerOption).then(
      (res) => {
        if (res?.data) {
          this.isErrorComing = false;
          this.codList = res.data;
        }
        else {
          this.errorMessage = `Data not found`
          this.isErrorComing = true;
        }
      }
    ).catch(
      (err) => {
        this.toasterService.error(err);
        this.loaderService.hideLoader();
      }
    ).finally(
      () => {
        this.loaderService.hideLoader();
      }
    )
  }
}
