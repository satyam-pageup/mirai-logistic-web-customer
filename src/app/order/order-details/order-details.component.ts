import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IOrderDetails, IResponseOrder } from '../../shared/interface/response/order.response';
import { ComponentBase } from '../../shared/classes/component-base';
import { Identity } from '../../shared/interface/response/response';
import { IOrderDetailsRequest } from '../../shared/interface/request/order.request';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { Messages } from '../../shared/constants/message';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent extends ComponentBase implements OnInit {
  @ViewChild('upsertOrderTemplate') modalTemplate1!: TemplateRef<any>;
  @ViewChild('generatePickupTemplate') modalTemplate2!: TemplateRef<any>;
  public modelRef?: BsModalRef;
  resolve: any;
  public isEditCase: boolean = false;

  public orderList!: IOrderDetails[];
  public isErrorComing: boolean = false;
  public totalCustomerCount: number = 0;
  public totalCount: number = 0;
  public errorMessage: string = '';

  public searchInput: string = '';
  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();
  
  public payload: IOrderDetailsRequest = {
    search: "",
    pageIndex: 1,
    top: 10,
    showDeactivated: false,
    ordersBy: [{
      fieldName: "Id",
      sort: "Desc"
    }],
    orderStatus: null,
    deliveryType: null,
    startDate: null,
    endDate: null,
    customerId: null
  }

  public referenceData: IOrderDetails = {
    id: 0,
    customerId: 0,
    customerName: '',
    orderDate: '',
    orderId: '',
    orderNo: '',
    totalAmount: 0,
    deliveryType: '',
    sourcePincode: '',
    destinationPincode: '',
    sourceCity: '',
    destinationCity: '',
    orderStatus: '',
    isActive: false,
    pickUpCreated: false,
    pickUpDays: 0,
    customerOrderStatus: '',
  };

  constructor( private modalService: BsModalService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    const customerData = JSON.parse(localStorage.getItem(environment.customerData)!);
    this.payload.customerId = parseInt(customerData.id);
    this.getOrderList();
    this.userSearchSubject.pipe(
      debounceTime(500)
    ).subscribe(seaachText => {
      this.onDestroy$.next();
      this.onSearchOrder();
    })
  }

  private getOrderList() {
    this.loaderService.showLoader();
    this.postAPICall<IOrderDetailsRequest, Identity<IResponseOrder<IOrderDetails>>>(ApiRoutes.order.getAllOrders, this.payload, this.headerOption).subscribe({
      next: (res) => {
        if (res?.data) {
          this.isErrorComing = false;
          this.orderList = res.data.orders;
          this.totalCustomerCount = res.data.total;
          this.totalCount = this.totalCustomerCount / this.payload.top;

        }
        else {
          this.errorMessage = `Data not found`
          this.isErrorComing = true;
        }
      },
      error: (err) => {
      },
      complete: () => {
        this.loaderService.hideLoader();
      }
    })
  }

  public onSearchOrder() {
    this.payload.search = this.searchInput.trim();
    this.loaderService.showLoader();
    this.postAPICall<IOrderDetailsRequest, Identity<IResponseOrder<IOrderDetails>>>(ApiRoutes.order.getAllOrders, this.payload, this.headerOption)
    .pipe(
      takeUntil(this.onDestroy$)
    )
    .subscribe({
      next: (res) => {
        if (res?.data) {
          this.orderList = res.data.orders;
          this.totalCustomerCount = res.data.total;
          this.totalCount = this.totalCustomerCount / this.payload.top;
          this.isErrorComing = false;
        }
        else {
          this.errorMessage = `Related to the search input '${this.searchInput}', no employee was found.`
          this.isErrorComing = true;
        }
      },
      error:(err)=>{
        this.toasterService.error(err);
      },
      complete:()=> {
        this.loaderService.hideLoader();
      },
    })
  }

  public onSelectionChange(event: any) {
    this.getOrderList();
  }

  public upsertorder(index:number){
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    if (index == -1) {
      this.isEditCase = false;
      this.referenceData = {
        id: index,
        customerId: 0,
        customerName: '',
        orderDate: '',
        orderId: '',
        orderNo: '',
        totalAmount: 0,
        deliveryType: '',
        sourcePincode: '',
        destinationPincode: '',
        sourceCity: '',
        destinationCity: '',
        orderStatus: '',
        isActive: false,
        pickUpCreated: false,
        pickUpDays: 0,
        customerOrderStatus: '',
      }
      this.modelRef = this.modalService.show(this.modalTemplate1, config);
      return new Promise((resolve) => {
        this.resolve = resolve;
      })
    }
    else {
      this.isEditCase = true;
      this.referenceData = this.orderList[index]
      console.log(this.referenceData)
      this.modelRef = this.modalService.show(this.modalTemplate1, config);
      return new Promise((resolve) => {
        this.resolve = resolve;
      })
    }
  }

  public deleteOrder(isActive: boolean, id: string) {
    this.dialogService.showConfirmationDialog(isActive, Messages.deactivate(isActive ? "deactivate" : "activate", "employee")).then(
      (res) => {
        if (res) {
          this.deleteAPICallPromise<null, Identity<boolean>>(ApiRoutes.order.deleteOrder(id), null, this.headerOption).then(
            (res) => {
              if (res.data == true) {
                this.getOrderList();
                this.toasterService.success(isActive ? "Deactivate Successfully" : "Activated Successfully");
              }
            }
          )
        }
      }
    )
  }

  public generatePickup(index: number) {
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.referenceData = this.orderList[index]
    this.modelRef = this.modalService.show(this.modalTemplate2, config);
  }

  public onSearchInputChange() {
    if (this.searchInput === "") {
      this.userSearchSubject.next(this.searchInput);
    }
    else {
      const trimValue = this.searchInput.trim();
      if (trimValue != "") {
        this.userSearchSubject.next(trimValue);
      }
    }
  }

  public itemPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const index = this.totalCustomerCount / parseInt(target.value)
    this.totalCount = Math.ceil(index)
    this.payload.pageIndex = 1;
    this.payload.top = parseInt(target.value);
    this.getOrderList();
  }

  public pageChanged(event: PageChangedEvent): void {
    this.payload.pageIndex = event.page;
    this.getOrderList();
  }

  public orderView(orderId: string) {
    this.router.navigate([this.appRoute.order.base, this.appRoute.order.summary], { queryParams: { guid: orderId } });
  }


  public getFormDataE(data: any) {
    if (data) {
      this.modelRef?.hide();
      this.getOrderList();
    }
    else {
      this.modelRef?.hide();
    }
  }
}
