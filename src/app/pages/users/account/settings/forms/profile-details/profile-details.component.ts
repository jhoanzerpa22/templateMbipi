import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef,  OnDestroy, OnInit, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UsersService } from '../../../../users.service';
import { RolService } from '../../../../rol.service';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  roles: any = [];
  user: any = [];
  id: any = '';
  private unsubscribe: Subscription[] = [];
  profileForm: FormGroup;

  public filteredRoles: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef, 
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private rolService: RolService,
    private _router: Router,
    private route: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
        this.getRoles();
        this.route.params.subscribe(params => {
          //console.log('params',params);
          this.id = params['id'];
          if(this.id > 0){
            this.profileForm = this._formBuilder.group({
              nombre      : ['', Validators.required],
              rut      : ['', Validators.required],
              correo_login    : ['', [Validators.required, Validators.email]],
              password  : ['', Validators.required],
              conf_password  : ['', Validators.required],
              fono   : [''],
              roles: ['', [Validators.required]]
            });
            this.getUser(params['id']);
          }else{
            this.profileForm = this._formBuilder.group({
              nombre      : ['', Validators.required],
              rut      : ['', Validators.required],
              correo_login    : ['', [Validators.required, Validators.email]],
              password  : ['', Validators.required],
              conf_password  : ['', Validators.required],
              fono   : [''],
              roles: ['', [Validators.required]]
            });
          }
          
    });
    
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

 private setInitialValue() {
    this.filteredRoles
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

    getRoles(): void {
      this.rolService.getAll()
        .subscribe(
          data => {
            this.roles = data;
            
            this.filteredRoles.next(this.roles.slice());
           // console.log(data);
          },
          error => {
            console.log(error);
          });
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
      this.profileForm.setValue({
          'nombre'          : data.nombre,
          'rut'      : data.rut,
          'correo_login'      : data.user.correo_login,
          'password'      : '********',
          'conf_password' : '********',
          'fono'      : data.fono,
          'roles': data.user.roles.length > 0 ? data.user.roles[0].id : '',
      });
  }

  saveSettings() {
    if ( this.profileForm.invalid )
         {
             return;
         }

    this.isLoading$.next(true);

    const val = this.profileForm.value;
    let data_general = {};
    if(this.id){

      
      if(val.password != val.conf_password && (val.password != '********' || val.conf_password != '********')){
    
      }else{

        if(val.password != val.conf_password){
          
          data_general = {
            'nombre'          : val.nombre,
            'rut'      : val.rut,
            'correo_login' : val.correo_login.toLowerCase(),
            'password' : val.password,
            'fono'   : val.fono,
            'roles'   : val.roles
          }
        }else{
          
          data_general = {
            'nombre'          : val.nombre,
            'rut'      : val.rut,
            'correo_login' : val.correo_login.toLowerCase(),
            'fono'   : val.fono,
            'roles'   : val.roles
          }
        }
      
    this._usersService.update(this.id, data_general)
      .subscribe(
          (response) => {
              this.isLoading$.next(false);
              this.cdr.detectChanges();
              // Navigate to the confirmation required page
              this._router.navigateByUrl('/users');
          },
          (response) => {

              // Re-enable the form
              this.isLoading$.next(false);
              this.cdr.detectChanges();
              this.profileForm.enable();

              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
      }

  }else{

      if(val.password != val.conf_password){
    
        }else{
          const data_general:any = {
              'nombre'          : val.nombre,
              'rut'      : val.rut,
              'correo_login' : val.correo_login.toLowerCase(),
              'password' : val.password,
              'fono'   : val.fono,
              'roles'   : val.roles
            }

          this._usersService.create(data_general)
          .subscribe(
              (response) => {
                  // Navigate to the confirmation required page
                  this.isLoading$.next(false);
                  this.cdr.detectChanges();
                  this._router.navigateByUrl('/users');
              },
              (response) => {

                  // Re-enable the form
                  this.profileForm.enable();
                  this.isLoading$.next(false);
                  this.cdr.detectChanges();

                  // Reset the form
                  //this.signUpNgForm.resetForm();
              }
          );
        }
      }
    
    /*setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);*/
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
