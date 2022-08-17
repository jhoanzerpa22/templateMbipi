import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy, CommonModule} from '@angular/common';
import { LayoutService } from '../../core/layout.service';
import { ProyectsService } from '../../../../pages/config-project-wizzard/proyects.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;
  pageTitleAttributes: {
    [attrName: string]: string | boolean;
  };
  toolbarContainerCssClasses: string = '';
  pageTitleCssClasses: string = '';
  location: Location;
  num_proyectos: number;
  max_proyects: boolean = false;

  constructor(private layout: LayoutService,
              private _proyectsService: ProyectsService,
              private router: Router,
              location: Location) {
              this.location = location;
    }

  ngOnInit(): void {
    this.toolbarContainerCssClasses = this.layout.getStringCSSClasses('toolbarContainer');
    this.pageTitleCssClasses = this.layout.getStringCSSClasses('pageTitle');
    this.pageTitleAttributes = this.layout.getHTMLAttributes('pageTitle');
    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this._proyectsService.dashboard(user.id, user.correo_login)
      .subscribe(
        (response)=>{
          this.num_proyectos = response.length;
          console.log(this.num_proyectos);
        }
      );

  }

  ngAfterViewInit() {
    if (this.ktPageTitle) {
      for (const key in this.pageTitleAttributes) {
        if (
          this.pageTitleAttributes.hasOwnProperty(key) &&
          this.ktPageTitle.nativeElement
        ) {
          this.ktPageTitle.nativeElement.attributes[key] =
            this.pageTitleAttributes[key];
        }
      }
    }
  }

  createProyect(){

    if(this.num_proyectos >= 2){
      // ALERT NO SE PUEDE CREAR PROYECTO, UPGRADEAR CUENTA
      this.max_proyects = true;
      Swal.fire({
        text: "Ups, debes suscribirte a Plan-Pro para crear más de 2 proyectos.",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok!",
        customClass: {
          confirmButton: "btn btn-primary"
        }
      });
    }
    else{
      this.router.navigate(['/crafted/pages/wizards/project'])
    }

  }
}
