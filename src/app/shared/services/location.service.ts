import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICountryDetails, IResponseState } from '../interface/response/locationService.response';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiKey = 'OHQ2A8NZG3VS6WODUFCXFEX10VEP0I'; // Replace with your actual API key
  private apiUrl = 'https://pinbinapi.com/api';

  constructor(private http: HttpClient) { }

  getCountryDetails(): Promise<IResponseState<ICountryDetails[]>> {
    const url = `${this.apiUrl}/countries`;
    const headers = new Headers();
    headers.append('X-API-KEY', `${this.apiKey}`);

    return fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching card details:', error);
        throw error;
      });
  }

  getStateDetails(): Promise<any> {
    const url = `${this.apiUrl}/countries/IN/states`;
    const headers = new Headers();
    headers.append('X-API-KEY', `${this.apiKey}`);

    return fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching card details:', error);
        throw error;
      });
  }

  getCitiesDetails(state: string): Promise<any> {
    const url = `${this.apiUrl}/countries/IN/states/${state}/cities`;
    const headers = new Headers();
    headers.append('X-API-KEY', `${this.apiKey}`);

    return fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching card details:', error);
        throw error;
      });
  }

  getDetailsUsingPincode(pincode: string): Promise<any> {
    const url = `https://api.postalpincode.in/pincode/${pincode}`;

    return fetch(url, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching card details:', error);
        throw error;
      });
  }

  // getStateApi(){
  //   return this.http.get("https://pinbinapi.com/api/countries/IN/states");
  // }
}
