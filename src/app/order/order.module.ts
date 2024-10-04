import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AddManualOrderComponent } from './add-manual-order/add-manual-order.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { PickupGenerateComponent } from './pickup-generate/pickup-generate.component';
import { SingleOrderViewComponent } from './single-order-view/single-order-view.component';


@NgModule({
  declarations: [
    OrderDetailsComponent,
    AddManualOrderComponent,
    PickupGenerateComponent,
    SingleOrderViewComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SelectDropDownModule

  ]
})
export class OrderModule { }
