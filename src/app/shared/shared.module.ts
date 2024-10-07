import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NewLoaderComponent } from './components/new-loader/new-loader.component';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { SpaceBeforeCapitalPipe } from './pipes/space-before-capital.pipe';
import { PriceFormatPipe } from './pipes/price-format.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbsPipe } from './pipes/abs.pipe';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { UpsertQueryComponent } from './components/upsert-query/upsert-query.component';


@NgModule({
  declarations: [
    NewLoaderComponent,
    CustomDatePipe,
    DateFormatPipe,
    SpaceBeforeCapitalPipe,
    PriceFormatPipe,
    LoaderComponent,
    ConfirmationDialogComponent,
    PaginationComponent,
    AbsPipe,
    UpdateProfileComponent,
    UpsertQueryComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    SelectDropDownModule,
  ],
  exports: [
    NewLoaderComponent,
    CustomDatePipe,
    DateFormatPipe,
    SpaceBeforeCapitalPipe,
    PriceFormatPipe,
    LoaderComponent,
    ConfirmationDialogComponent,
    PaginationComponent,
    AbsPipe,
    UpdateProfileComponent,
    SpaceBeforeCapitalPipe,
    UpsertQueryComponent
  ]
})
export class SharedModule { }
