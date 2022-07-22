import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../../../pages/users/users.service';
import { InvitationsService } from '../../../../pages/invitations/invitations.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _usersService: UsersService,
    private _invitationsService: InvitationsService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        nombre: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit() {

    const val = this.registrationForm.value;

    this._invitationsService.getByEmail(val.email)
    .subscribe(
        data => {
          if(data.length > 0){

            const data_general:any = {
              'nombre'          : val.nombre,
              'correo_login' : val.email.toLowerCase(),
              'password' : val.password,
              'roles'   : 3,
              'verify': true,
              'completada': true
            }
        
          this._usersService.create(data_general)
          .subscribe(
              (response) => {
                  // Navigate to the confirmation required page
                this.hasError = false;
                const result: {
                  [key: string]: string;
                } = {};
                Object.keys(this.f).forEach((key) => {
                  result[key] = this.f[key].value;
                });
                const newUser = new UserModel();
                newUser.setUser(result);
                const registrationSubscr = this.authService
                  .registration(newUser)
                  .pipe(first())
                  .subscribe((user: UserModel) => {
                    if (user) {
                      this.router.navigate(['/invitations']);
                    } else {
                      this.hasError = true;
                    }
                  });
                this.unsubscribe.push(registrationSubscr);
                
                //this.router.navigate(['/invitations']);
              },
              (response) => {
                  // Re-enable the form
              }
            );

          }else{
            const data_general:any = {
              'nombre'          : val.nombre,
              'correo_login' : val.email.toLowerCase(),
              'password' : val.password,
              'roles'   : 2,
              'verify': false,
              'completada': false
            }
        
          this._usersService.create(data_general)
          .subscribe(
              (response) => {
                  // Navigate to the confirmation required page
                /*this.hasError = false;
                const result: {
                  [key: string]: string;
                } = {};
                Object.keys(this.f).forEach((key) => {
                  result[key] = this.f[key].value;
                });
                const newUser = new UserModel();
                newUser.setUser(result);
                const registrationSubscr = this.authService
                  .registration(newUser)
                  .pipe(first())
                  .subscribe((user: UserModel) => {
                    if (user) {
                      this.router.navigate(['/']);
                    } else {
                      this.hasError = true;
                    }
                  });
                this.unsubscribe.push(registrationSubscr);*/
                
                localStorage.setItem('usuario_verify', JSON.stringify(response.data));
                this.router.navigate(['/auth/verify']);
              },
              (response) => {
                  // Re-enable the form
              }
            );
          }
        },
        (response) => {
            // Reset the form
            //this.signUpNgForm.resetForm();
        }
    );

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
