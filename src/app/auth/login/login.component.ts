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
import { TokenDecodeService } from '../../shared/services/token-decode.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends ComponentBase {
  public isSubmitting: boolean = false;
  public steps: number = 1;
  public otp: string = "";
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
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '40px',
      'border-radius': '10px',

      'margin': '5px',
      'font-size': '20px',
      'text-align': 'center',
    }
  };


  constructor(private router: Router, private tokenDecodeService: TokenDecodeService, private authService: AuthService, private locationService: LocationService, private firebaseService: FirebaseService
  ) {
    super();
  }

  ngOnInit(): void {
    google.accounts.id.initialize({
      // client_id: '275974553025-um4otbnrt0lcs8vk4sdqjcstraik3rq2.apps.googleusercontent.com',
      client_id: '165717162890-81pk2n612hok22bg4394lgtclf4l0isj.apps.googleusercontent.com',
      callback: (res: any) => {
        console.log(res)
        const data = this.tokenDecodeService.decodeToken(res.credential);
        const requestData = {
          sub: data.sub,
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          fcmToken: this.firebaseService.currentToken
        }
        this.authService.loginWithGoogle(requestData).pipe(
          tap(
            (res) => {
              if (res.data.token) {
                if (res.data.customer && res.data.customer.address) {
                  res.data.customer.address = res.data.customer.address.trim();
                }
              }
            }
          )
        ).subscribe({
          next: (res) => {
            if (res.data.token) {
              console.log(res.data)
              localStorage.setItem(environment.tokenKey, res.data.token);
              localStorage.setItem(environment.refreshTokenKey, res.data.refreshToken);
              localStorage.setItem(environment.customerData, JSON.stringify(res.data.customer));
              this.toasterService.success("Login Successfully")
              this.router.navigate(['./dashboard']);
            }
          }
        })
      }
    })
    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: "filled_blue",
      size: "large",
      shape: "rectangle",
      width: 350
    })

    this.locationService.getStateDetails().then(
      (res) => {
        this.states = res
      }
    )
  }

  public changePhoneNo() {
    this.steps--;
  }

  public onOtpChange(otp: string) {
    this.loginFormGroup.controls.otp.setValue(otp);
  }

  public login() {
    if (this.steps == 1) {
      this.loginFormGroup.controls.phoneNo.markAllAsTouched();
      if (this.loginFormGroup.controls.phoneNo.valid) {
        this.isSubmitting = true;
        const phoneNumber: string = this.loginFormGroup.controls.phoneNo.value!;
        this.authService.loginWithPhoneNumber(phoneNumber).subscribe({
          next: (res) => {
            if (res.data) {
              this.otp = res.data.toString();
              this.steps++;
            }
            else {
              this.toasterService.error(res.errorMessage);
            }
          },
          error: (err) => {
            this.toasterService.error("Oops! Something went wrong on our end. Please try again later.");
            this.isSubmitting = false
          },
          complete: () => {
            this.isSubmitting = false
          },
        })
      }
    }

    else if (this.steps === 2 && this.loginFormGroup.valid) {
      // Check the otp filled by user is correct or not
      if (this.otp === this.loginFormGroup.value.otp) {
        this.isSubmitting = true;
        const data: loginFormData = {
          phoneNo: this.loginFormGroup.controls.phoneNo.value!,
          otp: this.loginFormGroup.controls.otp.value!,
          fcmToken: this.firebaseService.currentToken!,
        }
        this.authService.login(data).subscribe({
          next: (res) => {
            if (res.data.token) {
              localStorage.setItem(environment.tokenKey, res.data.token);
              localStorage.setItem(environment.refreshTokenKey, res.data.refreshToken);
              localStorage.setItem(environment.customerData, JSON.stringify(res.data.customer));
              this.toasterService.success("Login Successfully")
              this.router.navigate(['./dashboard']);
            }
            else {
              this.steps++;
              const phoneNo = this.loginFormGroup.controls.phoneNo.value;
              this.registrationFormGroup.controls.contact.setValue(phoneNo);
              this.registrationFormGroup.controls.contact.disable();
              // this.toasterService.error(res.errorMessage);
            }
          },
          error: (err) => {
            this.toasterService.error(err);
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        })
      }
      else {
        this.toasterService.error("Enter valid OTP")
      }

    }

    else if (this.steps === 3) {
      this.registerCustomer();
    }
  }

  public registerCustomer() {
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
        userName: null,
        password: null,
        fcmToken: this.firebaseService.currentToken,
      }
      console.log(customerData)
      this.postAPICallPromise<customerRegistrationFormData, Identity<ILoginResponse>>(ApiRoutes.customer.registerCustomer, customerData, this.headerOption).then(
        (res) => {
          if (res.data) {
            localStorage.setItem(environment.tokenKey, res.data.token);
            localStorage.setItem(environment.refreshTokenKey, res.data.refreshToken);
            this.toasterService.success("Login Successfully")
            this.router.navigate(['./dashboard']);
            this.registrationFormGroup.reset();
          }
          else {
            this.toasterService.error(res.errorMessage)
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
        this.cities = res
      }
    )
  }



}
