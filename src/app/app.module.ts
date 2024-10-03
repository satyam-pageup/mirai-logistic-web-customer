import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SidebarComponent } from './header/sidebar/sidebar.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MainHeaderComponent } from './header/main-header/main-header.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { environment } from '../environments/environment.development';
import { initializeApp } from 'firebase/app';
initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    MainHeaderComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    SharedModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
