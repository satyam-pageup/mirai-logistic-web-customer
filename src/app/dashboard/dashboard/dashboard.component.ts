import { Component, OnInit } from '@angular/core';
import { IDashBoardDetails } from '../../shared/interface/response/dashboard.response';
import { ComponentBase } from '../../shared/classes/component-base';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends ComponentBase implements OnInit {
  public dashboardDetails = new IDashBoardDetails();
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.getDashboardDetails();
  }

  private getDashboardDetails() {
    this.getAPICallPromise<Identity<IDashBoardDetails>>(ApiRoutes.getDashboardDetail,this.headerOption).then(
      (res) => {
        if (res.data) {
          this.dashboardDetails = res.data;
          this.loaderService.hideLoader();
        }
        else{
          this.toasterService.error("Error");
          this.loaderService.hideLoader();
        }
      }
    )
  }

}
