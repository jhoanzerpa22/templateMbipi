import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICreateAccount, inits } from '../create-account.helper';
import { UsersService } from '../../users/users.service';
import Swal from 'sweetalert2';

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
    let nextStep = this.currentStep$.value + 1;
    // const tipo_plan = "";
    if(nextStep == 5){
      
      console.log('currentAccount',this.account$.value);
      
      const usuario: any = localStorage.getItem('usuario');
      let user: any = JSON.parse(usuario);
      this._usersService.updateAccount(user.id, this.account$.value)
      .subscribe(
          (response) => {
            this._usersService.sendResume(user.id,user.correo_login,response.user)
            .subscribe(
            (response) => {
            },
            (response) => {
                // Re-enable the form
            });
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
    }

    if (nextStep > this.formsCount) {
      return;
    }else if(this.account$.value.accountPlan && this.account$.value.accountPlan == 'gratuito' && this.currentStep$.value == 2){
      nextStep = nextStep + 1;
    }
    
    if(this.account$.value.accountPlan && this.account$.value.accountPlan == 'pago' && this.currentStep$.value == 3){
      this._usersService.savePayment(this.account$.value)
      .subscribe(
          (response) => {
            console.log('respuesta_pago',response);
            if(response.status != "AUTHORIZED"){
              Swal.fire({
                text: "Ups, ha ocurrido un error con la tarjeta.¡Por favor regrese e ingrese una nueva!",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok!",
                customClass: {
                  confirmButton: "btn btn-primary"
                }
              });
            }
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
    }

      this.currentStep$.next(nextStep);
    
  }

  prevStep() {
    let prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }else if(this.account$.value.accountPlan && this.account$.value.accountPlan == 'gratuito' && this.currentStep$.value == 4){
      prevStep = prevStep - 1;
    }
    this.currentStep$.next(prevStep);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
