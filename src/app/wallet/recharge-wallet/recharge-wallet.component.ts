import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentBase } from '../../shared/classes/component-base';
import { RazorpayForm, RazorpayFormData, walletRechargeForm, walletRechargeFormData } from '../../shared/models/wallet.model';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { PaymentService } from '../../shared/services/payment.service';
import { IRazorpayApiResponse } from '../../shared/interface/response/wallet.response';

@Component({
  selector: 'app-recharge-wallet',
  templateUrl: './recharge-wallet.component.html',
  styleUrl: './recharge-wallet.component.scss'
})
export class RechargeWalletComponent extends ComponentBase implements OnInit {
  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() customerId!: number;
  public expenceId: number = 0;
  public isEditCase: boolean = false;
  public isSubmitting: boolean = false;

  public rechargeForm: FormGroup<RazorpayForm> = new FormGroup<RazorpayForm>({
    amount: new FormControl(null, Validators.required),
  })

  constructor(
    private paymentService: PaymentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.paymentService.paymentStatus.subscribe((status) => {
      if (status) {
        console.log('Payment process completed successfully!');
        this.EEformValue.emit(true); // Emit your custom event here
      } else {
        console.log('Payment process failed or cancelled.');
      }
    });
  }

  public rechargeWallet() {
    this.rechargeForm.markAllAsTouched();
    console.log(this.rechargeForm.valid)
    if (this.rechargeForm.valid) {
      this.isSubmitting = true;
      const data: RazorpayFormData = {
        amount: this.rechargeForm.controls.amount.value!,
        from: 'WalletRecharge',
        orderData:null
      }
      this.paymentService.createRzpayOrder(data);
      this.isSubmitting = false;
    }
  }

  public decline() {
    this.EEformValue.emit(false);
  }
}
