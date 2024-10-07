import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    public showLoaderE: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public showNewLoaderE: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private apiCount: number = 0;

    public showLoader() {
        this.apiCount++;
        if (this.apiCount > 0) {
            this.showLoaderE.next(true);
        }
    }
    public hideLoader() {
        this.apiCount--;
        if (this.apiCount == 0) {
            this.showLoaderE.next(false);
        }
    }
    public showNewLoader() {
        this.apiCount++;
        if (this.apiCount > 0) {
            this.showNewLoaderE.next(true);
        }
    }
    public hideNewLoader() {
        this.apiCount--;
        if (this.apiCount == 0) {
            this.showNewLoaderE.next(false);
        }
    }
}
