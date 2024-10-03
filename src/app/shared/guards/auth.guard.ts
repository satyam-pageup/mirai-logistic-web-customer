import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { TokenDecodeService } from '../services/token-decode.service';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UseFetch } from '../utils/http.util';

export const authGuard: CanActivateFn = async (route, state) => {
  let identity;
  //bug
  // if (typeof window !== 'undefined') {
  identity = localStorage.getItem(environment.tokenKey);
  //  }
  if (identity) {
    const isTokenExpired: boolean = inject(TokenDecodeService).isTokenExpired(identity);
    if (isTokenExpired) {
      const authService = inject(AuthService);
      const router = inject(Router);
      const toasterService = inject(ToastrService);

      try {
        const res = await UseFetch(authService.refereshToken());
        if (res) {
          localStorage.setItem(environment.tokenKey, res.data.token);
          localStorage.setItem(environment.refreshTokenKey, res.data.refreshToken);
          authService.onLoginChange.emit(true);
          router.navigate(['/dashboard']);
          toasterService.success("token refreshed")
          return false;
        }
        else {
          authService.onLoginChange.emit(false);
          router.navigate(['/login']);
          return false;
        }
      } catch (error) {
        authService.onLoginChange.emit(false);
        router.navigate(['/login']);
        return false;
      }
    }
    else {
      return true;
    }
  }

  return inject(Router).navigate(['/login']);
};
