import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Identity } from '../../shared/interface/response/response';
import { ICODResponse, IResponseC } from '../../shared/interface/response/cod.response';
import { ActivatedRoute } from '@angular/router';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { IPaidCODRequest } from '../../shared/interface/request/cod.request';

@Component({
  selector: 'app-paid-cod-list',
  templateUrl: './paid-cod-list.component.html',
  styleUrl: './paid-cod-list.component.scss'
})
export class PaidCodListComponent extends ComponentBase implements OnInit {

  public paidCODList: ICODResponse[] = [];
  public isFormCustomerViewPage: boolean = false;
  public errorMessage: string = '';
  public isErrorComing: boolean = false;
  public payload: IPaidCODRequest = {
    search: "",
    pageIndex: 1,
    top: 10,
    showDeactivated: false,
    ordersBy: [{
      fieldName: "Id",
      sort: "Desc"
    }],
    customerId: null,
  }
  public totalCustomerCount: number = 0;
  public totalCount: number = 0;
  public searchInput: string = '';
  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();
  public config = {
    displayKey: "name",
    search: true,
    height: '450px',
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


  constructor(private router: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {

    this.router.queryParams.subscribe(params => {
      const customerId = params['customerId'];
      if (customerId) {
        this.payload.customerId = parseInt(customerId);
        this.isFormCustomerViewPage = true;
      }
    })
    this.getPaidCODList();

    this.userSearchSubject.pipe(
      debounceTime(500)
    ).subscribe(seaachText => {
      this.onDestroy$.next();

      this.onSearchCustomer();
    })
  }

  private getPaidCODList() {
    this.loaderService.showLoader();
    this.postAPICall<IPaidCODRequest, Identity<IResponseC<ICODResponse>>>(ApiRoutes.order.getPaidCODList, this.payload, this.headerOption).subscribe({
      next: (res) => {
        if (res?.data) {
          this.isErrorComing = false;
          this.paidCODList = res.data.codReturns;
          this.totalCustomerCount = res.data.total;
          this.totalCount = this.totalCustomerCount / this.payload.top;
        }
        else {
          this.errorMessage = `Data not found`
          this.isErrorComing = true;
        }
        this.loaderService.hideLoader();
      }
    })
  }

  public itemPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const index = this.totalCustomerCount / parseInt(target.value)
    this.totalCount = Math.ceil(index)
    this.payload.pageIndex = 1;
    this.payload.top = parseInt(target.value);
    this.getPaidCODList();
  }

  public pageChanged(event: PageChangedEvent): void {
    this.payload.pageIndex = event.page;
    this.getPaidCODList();
  }

  public onSearchCustomer() {
    this.payload.search = this.searchInput.trim();
    this.loaderService.showLoader();
    this.postAPICall<IPaidCODRequest, Identity<IResponseC<ICODResponse>>>(ApiRoutes.order.getPaidCODList, this.payload, this.headerOption)
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe({
        next: (res) => {
          if (res?.data) {
            this.paidCODList = res.data.codReturns;
            this.totalCustomerCount = res.data.total;
            this.totalCount = this.totalCustomerCount / this.payload.top;
            this.isErrorComing = false;
          }
          else {
            this.errorMessage = `Related to the search input '${this.searchInput}', no customer was found.`
            this.isErrorComing = true;
          }
        },
        error: (err) => {
          this.toasterService.error(err);
        },
        complete: () => {
          this.loaderService.hideLoader();
        }
      })
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

  public onSelectionCustomerChange(event: any) {
    this.payload.customerId = event.value.id;
    this.getPaidCODList();
  }


  override ngOnDestroy() {
    // this.userSearchSubject.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
