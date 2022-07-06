import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICreateAccount, inits } from '../create-account.helper';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-config-cta-wizzard',
  templateUrl: './config-cta-wizzard.html',
})
export class ConfigCtaWizardComponent implements OnInit {
  formsCount = 5;
  account$: BehaviorSubject<ICreateAccount> =
    new BehaviorSubject<ICreateAccount>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private unsubscribe: Subscription[] = [];

  constructor(private _usersService: UsersService) {}

  ngOnInit(): void {}

  updateAccount = (part: Partial<ICreateAccount>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    //console.log('currentAccount',this.account$.value);
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    // const tipo_plan = "";
    if(nextStep == 5){
      
      console.log('currentAccount',this.account$.value);
      
      const usuario: any = localStorage.getItem('usuario');
      let user: any = JSON.parse(usuario);
      this._usersService.updateAccount(user.id, this.account$.value)
      .subscribe(
          (response) => {
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
    }
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStep$.next(nextStep);
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
