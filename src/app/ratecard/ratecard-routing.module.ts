import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatecardDetailsComponent } from './ratecard-details/ratecard-details.component';

const routes: Routes = [{
  path:'',
  component: RatecardDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatecardRoutingModule { }
