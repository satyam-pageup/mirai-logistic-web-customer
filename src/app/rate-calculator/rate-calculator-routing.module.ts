import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatecardComponent } from './ratecard/ratecard.component';

const routes: Routes = [
  {path:'',component:RatecardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateCalculatorRoutingModule { }
