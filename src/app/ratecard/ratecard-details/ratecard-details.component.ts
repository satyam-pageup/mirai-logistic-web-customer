import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';
import { IB2BTableDetailsRequest } from '../../shared/interface/request/ratecard.request';
import { zoneCombo } from '../../shared/models/zone.model';
import { IB2BListData, RateCard } from '../../shared/interface/response/ratecard.response';
import { Identity } from '../../shared/interface/response/response';

@Component({
  selector: 'app-ratecard-details',
  templateUrl: './ratecard-details.component.html',
  styleUrl: './ratecard-details.component.scss'
})
export class RatecardDetailsComponent extends ComponentBase implements OnInit {
  public isErrorComing: boolean = false;
  public errorMessage: string = '';
  public isSubmitting: boolean = false;
  // public b2bList!: IB2BDetails[];
  public b2bList!: RateCard[];
  public zoneList: zoneCombo[] = [];

  public payload: IB2BTableDetailsRequest = {
    accountType: 'B2B',
    serviceType: 'Surface',
    customerId: this.userDetail.id
  }

  constructor() {
    super();
  }

  async ngOnInit() {
    await this.getZoneList();
    this.getB2bRatecard();
  }

  private getB2bRatecard() {
    this.loaderService.showLoader();
    const subscription = this.postAPICall<IB2BTableDetailsRequest, Identity<IB2BListData>>(this.apiRoute.ratecard.getAllB2bRatecardTable, this.payload, this.headerOption).subscribe({
      next: (res) => {
        if (res?.data) {
          this.isErrorComing = false;
          if (res.data.rateCard.length == 0) {
            this.toasterService.error("Rate not found")
            if (this.b2bList.length !== 0)
              this.b2bList.map(item => item.rate = 0);
          }
          else {
            this.b2bList = res.data.rateCard;
          }
        }
        else {
          this.errorMessage = `Data not found`
          this.isErrorComing = true;
        }
      },
      error: (err) => {
        this.errorMessage = `Data not found`
        this.isErrorComing = true;
      },
      complete: () => {
        this.loaderService.hideLoader();
      }
    })
    this.subscritionsArray.push(subscription);
  }

  private async getZoneList() {
    this.loaderService.showLoader();
    try {

      const res = await this.getAPICallPromise<Identity<zoneCombo[]>>(this.apiRoute.zonecombo, this.headerOption)
      if (res?.data) {
        this.zoneList = res.data
        this.loaderService.hideLoader();
      }
    } catch (error) {
      this.loaderService.hideLoader();
    }
  }

  public getRateForZones(sourceZoneId: number, destinationZoneId: number): number | string {
    if (!this.b2bList) {
      return '0'; // Return 'N/A' if b2bList is not available
    }
    const rateCard = this.b2bList.find(
      (item) => item.sourceZoneId === sourceZoneId && item.destinationZoneId === destinationZoneId
    );
    return rateCard ? rateCard.rate : 'N/A'; // Return 'N/A' if no rate is found
  }

  public onSelectionChange(event: any) {
    if (this.zoneList.length > 0) {
      this.getB2bRatecard();
    }
  }

}
