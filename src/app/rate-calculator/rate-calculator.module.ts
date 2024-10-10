import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateCalculatorRoutingModule } from './rate-calculator-routing.module';
import { RatecardComponent } from './ratecard/ratecard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CalculatedAmountComponent } from './calculated-amount/calculated-amount.component';


@NgModule({
  declarations: [
    RatecardComponent,
    CalculatedAmountComponent
  ],
  imports: [
    CommonModule,
    RateCalculatorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RateCalculatorModule { }
