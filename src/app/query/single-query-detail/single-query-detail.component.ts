import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';
import { ISingleQueryDetail } from '../../shared/interface/response/query-support.response';
import { ActivatedRoute, Router } from '@angular/router';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';

@Component({
  selector: 'app-single-query-detail',
  templateUrl: './single-query-detail.component.html',
  styleUrl: './single-query-detail.component.scss'
})
export class SingleQueryDetailComponent extends ComponentBase implements OnInit{
  @Input() referenceData!: {id:number};
  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  public queryDetail : ISingleQueryDetail = new ISingleQueryDetail();
  public pickupId:number = 0;

  constructor(private router: Router,private route: ActivatedRoute){
    super();
  }
  ngOnInit(): void {
    this.getPickupList();
  }

  private getPickupList() {
    this.getAPICallPromise<Identity<ISingleQueryDetail>>(ApiRoutes.query.singleQueryView(this.referenceData.id), this.headerOption).then(
      (res) => {
        if (res?.data) {
          this.queryDetail = res.data;
        }
      }
    )
  }

  public openOrderDetailPage(orderId:string){
    this.EEformValue.emit(false);
    this.router.navigate(['order/order-summery'],{queryParams:{guid:orderId}});
  }
  public openPickupDetailPage(pickupId:number){
    this.router.navigate([`pickup/pickup-detail/${pickupId}`])
    this.EEformValue.emit(false);
  }

  public decline() {
    this.EEformValue.emit(false);
  }
}
