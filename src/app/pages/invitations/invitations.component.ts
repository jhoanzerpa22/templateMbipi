import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { InvitationsService } from './invitations.service';

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
  private invitaciones: any = [];
  
  public filteredInvitaciones: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private ref:ChangeDetectorRef,
    private _invitationsService: InvitationsService
  ) {
   }

  ngOnInit(): void {
    this.getInvitations();
    
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
    const data = {participante: true};
    this._invitationsService.update(id, data)
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
}
