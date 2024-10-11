import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodManagementRoutingModule } from './cod-management-routing.module';
import { CodDetailsComponent } from './cod-details/cod-details.component';
import { PaidCodListComponent } from './paid-cod-list/paid-cod-list.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CodDetailsComponent,
    PaidCodListComponent
  ],
  imports: [
    CommonModule,
    CodManagementRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class CodManagementModule { }
