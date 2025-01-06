import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatecardRoutingModule } from './ratecard-routing.module';
import { RatecardDetailsComponent } from './ratecard-details/ratecard-details.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    RatecardDetailsComponent,
  ],
  imports: [
    CommonModule,
    RatecardRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class RatecardModule { }
