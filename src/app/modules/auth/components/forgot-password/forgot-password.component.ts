import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { AuthHTTPService } from '../../services/auth-http';
import Swal from 'sweetalert2';


enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  userData: any;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb              : FormBuilder,
    private authService     : AuthService,
    private authHttpService : AuthHTTPService,
    private ref             : ChangeDetectorRef) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .forgotPassword(this.f.email.value)
      .pipe(first())
      .subscribe((result: any | undefined) => {
        //this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
        this.userData = result
        if(result.data.isEmailOnDb === false){
          this.errorState = ErrorStates.HasError
          // Swal.fire({
          //   text: "Sorry, looks like there are some errors detected, please try again.",
          //   icon: "error",
          //   buttonsStyling: false,
          //   confirmButtonText: "Ok, got it!",
          //   customClass: {
          //       confirmButton: "btn btn-light-primary"
          //   }
          // });

        }else {
          this.sendValidatonCode(this.userData);
        }

      });
      this.unsubscribe.push(forgotPasswordSubscr);



    }

    sendValidatonCode(userData: any){
      this.authHttpService.sendMailConfirmPass(userData)
      .subscribe(
        (response) => {
            this.errorState = ErrorStates.NoError
            this.ref.detectChanges();
            // Swal.fire({
            //   text: "Correo enviado correctamente a "+userData.data.correo_login +".",
            //   icon: "success",
            //   buttonsStyling: false,
            //   confirmButtonText: "Ok!",
            //   customClass: {
            //     confirmButton: "btn btn-light-primary"
            //   }
            // });
          },
          (err) => {
            console.log(err)
          });
  }

}
