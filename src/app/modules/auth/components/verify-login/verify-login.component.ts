import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../../../pages/users/users.service';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-verify-login',
  templateUrl: './verify-login.component.html',
  styleUrls: ['./verify-login.component.scss'],
})
export class VerifyLoginComponent implements OnInit, OnDestroy {
  hasError: boolean;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _usersService: UsersService,
    private _router: Router,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    /*this.route.params.subscribe(params => {
      console.log('params',params);
      //params['id'];
    });*/
    this.route.queryParams.subscribe(params => {
      let pass = params['pass_token'];
      this._usersService.verifyLogin({pass_token: pass})
        .subscribe(
        (response) => {
        },
        (response) => {
            // Re-enable the form
        });

  });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  iniciar_sesion(){
    this._router.navigate(['/auth/login']);
  }
}
