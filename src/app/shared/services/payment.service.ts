import { EventEmitter, Injectable } from '@angular/core';
import { WindowRefService } from './window-ref.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { RazorpayFormData, RazorpayVerificationData, walletRechargeFormData } from '../models/wallet.model';
import { IRazorpayApiResponse, IVerificationResponse } from '../interface/response/wallet.response';
import { Identity } from '../interface/response/response';
import { Customer } from '../interface/response/auth.response';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  public baseUrl: string = environment.baseUrl;
  private customerData: Customer = JSON.parse(localStorage.getItem(environment.customerData)!);
  private dataProps: RazorpayFormData = {
    amount: 0,
    from: '',
    orderData: null
  };
  public razorpayResponseData!: IRazorpayApiResponse;
  public paymentStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private http: HttpClient,
    private winRef: WindowRefService,
    private toasterService: ToastrService
  ) { }

  createRzpayOrder(data: RazorpayFormData) {
    this.dataProps = data;
    const prop = {
      amount: data.amount
    }
    const url = this.baseUrl + `RazorPay`;
    this.http.post<Identity<IRazorpayApiResponse>>(url, prop).subscribe(
      (res) => {
        this.razorpayResponseData = res.data;
        this.dataProps.orderData = {
          ...this.dataProps.orderData!,
          onlinePaymentId: this.razorpayResponseData.onlinePaymentId
        }
        this.payWithRazor(res.data.orderId);
      }
    )
  }

  payWithRazor(val: any) {
    const options: any = {
      key: 'rzp_test_7NEkoUzpIeq7GL',
      amount: this.razorpayResponseData.amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'Mirai Logistics', // company name or product name
      description: '',  // product description
      image: './assets/logo.png', // company logo or product image
      order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      prefill: {
        name: this.customerData.firstName + ' ' + this.customerData.lastName,
        email: this.customerData.email,
        contact: this.customerData.contact,
      },
      theme: {
        color: '#0c238a'
      }
    };

    options.handler = ((response: any, error: any) => {
      options.response = response;

      if (options.response) {
        const url = this.baseUrl + `RazorPay/Verify`;
        let data: RazorpayVerificationData;
        if (this.dataProps.from === 'Order') {
          data = {
            onlinePaymentId: this.razorpayResponseData.onlinePaymentId,
            razorpayOrderId: options.response.razorpay_order_id,
            razorpayPaymentId: options.response.razorpay_payment_id,
            razorpaySignature: options.response.razorpay_signature,
            customerId: this.customerData.id,
            razorPayPaymentType: this.dataProps.from,
            upsertOrderDto: {
              ...this.dataProps.orderData!,
              onlinePaymentId: this.razorpayResponseData.onlinePaymentId
            } as any,
            rechargeWalletDto: null
          }

        }
        else {
          data = {
            onlinePaymentId: this.razorpayResponseData.onlinePaymentId,
            razorpayOrderId: options.response.razorpay_order_id,
            razorpayPaymentId: options.response.razorpay_payment_id,
            razorpaySignature: options.response.razorpay_signature,
            customerId: this.customerData.id,
            razorPayPaymentType: this.dataProps.from,
            upsertOrderDto: null,
            rechargeWalletDto: {
              amount: this.dataProps.amount,
              transactionId: options.order_id,
              customerId: this.customerData.id,
              onlinePaymentId: this.razorpayResponseData.onlinePaymentId
            }
          }
        }

        //verify api call
        this.http.post<Identity<IVerificationResponse>>(url, data).subscribe(
          (res) => {
            if (res.data.walletRecharge || res.data.upsertOrderResponseDto) {
              this.paymentStatus.emit(true)
              this.toasterService.success("Payment Successful");
            }
          }
        )
      }
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
    });

    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      this.toasterService.error("Transaction Cancelled");
      this.paymentStatus.emit(false)
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

}
