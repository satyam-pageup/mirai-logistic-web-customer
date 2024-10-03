import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenDecodeService {
  public helper = new JwtHelperService();
  public userData = {
    Id: "",
    Email: "",
    Name: "",
    Contact: "",
    Address: "",
    UserType: "",
    exp: 0
  }

  constructor() { }

  ngOnInit(): void {
    this.isTokenExpired(localStorage.getItem(environment.tokenKey)!);
  }
  
  public isTokenExpired(token: string): boolean {
    
    const decodedToken = this.helper.decodeToken(token);
    this.userData=decodedToken;
    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1);
    const currentUnixTimestamp = Math.floor(currentDate.getTime() / 1000);
    // TOKEN EXPIRED
    if (decodedToken.exp < currentUnixTimestamp) {
      return true;
    }
    // TOKEN NOT EXPIRED
    return false;
  }

  public getDecodedUserRole(token: string): string {
    const decodedToken = this.helper.decodeToken(token);
    if (decodedToken.UserType) {
      return decodedToken.UserType;
    }
    return '';
  }
}
