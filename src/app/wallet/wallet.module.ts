import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletDetailsComponent } from './wallet-details/wallet-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RechargeWalletComponent } from './recharge-wallet/recharge-wallet.component';


@NgModule({
  declarations: [
    WalletDetailsComponent,
    RechargeWalletComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class WalletModule { }
