import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IROrderDetailsData, VolumeForWaybill } from '../../shared/interface/response/order.response';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../shared/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { comboResponse, Identity } from '../../shared/interface/response/response';
import { activeModule } from '../../shared/models/query.model';
import { ComponentBase } from '../../shared/classes/component-base';
import { ApiRoutes } from '../../shared/constants/apiRoutes';

@Component({
  selector: 'app-single-order-view',
  templateUrl: './single-order-view.component.html',
  styleUrl: './single-order-view.component.scss'
})
export class SingleOrderViewComponent extends ComponentBase implements OnInit {
  @ViewChild('template1') modalTemplate1!: TemplateRef<any>;
  @ViewChild('generatePickupTemplate') modalTemplate2!: TemplateRef<any>;
  public modelRef?: BsModalRef;
  resolve: any;
  public orderId: string = '';
  public scanId: string = '';
  public orderDeliveryChange: string = '';
  public orderDetails: IROrderDetailsData = new IROrderDetailsData();
  public activeModule: activeModule = {
    name: '',
    id: ''
  }
  public referenceData: {orderId:number,packageCount:number} = {
    orderId:0,
    packageCount:0
  };

  constructor(private modalService: BsModalService, private route: ActivatedRoute, private loadingService: LoaderService) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['guid'];
      this.scanId = params['scanCode'];
      if (this.orderId) {
        this.getOrderSummary();
      }
      else {
        this.getOrderDetailByScanner();
      }
    })
  }

  private getOrderSummary() {
    this.loadingService.showLoader();
    this.getAPICallPromise<Identity<IROrderDetailsData>>(ApiRoutes.order.singleOrderView(this.orderId), this.headerOption).then(
      (res) => {
        if (res?.data) {
          this.orderDetails = res.data;
          this.referenceData.orderId=res.data.id;
          this.referenceData.packageCount=res.data.forwardShipments.at(0)?.products.at(0)?.quantity!;
        }
      }
    ).catch((err) => {
      this.toasterService.error(err);
    }).finally(() => {
      this.loadingService.hideLoader();
    })
  }

  private getOrderDetailByScanner() {
    this.loadingService.showLoader();
    this.getAPICallPromise<Identity<IROrderDetailsData>>(ApiRoutes.order.getOrderByScanner(this.scanId), this.headerOption).then(
      (res) => {
        if (res?.data) {
          this.orderDetails = res.data
        }
      }
    ).catch((err) => {
      this.toasterService.error(err);
    }).finally(() => {
      this.loadingService.hideLoader();
    })
  }



  public getFormDataE(data: boolean) {
    if (data) {
      this.modelRef?.hide();
      this.getOrderSummary();
    }
    else {
      this.modelRef?.hide();
    }
  }

  public addQuery(id: string) {
    this.activeModule = {
      name: 'order',
      id: id
    }
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.modelRef = this.modalService.show(this.modalTemplate1, config);
  }

  public generatePickup() {
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.modelRef = this.modalService.show(this.modalTemplate2, config);
  }

}
