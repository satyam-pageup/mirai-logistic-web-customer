import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { authGuard } from './shared/guards/auth.guard';

const routes: Routes = [

  {
    path: '', 
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full', },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [authGuard], title: "Dashboard" },
      { path: 'order-list', loadChildren: () => import('./order/order.module').then(m => m.OrderModule), canActivate: [authGuard], title: "Order" },
      { path: 'query', loadChildren: () => import('./query/query.module').then(m => m.QueryModule), canActivate: [authGuard], title: "Query" },
      { path: 'wallet', loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletModule), canActivate: [authGuard], title: "Wallet" },
      { path: 'rate-calculator', loadChildren: () => import('./rate-calculator/rate-calculator.module').then(m => m.RateCalculatorModule), canActivate: [authGuard], title: "Rate Calculator" },
      { path: 'cod', loadChildren: () => import('./cod-management/cod-management.module').then(m => m.CodManagementModule), canActivate: [authGuard], title: "COD Returns" },
 
    ]
  },
  // { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), title: "Login" },
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), title: "Login" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
