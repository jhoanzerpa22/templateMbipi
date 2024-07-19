import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef,  OnDestroy, OnInit, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UsersService } from '../../../../users.service';
import { RolService } from '../../../../rol.service';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import {Location} from '@angular/common';

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

  imgView: any;
  selectedFile: any;
  pdfURL: any;
  imgOld: any;

  imageChangedEvent: any = '';
  imageChange: boolean = false;
  
  private unsubscribe: Subscription[] = [];
  profileForm: FormGroup;

  public filteredRoles: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef, 
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private rolService: RolService,
    private _router: Router,
    private route: ActivatedRoute, 
    private _location: Location) {
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
              roles: ['', [Validators.required]],
              foto: ['']
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
              roles: ['', [Validators.required]],
              foto: ['']
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
          'foto': ''
      });
      
      if(data.img != null && data.img != ''){
        this.imgOld = data.img;
        this.imgView = /*data.cloud_user ? data.cloud_user.secure_url : ''*/ data.img;
        this.cdr.detectChanges();
      }
  }

  onFileSelected(event: any){

    this.imageChangedEvent = event;
    this.selectedFile = <File>event.target.files[0];
  
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (_event) => {
      console.log(reader.result);
      this.imgView = reader.result;
      this.imageChange = true;
      //this.pdfURL = this.selectedFile.name;
      //this.formUsuario.controls['img'].setValue(this.selectedFile);
      }
  }  

  imgError(ev: any){

    let source = ev.srcElement;
    let imgSrc = 'assets/media/avatars/300-1.jpg';

    source.src = imgSrc;
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
            'roles'   : val.roles,
            'img': this.imgOld,
            'img_changed': this.imageChange
          }
        }else{
          
          data_general = {
            'nombre'          : val.nombre,
            'rut'      : val.rut,
            'correo_login' : val.correo_login.toLowerCase(),
            'fono'   : val.fono,
            'roles'   : val.roles,
            'img': this.imgOld,
            'img_changed': this.imageChange
          }
        }

        const formData2 = new FormData();
     
        formData2.append("file", this.selectedFile);
        
        formData2.append('data', JSON.stringify(data_general));
      
    this._usersService.update(this.id, formData2)
      .subscribe(
          (response) => {
              this.isLoading$.next(false);
              this.cdr.detectChanges();
              // Navigate to the confirmation required page
              //this._router.navigateByUrl('/users');
              this._location.back();
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
              'roles'   : val.roles,
              'img_changed': this.imageChange
            }

            const formData = new FormData();
     
            formData.append("file", this.selectedFile);
            
            formData.append('data', JSON.stringify(data_general));

          this._usersService.create(formData)
          .subscribe(
              (response) => {
                  // Navigate to the confirmation required page
                  this.isLoading$.next(false);
                  this.cdr.detectChanges();
                  //this._router.navigateByUrl('/users');    
                  this._location.back();
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
