import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthHTTPService } from '../../services/auth-http/auth-http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {

  verifyCodeForm: FormGroup;
  isLoading$: Observable<boolean>;
  hasError: boolean;
  userId: any;

  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
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
    let verifyCodeData = {
      userId : this.userId,
      verifyCode: this.f.verify_code.value
    }
    this.authHttpService.verifyCode(verifyCodeData)
    .subscribe((result:any|undefined)=>{
      if(result.data.isCodeValid===false){
        Swal.fire({
          text: "Código inválido, intente nuevamente",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok!",
          customClass: {
            confirmButton: "btn btn-light-primary"
          }
        });
      }else{
        Swal.fire({
          text: "Perfecto! ahora puedes configurar una nueva contraseña.",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok!",
          customClass: {
            confirmButton: "btn btn-light-primary"
          }
        });
        this.router.navigate([`auth/change-password/${result.data.userId}`])
      }

    })
  }
}
