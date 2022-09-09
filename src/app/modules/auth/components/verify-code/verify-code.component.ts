import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthHTTPService } from '../../services/auth-http/auth-http.service';

import Swal from 'sweetalert2';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
  TokenInvalid
}

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class VerifyCodeComponent implements OnInit {

  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  verifyCodeForm: FormGroup;
  isLoading$: Observable<boolean>;
  hasError: boolean;
  userId: any;
  pass_recovery_token: any;


  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb              : FormBuilder,
    private authHttpService : AuthHTTPService,
    private route           : ActivatedRoute,
    private router          : Router,
    private ref             : ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params =>{
      this.userId = params['id'];
      this.pass_recovery_token = params['token'];
      console.log(this.userId, this.pass_recovery_token);
    })
  }

  get f(){
    return this.verifyCodeForm.controls;
  }

  initForm(){
    this.verifyCodeForm = this.fb.group({
      verify_code : [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])
      ]
    })
  }

  submit(){
    this.errorState = ErrorStates.NotSubmitted;

    let verifyCodeData = {
      userId : this.userId,
      verifyCode: this.f.verify_code.value,
      pass_recovery_token: this.pass_recovery_token
    }
    this.authHttpService.verifyCode(verifyCodeData)
    .subscribe((result:any|undefined)=>{
      if(result.data.invalidToken===true){
        this.errorState = ErrorStates.TokenInvalid;
        this.ref.detectChanges();
        // Swal.fire({
        //   text: "Código inválido, intente nuevamente",
        //   icon: "error",
        //   buttonsStyling: false,
        //   confirmButtonText: "Ok!",
        //   customClass: {
        //     confirmButton: "btn btn-light-primary"
        //   }
        // });
      }
      if(result.data.isCodeValid===false){
        this.errorState = ErrorStates.HasError;
        this.ref.detectChanges();
        // Swal.fire({
        //   text: "Código inválido, intente nuevamente",
        //   icon: "error",
        //   buttonsStyling: false,
        //   confirmButtonText: "Ok!",
        //   customClass: {
        //     confirmButton: "btn btn-light-primary"
        //   }
        // });
      }
      if(result.data.isCodeValid===true){
        this.errorState = ErrorStates.NoError;
        // Swal.fire({
        //   text: "Perfecto! ahora puedes configurar una nueva contraseña.",
        //   icon: "success",
        //   buttonsStyling: false,
        //   confirmButtonText: "Ok!",
        //   customClass: {
        //     confirmButton: "btn btn-light-primary"
        //   }
        // });
        this.ref.detectChanges();
        setTimeout(()=>{
          this.router.navigate([`auth/change-password/${result.data.userId}`])
        },3000)
      }

    })
  }
}
