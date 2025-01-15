import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ISearchDetails } from '../../shared/interface/response/masterSearch.response';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ComponentBase } from '../../shared/classes/component-base';
import { Customer } from '../../shared/interface/response/auth.response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Identity } from '../../shared/interface/response/response';
import { IResponseOrder } from '../../shared/interface/response/order.response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { NotificationRequest } from '../../shared/interface/request/notification.request';
import { ITotalNotification, Notification } from '../../shared/interface/response/notification.response';
import { EmitDate } from '../../shared/models/dateRangePicker.model';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent extends ComponentBase {
  @ViewChild('updateOrderTemplate') modalTemplate1!: TemplateRef<any>;
  public modelRef?: BsModalRef;
  resolve: any;
  public isLoader: boolean = false;
  public customerData!: Customer;
  public curretDate: Date = new Date();
  public searchInput: string = '';
  public totalSearchListItem: number = 0;
  public searchList: ISearchDetails[] = [];
  public notificationList: Notification[] = [];
  isLoading = false;
  showNotifications = false;
  public totalNotification: number = 0;
  public totalUnreadNotification: number = 0;

  public isListOpen: boolean = false;
  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();

  public notificationPayload: NotificationRequest = {
    search: "",
    pageIndex: 1,
    top: 10,
    showDeactivated: false,
    ordersBy: [{
      fieldName: "Id",
      sort: "Desc"
    }],
    notificationType: null,
    isCustomer: null,
    isRead: null,
    userId: 0
  }

  constructor(private router: Router, private authService: AuthService, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.customerData = JSON.parse(localStorage.getItem(environment.customerData)!)
    if (this.customerData) {
      this.notificationPayload.userId = this.customerData.id;
    }
    
    this.authService.onLoginChange.subscribe((res) => {
      if (typeof document !== 'undefined') {
        let arrow = document.querySelectorAll(".arrow");
        for (let i = 0; i < arrow.length; i++) {
          arrow[i].addEventListener("click", (e) => {
            let arrowParent = (e.target as HTMLElement).parentElement?.parentElement; // selecting main parent of arrow
            if (arrowParent) {
              arrowParent.classList.toggle("showMenu");
            }
          });
        }
      }
    })

    this.userSearchSubject.pipe(
      debounceTime(500),
    ).subscribe(seaachText => {
      this.onDestroy$.next();
      this.onSearchOrder();
    })
    
    this.getNotificationList();
  }

  public logout() {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem(environment.customerData);
    this.router.navigate([this.appRoute.login])
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

  public editProfile() {
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-lg'
    };
    this.modelRef = this.modalService.show(this.modalTemplate1, config);
  }



  private onSearchOrder() {
    if (this.searchInput !== "") {
      this.searchList = [];
      this.isLoader = true;
      this.isListOpen = true;
      this.getAPICall<Identity<IResponseOrder<ISearchDetails>>>(ApiRoutes.order.getSearchData(this.searchInput.trim()), this.headerOption).pipe(
        takeUntil(this.onDestroy$)
      ).subscribe(
        {
          next: (res) => {
            if (res?.data) {
              // this.isLoader = false;
              this.totalSearchListItem = res.data.total;
              this.searchList = res.data.orders;
            }
          },
          complete: () => {
            this.isLoader = false
          },
        })
    }
  }

  public goToOrderDetailPage(id: string, isActive: string) {
    this.isListOpen = false;
    this.searchInput = '';
    this.router.navigate([this.appRoute.order.base, this.appRoute.order.summary], { queryParams: { guid: id } });
  }

  public goToOrderListPage() {
    this.isListOpen = false;
    this.router.navigate([this.appRoute.order.base], { queryParams: { search: this.searchInput } });
    this.searchInput = '';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    // Check if the click is outside the search list wrapper
    this.showNotifications = false
    
    if (!targetElement.closest('.search-list-wrapper')) {
      this.isListOpen = false;
    }
  }

  override ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
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

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications && this.notificationList.length === 0) {
      this.getNotificationList();
    }
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollPosition = target.scrollTop + target.clientHeight;
    const scrollThreshold = target.scrollHeight * 0.9;

    if (scrollPosition >= scrollThreshold && !this.isLoading) {
      if(this.notificationPayload.top * this.notificationPayload.pageIndex < this.totalNotification){
        this.getNotificationList();
      }
    }
  }

  private getNotificationList() {
    this.isLoading = true;
    this.postAPICall<NotificationRequest, Identity<ITotalNotification<Notification[]>>>(ApiRoutes.notification.getNotification, this.notificationPayload, this.headerOption).subscribe({
      next: (res) => {
        if (res.data) {
          this.notificationList = res.data.notifications;
          this.totalNotification = res.data.total;
          this.totalUnreadNotification = res.data.totalUnread;
          this.isLoading = false;
        }
      }
    })
  }

}
