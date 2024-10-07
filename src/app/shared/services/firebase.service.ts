import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { ToastrService } from 'ngx-toastr';
import { INotificationModel, NotificationResponse } from '../models/notification.model';
import { ComponentBase } from '../classes/component-base';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService extends ComponentBase {
  public currentToken: string = "";
  constructor(private _toasterService: ToastrService) {
    super();
  }

  public requestPermission() {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: environment.vapidKey }).then(
        (token) => {
          if (token) {
            // this._toasterService.success('Hurraaa!!! we got the token.....');
            console.log(token);
            this.currentToken = token;
          } else {
            this._toasterService.error('No registration token available. Request permission to generate one.')
            console.log('else.');
          }
        }).catch((err) => {
          // this._toastreService.error('Error retrieving token. ', err);
          if (err.code === 'messaging/permission-blocked') {
            console.log('Notification access denied by the user.');
          }
        });
  }

  public listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      const nofication = payload as NotificationResponse;
      const senderID: number = parseInt(nofication.data['gcm.notification.userId']);
      const data: { id: number, data: string } = {
        id: senderID,
        data: nofication.notification.body
      }
    });
  }



  public sendNotification(obj: { receiverSystemToken: string, title: string, body: string }, loggedInUserId: number) {

    const url = 'https://fcm.googleapis.com/fcm/send';
    const newMsg: INotificationModel = {
      notification: {
        title: obj.title,
        body: obj.body,
        userId: loggedInUserId
      },

      to: obj.receiverSystemToken
    }

    if (obj.receiverSystemToken != null) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'key=AAAA5N9GikU:APA91bE6i7bh3atMvh671HBpD7ab3H6BHG9qbwJHpNOeING93nOfRCHt-XHdoGFcOujelFyN1EGleLaWoCFquNQxRkWFLwM6d_PIoloeJh7Ngtw2J0z5kOufWtx8Lz3OLIHTx7in8oD1',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMsg)
      })
    }

  }

  private saveToken(token: string) {
    const newToken: { systemToken: string } = {
      systemToken: token
    };

    // this.putAPICallPromise<{ systemToken: string }, IResponse<null>>(APIRoutes.updateSystemToken, newToken, this.headerOption).then(
    //   (res) => {
    //     console.log(res);
    //   }
    // )
  }
}
