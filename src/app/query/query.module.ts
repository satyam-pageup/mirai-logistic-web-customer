import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueryRoutingModule } from './query-routing.module';
import { QueryDetailComponent } from './query-detail/query-detail.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SingleQueryDetailComponent } from './single-query-detail/single-query-detail.component';


@NgModule({
  declarations: [
    QueryDetailComponent,
    SingleQueryDetailComponent
  ],
  imports: [
    CommonModule,
    QueryRoutingModule,
    SelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class QueryModule { }
