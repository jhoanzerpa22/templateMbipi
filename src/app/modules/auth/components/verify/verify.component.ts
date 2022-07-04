import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../../../pages/users/users.service';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  hasError: boolean;
  isLoading$: Observable<boolean>;
  _user: any;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _usersService: UsersService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    const usuario: any = localStorage.getItem('usuario_verify');
    this._user = JSON.parse(usuario);

    if(this._user.correo_login){
     this.reenviar();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  iniciar_sesion(){
    this.router.navigate(['/auth/login']);
  }

  reenviar(){
    this._usersService.sendMail(this._user)
    .subscribe(
    (response) => {
    },
    (response) => {
        // Re-enable the form
    });
  }
}
