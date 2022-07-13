import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';

type Tabs =
  | 'kt_table_widget_4_tab_1'
  | 'kt_table_widget_4_tab_2'
  | 'kt_table_widget_4_tab_3';

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

  activeTab: Tabs = 'kt_table_widget_4_tab_1';
  members: any = [];

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      search_members: [this.defaultValues.search_members],
      members: [this.defaultValues.members],
      businessName: [this.defaultValues.businessName, [Validators.required]],
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
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  add(){
    const search_members = this.form.get('search_members')?.value;
    this.members.push({nombre: search_members, rol: 'Participante'});
    
    this.form.get('search_members')?.setValue('');
    this.form.get('members')?.setValue(this.members);
  }

  changeRol($event: any, i: any){
    this.members[i].rol = $event.target.value;
  }

  quitar(i: any){
    this.members.splice(i, 1);
  }

  checkForm() {
    return !(
      this.form.get('businessName')?.hasError('required') ||
      this.form.get('nameOnCard')?.hasError('required') ||
      this.form.get('cardNumber')?.hasError('required') ||
      this.form.get('cardExpiryMonth')?.hasError('required') ||
      this.form.get('cardExpiryYear')?.hasError('required') ||
      this.form.get('cardCvv')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
