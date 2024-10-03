import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, inject, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.development";
import { DialogService } from "../services/dialog.service";
import { Subscription } from "rxjs";
import { appRoutes } from "../constants/appRoutes";
import { HeaderOption } from "../models/headerOption.model";

@Component({
    template: ``,
})


export class ComponentBase implements OnDestroy {

    public subscritionsArray: Array<Subscription> = [];
    public baseUrl: string = environment.baseUrl;
    public appRoute = appRoutes;
    // public baseUrl: string = "http://localhost:3000";
    public dialogService: DialogService = inject(DialogService);
    public headerOption: HeaderOption = {
        isSilentCall: false,
        isSendNotification: false
    }
    public myHeader!: HttpHeaders;
    public _router: Router = inject(Router);
    public _httpClient: HttpClient = inject(HttpClient);
    public getAPICallPromise<R>(url: string, hOption: HeaderOption): Promise<R> {
        let myNewHeader: HttpHeaders = new HttpHeaders({
            isSendNotification: 'true',
            isSilentCall: (hOption.isSilentCall) ? 'true' : 'false',
        })
        const hitUrl: string = `${this.baseUrl}${url}`;
        const getPromise = new Promise<R>((resolve, reject) => {
            this.subscritionsArray.push()
            this._httpClient.get<R>(hitUrl, { headers: myNewHeader }).subscribe({
                next: (res) => {
                    resolve(res);
                },
                error: (err) => {
                    reject(err);
                }
            })
        });

        return getPromise;
    }

    public getAPICall<R>(url: string, hOption: HeaderOption) {
        let myNewHeader: HttpHeaders = new HttpHeaders({
            isSendNotification: 'true',
            isSilentCall: (hOption.isSilentCall) ? 'true' : 'false',
        })
        let hitUrl: string = `${this.baseUrl}${url}`;
        return this._httpClient.get<R>(hitUrl, { headers: myNewHeader});
    }

    public postAPICallPromise<D, R>(url: string, data: D, hOption: HeaderOption): Promise<R> {

        let myNewHeader: HttpHeaders = new HttpHeaders({
            isSendNotification: 'true',
            isSilentCall: 'true'
        })
        let hitUrl: string = `${this.baseUrl}${url}`;

        const postPromise = new Promise<R>((resolve, reject) => {
            this._httpClient.post<R>(hitUrl, data, { headers: myNewHeader }).subscribe({
                next: (res) => {
                    resolve(res);
                },
                error: (err) => {
                    reject(err);
                }
            })
        });
        return postPromise;
    }

    public postAPICall<D, R>(url: string, data: D, hOption: HeaderOption) {

        let myNewHeader: HttpHeaders = new HttpHeaders({
            isSendNotification: 'true',
            isSilentCall: 'true',
        })
        let hitUrl: string = `${this.baseUrl}${url}`;

        return this._httpClient.post<R>(hitUrl, data, { headers: myNewHeader});
    }

    public postAPICallTest<D, R>(url: string, data: D, hOption: HeaderOption) {

        let myNewHeader: HttpHeaders = new HttpHeaders({
            isSendNotification: 'true',
            isSilentCall: 'true',
        })
        let hitUrl: string = `${this.baseUrl}${url}`;

        return this._httpClient.post<R>(hitUrl, data, { headers: myNewHeader,observe:'response'});
    }

    public putAPICallPromise<D, R>(url: string, data: D, hOption: HeaderOption): Promise<R> {
        const hitUrl: string = `${this.baseUrl}${url}`;
        const postPromise = new Promise<R>((resolve, reject) => {
            this._httpClient.put<R>(hitUrl, data).subscribe({
                next: (res) => {
                    resolve(res);
                },

                error: (err) => {
                    reject(err);
                }
            })
        });

        return postPromise;
    }

    public deleteAPICallPromise<D, R>(url: string, data: D, hOption: HeaderOption): Promise<R> {
        const hitUrl: string = `${this.baseUrl}${url}`;
        const postPromise = new Promise<R>((resolve, reject) => {
            this._httpClient.delete<R>(hitUrl, { body: data }).subscribe({
                next: (res) => {
                    resolve(res);
                },

                error: (err) => {
                    reject(err);
                }
            })
        });

        return postPromise;
    }

    // private unSubscribeAll() {
    //     for (let i = 0; i < this.subscritionsArray.length; i++) {
    //         this.subscritionsArray[i].unsubscribe();
    //     }
    // }

    ngOnDestroy(): void {
        // this.unSubscribeAll();
    }
}