import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { LoaderService } from '../services/loader.service';

@Injectable()

export class authInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService, private toasterService: ToastrService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(environment.tokenKey);
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.loaderService.hideLoader();
        let errorMessage: string = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        }
        else {
          switch (error.status) {
            case 400:
              errorMessage = `Bad Request: ${error.message}`;
              break;
            case 401:
              errorMessage = `Unauthorized: ${error.message}`;
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = `Forbidden: ${error.message}`;
              break;
            case 404:
              errorMessage = `Not Found: ${error.message}`;
              break;
            case 500:
              errorMessage = `Internal Server Error: ${error.message}`;
              break;
            default:
              errorMessage = `Unknown Error: ${error.message}`;
              break;
          }
        }
        return throwError(errorMessage);
      })
    );
  }
}
