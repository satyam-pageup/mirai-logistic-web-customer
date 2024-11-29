import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';
import { environment } from '../../../environments/environment.development';
import { IWalletRequest } from '../../shared/interface/request/wallet.request';
import { Customer } from '../../shared/interface/response/auth.response';
import { IResponseWalletLogs, IWalletDetails } from '../../shared/interface/response/wallet.response';
import { debounceTime, map, Subject } from 'rxjs';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaymentService } from '../../shared/services/payment.service';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrl: './wallet-details.component.scss'
})
export class WalletDetailsComponent extends ComponentBase implements OnInit {
  @ViewChild('rechargeWallet') modalTemplate2!: TemplateRef<any>;
  public modelRef?: BsModalRef;
  resolve: any;
  public customerDeatils!: Customer;
  public paymentHistory: IWalletDetails[] = []
  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();
  public searchInput: string = '';
  public totalCustomerCount: number = 0;
  public totalCount: number = 0;
  public isErrorComing: boolean = false;
  public errorMessage: string = '';
  public payload: IWalletRequest = {
    search: "",
    pageIndex: 1,
    top: 10,
    showDeactivated: false,
    ordersBy: [{
      fieldName: "Id",
      sort: "Desc"
    }],
    customerId: null,
    endDate: null,
    startDate: null
  }

  constructor(
    private modalService: BsModalService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.customerDeatils = JSON.parse(localStorage.getItem(environment.customerData)!);
    this.payload.customerId = this.customerDeatils.id;
    this.getPaymentLogs();

    this.userSearchSubject.pipe(
      debounceTime(1000)
    ).subscribe(seaachText => {
      this.onDestroy$.next();
      this.onSearchPayment();
    })
  }

  public getPaymentLogs() {
    this.loaderService.showLoader();
    const datePipe = new DateFormatPipe();
    this.postAPICall<IWalletRequest, Identity<IResponseWalletLogs<IWalletDetails>>>(ApiRoutes.customer.getWalletHistory, this.payload, this.headerOption).pipe(
      map((res) => {
        if (res?.data) {
          res.data.payments = res.data.payments.map(payment => ({
            ...payment,
            queryDate: datePipe.transform(payment.createdTime)
          }))
        }
        return res;
      })
    ).subscribe({
      next: (res) => {
        if (res?.data?.payments) {
          this.isErrorComing = false;
          this.paymentHistory = res.data.payments;
          this.totalCustomerCount = res.data.total;
          this.totalCount = this.totalCustomerCount / this.payload.top;
        }
        else {
          this.isErrorComing = true;
          this.errorMessage = `No Data was found.`
        }
      },
      error: (err) => {
        this.loaderService.hideLoader();
      },
      complete: () => {
        this.loaderService.hideLoader();
      }
    })
  }

  public walletRecharge() {
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-md'
    };
    this.modelRef = this.modalService.show(this.modalTemplate2, config);

  }

  public changeComponent(index: number) {
    if (index == 1) {

    }
    else if (index == 2) {

    }
    else if (index == 3) {

    }
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

  public getFormDataE(data: boolean) {
    if (data) {
      this.modelRef?.hide();
      this.getPaymentLogs();
    }
    else {
      this.modelRef?.hide();
    }
  }

  public onSelectionChange(event: any) {
    this.getPaymentLogs();
  }

  public onSearchPayment() {
    this.payload.search = this.searchInput.trim();
    this.getPaymentLogs();
  }

  public itemPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const index = this.totalCustomerCount / parseInt(target.value)
    this.totalCount = Math.ceil(index)
    this.payload.pageIndex = 1;
    this.payload.top = parseInt(target.value);
    this.getPaymentLogs();
  }

  public pageChanged(event: PageChangedEvent): void {
    this.payload.pageIndex = event.page;
    this.getPaymentLogs();
  }

  override ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
