import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { comboResponse, Identity } from '../../shared/interface/response/response';
import { debounceTime, map, Subject, takeUntil } from 'rxjs';
import { IQueryDetails, IQuerySupportResponse } from '../../shared/interface/response/query-support.response';
import { IQuerySupportRequest } from '../../shared/interface/request/query-support.request';
import { communicationReferenceData } from '../../shared/models/query-support.model';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { Messages } from '../../shared/constants/message';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-query-detail',
  templateUrl: './query-detail.component.html',
  styleUrl: './query-detail.component.scss'
})
export class QueryDetailComponent extends ComponentBase implements OnInit {
  @ViewChild('template1') modalTemplate1!: TemplateRef<any>;
  @ViewChild('template2') modalTemplate2!: TemplateRef<any>;
  public modelRef?: BsModalRef;
  resolve: any;
  public showFullDescription: { [id: number]: boolean } = {};
  public queryList: IQueryDetails[] = [];
  public totalCustomerCount: number = 0;
  public totalCount: number = 0;
  public searchInput: string = '';
  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();
  public isEditCase: boolean = false;
  public errorMessage: string = '';
  public isErrorComing: boolean = false;
  public payload: IQuerySupportRequest = {
    search: "",
    pageIndex: 1,
    top: 10,
    showDeactivated: false,
    ordersBy: [{
      fieldName: "Id",
      sort: "Desc"
    }],
    customerId: null,
    employeeId: null,
    endDate: null,
    queryStatus: null,
    startDate: null
  }
  public referenceData: { id: number } = {
    id: 0
  };

  public communicationData: communicationReferenceData = {
    queryId: 0,
    queryStatus: ''
  };

  public config = {
    displayKey: "name",
    search: true,
    height: '500px',
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


  constructor(private router: ActivatedRoute, private modalService: BsModalService) {
    super()
  }

  ngOnInit(): void {
    const customerData = JSON.parse(localStorage.getItem(environment.customerData)!);
    this.payload.customerId = parseInt(customerData.id);
    this.router.queryParams.subscribe(params => {
      if (params['customerId']) {
        this.payload.customerId = parseInt(params['customerId']);
      }
    })
    this.router.queryParams.subscribe(params => {
      this.payload.queryStatus = params['status'];
    })
    this.getQueryDetailList();

    this.userSearchSubject.pipe(
      debounceTime(500)
    ).subscribe(seaachText => {
      this.onDestroy$.next();

      this.onSearchQuery();
    })
  }

  public toggleDescription(id: number) {
    this.showFullDescription[id] = !this.showFullDescription[id];
  }

  public getTruncatedDescription(description: string, limit: number) {
    return description.length > limit ? description.substring(0, limit) + '...' : description;
  }

  private getQueryDetailList() {
    this.loaderService.showLoader();
    const datePipe = new DateFormatPipe();
    this.postAPICall<IQuerySupportRequest, Identity<IQuerySupportResponse<IQueryDetails>>>(ApiRoutes.query.getQueryDetails, this.payload, this.headerOption).pipe(
      map((res) => {
        if (res?.data) {
          res.data.queries = res.data.queries.map(query => ({
            ...query,
            queryDate: datePipe.transform(query.queryDate)
          }))
        }
        return res;
      })
    ).subscribe({
      next: (res) => {
        if (res?.data) {
          this.isErrorComing = false;
          this.queryList = res.data.queries;
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

  public getFormDataE(data: boolean) {
    if (data) {
      this.modelRef?.hide();
      // this.resolve(true);
      this.getQueryDetailList();
    }
    else {
      this.modelRef?.hide();
      // this.resolve(false);
    }
  }

  public upsertQuery(index: number) {
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.isEditCase = false;

    this.modelRef = this.modalService.show(this.modalTemplate1, config);
    return new Promise((resolve) => {
      this.resolve = resolve;
    })
  }

  public viewQuery(id: number) {
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.referenceData = {
      id: id
    };
    this.modelRef = this.modalService.show(this.modalTemplate2, config);

  }

  public deleteQuery(isActive: boolean, id: number, queryStatus: string) {
    if (queryStatus === 'ClosedWithSuccessfully' || queryStatus === 'ClosedWithFailed ') {
      this.dialogService.showConfirmationDialog(isActive, Messages.deactivate(isActive ? "deactivate" : "activate", "query")).then(
        (res) => {
          if (res) {
            this.deleteAPICallPromise<null, Identity<boolean>>(ApiRoutes.query.deleteQuery(id), null, this.headerOption).then(
              (res) => {
                if (res.data == true) {
                  this.getQueryDetailList();
                  this.toasterService.success(isActive ? "Deactivate Successfully" : "Activated Successfully");
                }
              }
            )
          }
        }
      )
    }
    else {
      this.toasterService.warning("Please close query")
    }
  }

  public itemPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const index = this.totalCustomerCount / parseInt(target.value)
    this.totalCount = Math.ceil(index)
    this.payload.pageIndex = 1;
    this.payload.top = parseInt(target.value);
    // this.dataTable.top = parseInt(target.value);
    this.getQueryDetailList();
  }

  public pageChanged(event: PageChangedEvent): void {
    this.payload.pageIndex = event.page;
    this.getQueryDetailList();
  }

  public onSearchQuery() {
    this.payload.search = this.searchInput.trim();
    this.loaderService.showLoader();
    this.postAPICall<IQuerySupportRequest, Identity<IQuerySupportResponse<IQueryDetails>>>(ApiRoutes.query.getQueryDetails, this.payload, this.headerOption)
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe({
        next: (res) => {
          if (res?.data) {
            this.queryList = res.data.queries;
            this.totalCustomerCount = res.data.total;
            this.totalCount = this.totalCustomerCount / this.payload.top;
            this.isErrorComing = false;
          }
          else {
            this.errorMessage = `Related to the search input '${this.searchInput}', no customer was found.`
            this.isErrorComing = true;
          }
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

  public onSelectionEmployeeChange(event: any) {
    this.payload.employeeId = event.value.id;
    this.getQueryDetailList();
  }

  public onSelectCustomerChange(event: any) {
    this.payload.customerId = event.value.id;
    this.getQueryDetailList();
  }


  toggleDropdown(index: number): void {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  public activeDropdownIndex: number | null = null;

  public onSelectionChange(event: any) {
    this.getQueryDetailList();
  }

  override ngOnDestroy() {
    // this.userSearchSubject.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
