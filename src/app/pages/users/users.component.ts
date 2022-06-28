import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef,  OnDestroy, OnInit, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from './users.service';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector       : 'users',
    templateUrl    : './users.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy
{
    private usuarios: any = [];

    public filteredUsuarios: ReplaySubject<any> = new ReplaySubject<[]>(1);

    private _onDestroy = new Subject<void>();

    /**
     * Constructor
     */
    constructor(private _usersService: UsersService)
    {
    }

    ngOnInit(): void
    {

        this.retrieveUsuarios();

    }

    ngAfterViewInit() {
        this.setInitialValue();
      }

    /**
     * On destroy
     */
     ngOnDestroy(): void
     {
        this._onDestroy.next();
        this._onDestroy.complete();
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
            data => {
                //console.log('usuarios',data);
              this.usuarios = data;  
              this.filteredUsuarios.next(this.usuarios.slice());
            },
            error => {
              console.log(error);
            });
      }
    
}
