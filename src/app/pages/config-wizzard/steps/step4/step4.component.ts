import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import { UsersService } from '../../../users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
})
export class Step4Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<ICreateAccount>;

  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder, private _usersService: UsersService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.initForm();
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      nameOnCard: [this.defaultValues.nameOnCard, [Validators.required]],
      cardNumber: [this.defaultValues.cardNumber, [Validators.required]],
      cardExpiryMonth: [
        this.defaultValues.cardExpiryMonth,
        [Validators.required],
      ],
      cardExpiryYear: [
        this.defaultValues.cardExpiryYear,
        [Validators.required],
      ],
      cardCvv: [this.defaultValues.cardCvv, [Validators.required]],
      saveCard: ['1'],
      successCard: [''/*, [Validators.required]*/]
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('nameOnCard')?.hasError('required') ||
      this.form.get('cardNumber')?.hasError('required') ||
      this.form.get('cardExpiryMonth')?.hasError('required') ||
      this.form.get('cardExpiryYear')?.hasError('required') ||
      this.form.get('cardCvv')?.hasError('required') || this.form.get('successCard')?.hasError('required')
    );
  }

  validar(){
    this._usersService.savePayment(this.form.value)
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
            }else{
              this.form.get('successCard')?.setValue(1);
              this.updateParentModel({}, this.checkForm());
              this.ref.detectChanges();
            }
          },
          (err) => {
            console.log(err)
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
      );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
