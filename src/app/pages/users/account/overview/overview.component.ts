import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef,  OnDestroy, OnInit, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { UsersService } from '../../users.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  
  user: any = [];
  id: any = '';

  constructor(
    private _usersService: UsersService,
    private _router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.id = params['id'];
      if(this.id > 0){
        this.getUser(params['id']);
      }
      
      });

  }

  getUser(id: any): void {
    this._usersService.get(id)
      .subscribe(
        data => {
          this.user = data;
          this.ref.detectChanges();
        },
        error => {
          console.log(error);
        });
  }

}
