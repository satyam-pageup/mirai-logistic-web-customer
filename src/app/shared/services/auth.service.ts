import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Identity } from '../interface/response/response';
import { ILoginResponse } from '../interface/response/auth.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  public onLoginChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private httpClient: HttpClient) { }

  loginWithPhoneNumber(phoneno: string) {
    const url = `${this.baseUrl}Login/phoneno`;
    const params = new HttpParams().set('phoneno', phoneno);
    return this.httpClient.get<Identity<number>>(url, { params });
  }


  public login(data: any) {
    const url = `${this.baseUrl}Login/phoneno/otp`;
    return this.httpClient.post<Identity<ILoginResponse>>(url,data);
  }

  public refereshToken(){
    const url = `${this.baseUrl}Login/SilentLogin`;
    const data ={
      token: localStorage.getItem(environment.tokenKey),
      refreshToken: localStorage.getItem(environment.refreshTokenKey)
    }
    return this.httpClient.post<Identity<ILoginResponse>>(url,data)
  }
}
