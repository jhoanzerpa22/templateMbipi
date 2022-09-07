import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter, ViewChild, ElementRef, forwardRef, Renderer2, OnDestroy } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { UsersService } from '../../../users/users.service';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';/*
import { TagData, TagifySettings } from 'ngx-tagify';*/

type Tabs =
  | 'kt_table_widget_4_tab_1'
  | 'kt_table_widget_4_tab_2'
  | 'kt_table_widget_4_tab_3';

  /*interface TagData {
    value: string;
    [key: string]: any;
  }*/

  export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    foto:string;
  }

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css'],
})
export class Step4Component implements OnInit, OnDestroy {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<ICreateAccount>;

  private unsubscribe: Subscription[] = [];

  activeTab: Tabs = 'kt_table_widget_4_tab_1';
  members: any = [];
  filteredOptionsUsuario: Observable<Usuario[]>;
  myControl = new FormControl();
  searchUsuarios: any[] = [];
  busqueda: any = '';

  @ViewChild("mySearch") mySearch: ElementRef;

  private usuarios: any = [];

  public filteredUsuarios: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();
  /*tags: TagData[] = [{ value: 'foo' }];
  // tags = 'foo'; -> if you want to pass as string
    
  settings: TagifySettings = {
    placeholder: 'Start typing...',
    blacklist: ['fucking', 'shit'],
    callbacks: {
      click: (e) => { console.log(e.detail); }
    }
  };
  
  whitelist$ = new BehaviorSubject<string[]>(['hello', 'world']);
  
  readonly = false;

  onAdd(tagify: any) {
    console.log('added a tag', tagify);  
  }
  
  onRemove(tags: any) {
    console.log('removed a tag', tags);
  }*/

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  constructor(private fb: FormBuilder, private _usersService: UsersService) {}

  ngOnInit() {
    this.initForm();
    this.updateParentModel({}, this.checkForm());
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

 private setInitialValue() {
    this.filteredUsuarios
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

 retrieveUsuarios(): void {
    this._usersService.getAll()
      .subscribe(
        (data: any) => {
            //console.log('usuarios',data);
          for (let index = 0; index < data.length; index++) {
            this.searchUsuarios.push({'id': data[index].id,'nombre': data[index].nombre, 'foto': '', 'correo': data[index].user.correo_login, 'existe': 1, negado: (data[index].tipo_plan == 'gratuito' && data[index].user.usuario_equipos.length > 0)});
            
          }
          
          this.usuarios = this.searchUsuarios;  
          this.filteredUsuarios.next(this.usuarios.slice());
        },
        error => {
          console.log(error);
        });
  }

  initForm() {
    
    this.retrieveUsuarios();

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


    this.filteredOptionsUsuario = this.myControl.valueChanges.pipe(
      startWith<string | Usuario>(''),
      map(value => typeof value === 'string' ? value : value.nombre),
      map(nombre => nombre ? this._filterUsuario(nombre) : this.searchUsuarios.slice()),
    );
  }

  onKey(event: any){
    this.busqueda = event.target.value;
    let filter: any = this._filterUsuario(event.target.value);
    this.filteredUsuarios.next(filter.slice());
  }

  private _filterUsuario(nombre: string): Usuario[] {
    const filterValue = nombre.toLowerCase();
    return this.searchUsuarios.filter(
      option => (
        (option.nombre != '' && option.nombre.toLowerCase().search(filterValue) >= 0) ||
        (option.correo != '' && option.correo.toLowerCase().search(filterValue) >= 0)
      )
    );
  }

  add(){
    const search_members = this.form.get('search_members')?.value;
    this.members.push({nombre: search_members, rol: 'Participante'});

    this.form.get('search_members')?.setValue('');
    this.form.get('members')?.setValue(this.members);
  }

  addItem(item: any){
    this.members.push({id: item.existe == 1 ? item.id : '', nombre: item.nombre, correo: item.correo, existe: item.existe, rol: 'Participante'});

    this.form.get('search_members')?.setValue('');
    this.form.get('members')?.setValue(this.members);
    this.busqueda = '';
    let filter: any = this._filterUsuario('');
    this.filteredUsuarios.next(filter.slice());
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
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
