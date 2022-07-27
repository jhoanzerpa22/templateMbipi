import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProyectsService } from '../config-project-wizzard/proyects.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public proyectos: any = [];
  public num_proyectos: number = 0;
  public equipos: any = [];
  public num_equipos: number = 0;
  public usuario: any = {};
  constructor(private ref:ChangeDetectorRef, private _proyectsService: ProyectsService) {}

  ngOnInit(): void {
    const usuario: any = localStorage.getItem('usuario');
      let user: any = JSON.parse(usuario);
    this.usuario = user;
      this._proyectsService.dashboard(user.id, user.correo_login)
      .subscribe(
          (response) => {/*
            console.log(user);
            console.log(response);*/
            this.proyectos = response;
            this.num_proyectos = response.length;
            this.equipos = response;
            this.num_equipos = response.length;
            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }
}
