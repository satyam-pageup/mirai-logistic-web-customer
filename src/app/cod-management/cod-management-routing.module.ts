import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodDetailsComponent } from './cod-details/cod-details.component';
import { PaidCodListComponent } from './paid-cod-list/paid-cod-list.component';

const routes: Routes = [
  {path:'', component:CodDetailsComponent},
  {path:'cod-returns', component:PaidCodListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodManagementRoutingModule { }
