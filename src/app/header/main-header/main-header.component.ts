import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ISearchDetails } from '../../shared/interface/response/masterSearch.response';
import { debounceTime, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ComponentBase } from '../../shared/classes/component-base';
import { Customer } from '../../shared/interface/response/auth.response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
  public isListOpen: boolean = false;
  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(private router: Router, private authService: AuthService,private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.customerData = JSON.parse(localStorage.getItem(environment.customerData)!)

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
    //   if (this.searchInput !== "") {
    //     this.searchList = [];
    //     this.isLoader = true;
    //     this.isListOpen = true;
    //     this.getAPICall<Identity<IResponseOrder<ISearchDetails>>>(ApiRoutes.order.getSearchData(this.searchInput.trim()), this.headerOption).pipe(
    //       takeUntil(this.onDestroy$)
    //     ).subscribe(
    //       {
    //         next: (res) => {
    //           if (res?.data) {
    //             // this.isLoader = false;
    //             this.totalSearchListItem = res.data.total;
    //             this.searchList = res.data.orders;
    //           }
    //         },
    //         complete: () => {
    //           this.isLoader = false
    //         },
    //       })
    //   }
  }

  public goToOrderDetailPage(id: string, isActive: string) {
    //   this.isListOpen = false;
    //   this.searchInput = '';
    //   this.router.navigate([this.appRoute.order.base, this.appRoute.order.summary], { queryParams: { guid: id } });
  }

  public goToOrderListPage() {
    //   this.isListOpen = false;
    //   this.router.navigate([this.appRoute.order.base], { queryParams: { search: this.searchInput } });
    //   this.searchInput = '';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    // Check if the click is outside the search list wrapper
    if (!targetElement.closest('.search-list-wrapper')) {
      this.isListOpen = false;
    }
  }

  // override ngOnDestroy(): void {
  //   this.onDestroy$.next();
  //   this.onDestroy$.complete();
  // }
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
}
