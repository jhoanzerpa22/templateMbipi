import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { InvitationsService } from './invitations.service';
import { Location } from '@angular/common';
import { UsersService } from '../users/users.service';
import Swal from 'sweetalert2';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']/*,
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush*/
})
export class InvitationsComponent implements OnInit, AfterViewInit {

  invitation: any;
  invitaciones: any = [];

  newUser: any;

  public filteredInvitaciones: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private ref:ChangeDetectorRef,
    private _invitationsService: InvitationsService,
    private _userService: UsersService,
    public _location: Location

  ) {
   }

  ngOnInit(): void {
    this.getInvitations();
    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    console.log(user.id)
    this._userService.get(user.id)
      .subscribe(
        (response) =>{
          // console.log(response);
          this.newUser = response.tipo_plan;
          // console.log(this.newUser);
        }
      )

  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private setInitialValue() {
    this.filteredInvitaciones
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  getInvitations(){
    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);

    this._invitationsService.getByEmail(user.correo_login)
    .subscribe(
        data => {
          this.invitaciones = data;
          this.filteredInvitaciones.next(this.invitaciones.slice());
          this.ref.detectChanges();
        },
        (response) => {
            // Reset the form
            //this.signUpNgForm.resetForm();
        }
    );
  }

  aceptar(i: any, id: any){

    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);

    const data = {participante: true, usuario_id: user.id};
    this._invitationsService.update(id, data)
    .subscribe(
        data => {
          this.invitaciones.splice(i, 1);
          this.filteredInvitaciones.next(this.invitaciones.slice());
          this.ref.detectChanges();
          /*this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
          this.router.navigate(['/invitations']));
          */
          location.reload();
          /*this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
            console.log(decodeURI(this._location.path()));
            this.router.navigate([decodeURI(this._location.path())]);
            });*/

        },
        (response) => {
            // Reset the form
            //this.signUpNgForm.resetForm();
        }
    );
  }

  rechazar(i: any, id: any){
    this._invitationsService.delete(id)
    .subscribe(
        data => {
          this.invitaciones.splice(i, 1);
          this.filteredInvitaciones.next(this.invitaciones.slice());
          this.ref.detectChanges();
        },
        (response) => {
            // Reset the form
            //this.signUpNgForm.resetForm();
        }
    );
  }

  isNewUser(){
    if(!this.newUser){
      Swal.fire({
        text: "Debes configurar tu cuenta antes de continuar a tu dashboard",
        icon: "warning",
        buttonsStyling: false,
        confirmButtonText: "Ok!",
        customClass: {
          confirmButton: "btn btn-primary"
        }
      }).then(()=>{
        this.router.navigate(['/crafted/pages/wizards/config-cta'])
      });
    }
    else{
      this.router.navigate(['/dashboard'])
    }
  }
}
