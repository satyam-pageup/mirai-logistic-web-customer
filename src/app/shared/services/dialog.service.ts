import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public confirmationDialogEvent = new Subject<{ resolve: (value: boolean | PromiseLike<boolean>) => void, heading:boolean | null,message: string }>();

  public showConfirmationDialog(head:boolean|null,messgae: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationDialogEvent.next({ resolve, heading:head,message: messgae });
    })
  }
}
