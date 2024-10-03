declare var google: any;
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loginForm, loginFormData } from '../../shared/models/login.model';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { NgOtpInputConfig } from 'ng-otp-input';
import { ComponentBase } from '../../shared/classes/component-base';
import { customerRegistrationForm, customerRegistrationFormData } from '../../shared/models/customer.model';
import { LocationService } from '../../shared/services/location.service';
import { ICityDetails, IStateDetails } from '../../shared/interface/response/locationService.response';
import { Identity } from '../../shared/interface/response/response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { ILoginResponse } from '../../shared/interface/response/auth.response';
import { FirebaseService } from '../../shared/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends ComponentBase {
  public isSubmitting: boolean = false;
  public steps: number = 1;
  public otp: string = "";
  public isNewCustomer: boolean = false;
  public states: IStateDetails[] = [];
  public cities: ICityDetails[] = [];

  public loginFormGroup: FormGroup<loginForm> = new FormGroup<loginForm>({
    phoneNo: new FormControl(null, [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]),
    otp: new FormControl(null, [Validators.required, Validators.maxLength(6)]),
    fcmToken: new FormControl(null),
  })
  public registrationFormGroup: FormGroup<customerRegistrationForm> = new FormGroup<customerRegistrationForm>({
    firstName: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
    lastName: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
    state: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    pinCode: new FormControl(null, [Validators.required, Validators.pattern(/^\d{6}$/)]),
    email: new FormControl(null, [Validators.pattern(/[a-zA-Z0-9_\-\.]+@[a-z]+\.[c][o][m]/)]),
    contact: new FormControl(null, [Validators.required, Validators.pattern(/^(?:\+91|91)?[6789]\d{9}$/)]),
    address: new FormControl(null, [Validators.required]),
    customerType: new FormControl(null, [Validators.required]),
    isLogin: new FormControl(false),
  })

  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };


  constructor(private router: Router, private authService: AuthService, private toastrService: ToastrService, private locationService: LocationService, private firebaseService:FirebaseService
  ) {
    super();
  }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id:'275974553025-m4gtndfi0mga45f82j9pdgq9006al7dt.apps.googleusercontent.com',
      callback:(res:any)=>{
        console.log(res)
      }
    })
    google.accounts.id.renderButton(document.getElementById("google-btn"),{
      theme:"filled_blue",
      size:"large",
      shape:"rectangle",
      width:350
    })

    this.locationService.getStateDetails().then(
      (res) => {
        if (res.status) {
          this.states = res.data
        }
      }
    )
  }


  public changePhoneNo(){
    this.steps--;
  }

  public onOtpChange(otp: string) {
    this.loginFormGroup.controls.otp.setValue(otp);
  }

  public login() {
    if (this.steps == 1) {
      this.isSubmitting=true;
      const phoneNumber: string = this.loginFormGroup.controls.phoneNo.value!;
      this.authService.loginWithPhoneNumber(phoneNumber).subscribe({
        next: (res) => {
          if (res.data) {
            this.otp = res.data.toString();
            this.steps++;
          }
          else {
            this.toastrService.error(res.errorMessage);
          }
        },
        error:(err)=> {
          this.toastrService.error(err);
          this.isSubmitting=false
        },
        complete:() => {
          this.isSubmitting=false
        },
      })
    }
    
    if (this.steps === 2 && this.loginFormGroup.valid) {
      this.isSubmitting = true;
      const data: loginFormData = {
        phoneNo: this.loginFormGroup.controls.phoneNo.value!,
        otp: this.loginFormGroup.controls.otp.value!,
        fcmToken: this.loginFormGroup.controls.fcmToken.value!,
      }
      this.authService.login(data).subscribe({
        next: (res) => {
          if (res.data.token) {
            localStorage.setItem(environment.tokenKey, res.data.token);
            localStorage.setItem(environment.refreshTokenKey, res.data.refreshToken);
            this.toastrService.success("Login Successfully")
            this.router.navigate(['./dashboard']);
          }
          else {
            this.isNewCustomer = false;
            this.steps++;
            const phoneNo = this.loginFormGroup.controls.phoneNo.value;
            this.registrationFormGroup.controls.contact.setValue(phoneNo);
            this.registrationFormGroup.controls.contact.disable();
            // this.toastrService.error(res.errorMessage);
          }
        },
        error: (err) => {
          this.toastrService.error(err);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      })


    }
  }

  public registerCustomer(){
    this.registrationFormGroup.markAllAsTouched();
    this.registrationFormGroup.controls.contact.enable();

    if (this.registrationFormGroup.valid) {
      this.isSubmitting = true;
      const customerData: customerRegistrationFormData = {
        id: 0,
        firstName: this.registrationFormGroup.controls.firstName.value,
        lastName: this.registrationFormGroup.controls.lastName.value,
        address: this.registrationFormGroup.controls.address.value,
        city: this.registrationFormGroup.controls.city.value,
        contact: this.registrationFormGroup.controls.contact.value,
        customerType: this.registrationFormGroup.controls.customerType.value,
        email: this.registrationFormGroup.controls.email.value,
        pinCode: this.registrationFormGroup.controls.pinCode.value,
        isLogin: this.registrationFormGroup.controls.isLogin.value,
        state: this.registrationFormGroup.controls.state.value,
        userName:null,
        password:null,
        fcmToken:this.firebaseService.currentToken,
      }
      console.log(customerData)
      this.postAPICallPromise<customerRegistrationFormData, Identity<ILoginResponse>>(ApiRoutes.customer.registerCustomer, customerData, this.headerOption).then(
        (res) => {
          if (res.data) {
            localStorage.setItem(environment.tokenKey, res.data.token);
            localStorage.setItem(environment.refreshTokenKey, res.data.refreshToken);
            this.toastrService.success("Login Successfully")
            this.router.navigate(['./dashboard']);
            this.registrationFormGroup.reset();
          }
          else {
            this.toastrService.error(res.errorMessage)
          }
          this.isSubmitting = false;
        }
      ).catch(() => {
        this.isSubmitting = false;
      })
    }
  }

  public onStateChange() {
    const state = this.registrationFormGroup.controls.state.value
    if (state) {
      this.getCities(state);
    }
  }

  private getCities(state: string) {
    this.locationService.getCitiesDetails(state).then(
      (res) => {
        if (res.status) {
          this.cities = res.data
        }
      }
    )
  }



}
