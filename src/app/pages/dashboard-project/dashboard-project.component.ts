import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef,  OnDestroy, OnInit, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';


import { ProyectsService } from '../config-project-wizzard/proyects.service';

@Component({
  selector: 'app-dashboard-project',
  templateUrl: './dashboard-project.component.html',
  styleUrls: ['./dashboard-project.component.scss']
})
export class DashboardProjectComponent implements OnInit {

  public proyecto: any = {};
  public proyecto_id: number;

  constructor(private ref: ChangeDetectorRef, private _proyectsService: ProyectsService,
    private _router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {            
            this.proyecto = response;
            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
    });
  }

}
