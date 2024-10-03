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


@NgModule({
  declarations: [
    NewLoaderComponent,
    CustomDatePipe,
    DateFormatPipe,
    SpaceBeforeCapitalPipe,
    PriceFormatPipe,
    LoaderComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ModalModule.forRoot(),
  ],
  exports:[
    NewLoaderComponent,
    CustomDatePipe,
    DateFormatPipe,
    SpaceBeforeCapitalPipe,
    PriceFormatPipe,
    LoaderComponent,
    ConfirmationDialogComponent

  ]
})
export class SharedModule { }
