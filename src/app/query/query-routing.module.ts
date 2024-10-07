import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryDetailComponent } from './query-detail/query-detail.component';

const routes: Routes = [
  { path: '', component: QueryDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryRoutingModule { }
