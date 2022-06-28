import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef,  OnDestroy, OnInit, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UsersService } from '../../../../users.service';
import { RolService } from '../../../../rol.service';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  roles: any = [];
  private unsubscribe: Subscription[] = [];
  profileForm: FormGroup;

  public filteredRoles: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef, 
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private rolService: RolService) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.getRoles();
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

  saveSettings() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
