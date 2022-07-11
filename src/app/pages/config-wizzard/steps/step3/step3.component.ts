import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import { ReferenciasService } from '../../referencias.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
})
export class Step3Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<ICreateAccount>;

  private unsubscribe: Subscription[] = [];
  referencias: any = [];

  constructor(private fb: FormBuilder,
    private refService: ReferenciasService) {}

  ngOnInit() {
    this.getReferencias();
    this.initForm();
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      businessName: [this.defaultValues.businessName, [Validators.required]],
      businessDescriptor: [this.defaultValues.businessDescriptor, [Validators.required],],
      business: [this.defaultValues.business, [Validators.required]],
      businessType: [this.defaultValues.businessType, [Validators.required]],
      businessDescription: [this.defaultValues.businessDescription],
      businessEmail: [
        this.defaultValues.businessEmail,
        [Validators.required, Validators.email],
      ],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  getReferencias(): void {
    this.refService.getAll()
      .subscribe(
        data => {
          this.referencias = data;
          
        },
        error => {
          console.log(error);
        });
  }

  checkForm() {
    return !(
      this.form.get('businessName')?.hasError('required') ||
      this.form.get('businessDescriptor')?.hasError('required') ||
      this.form.get('business')?.hasError('required') ||
      this.form.get('businessType')?.hasError('required') ||
      this.form.get('businessEmail')?.hasError('required') ||
      this.form.get('businessEmail')?.hasError('email')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
