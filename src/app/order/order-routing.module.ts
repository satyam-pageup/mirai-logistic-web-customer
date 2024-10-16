import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { SingleOrderViewComponent } from './single-order-view/single-order-view.component';
import { BulkOrderTableComponent } from './bulk-order-table/bulk-order-table.component';

const routes: Routes = [
  { path: '', component: OrderDetailsComponent},
  { path: 'order-summary', component: SingleOrderViewComponent },
  { path: 'bulk-order', component: BulkOrderTableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
