import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { AuthHTTPService } from '../../services/auth-http/auth-http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {


  changePasswordForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  userId: any;

  private unsubscribe:Subscription[] = [];

  constructor(
    private fb              : FormBuilder,
    private authHttpService : AuthHTTPService,
    private route           : ActivatedRoute,
    private router          : Router
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params =>{
      this.userId = params['id'];
      console.log(this.userId);
    })
  }

  get f(){
    return this.changePasswordForm.controls;
  }

  initForm(){
    this.changePasswordForm = this.fb.group({
      new_password : [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ])
      ],
      confirm_password : [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ])
      ]
    },
    {
      validator: ConfirmPasswordValidator.MatchPassword,
    });
  }

  submit(){
    let changePasswordData = {
      userId    : this.userId,
      newPass   : this.f.new_password.value
    }
    this.authHttpService.changePassword(changePasswordData)
    .subscribe((result:any|undefined)=>{
      if(result.data.updateSuccess === false){
        Swal.fire({
          text: "Ocurrio un error, intenta nuevamente",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok!",
          customClass: {
            confirmButton: "btn btn-light-primary"
          }
        });
      }else{
        Swal.fire({
          text: "Password modificado exitosamente! Serás redirigido a login",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok!",
          customClass: {
            confirmButton: "btn btn-light-primary"
          }
        });
        this.router.navigate(['auth/login'])
      }
    })
  }

}
