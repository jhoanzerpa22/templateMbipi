import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UsersService } from '../../../../users.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-sign-in-method',
  templateUrl: './sign-in-method.component.html',
})
export class SignInMethodComponent implements OnInit, OnDestroy {
  showChangeEmailForm: boolean = false;
  showChangePasswordForm: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  user: any = [];
  id: any = '';
  loginForm: FormGroup;

  constructor(private cdr: ChangeDetectorRef, 
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _router: Router,
    private route: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.id = params['id'];
      if(this.id > 0){
        this.loginForm = this._formBuilder.group({
          correo_login    : ['', [Validators.required, Validators.email]]
        });
        this.getUser(params['id']);
      }else{
        this.loginForm = this._formBuilder.group({
          correo_login    : ['', [Validators.required, Validators.email]],
        });
      }
      
});
  }

  toggleEmailForm(show: boolean) {
    this.showChangeEmailForm = show;
  }

  saveEmail() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.showChangeEmailForm = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  togglePasswordForm(show: boolean) {
    this.showChangePasswordForm = show;
  }

  getUser(id: any): void {
    this._usersService.get(id)
      .subscribe(
        data => {
          this.user = data;
          //console.log(data);
          this.setValueEdit(data);
        },
        error => {
          console.log(error);
        });
  }

  setValueEdit(data: any){
    this.loginForm.setValue({
        'correo_login'      : data.user.correo_login
    });
}

  savePassword() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.showChangePasswordForm = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
