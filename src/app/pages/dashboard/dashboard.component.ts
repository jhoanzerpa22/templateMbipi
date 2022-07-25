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
  constructor(private ref:ChangeDetectorRef, private _proyectsService: ProyectsService) {}

  ngOnInit(): void {
    const usuario: any = localStorage.getItem('usuario');
      let user: any = JSON.parse(usuario);

      this._proyectsService.dashboard(user.id)
      .subscribe(
          (response) => {
            console.log(user);
            console.log(response);
            this.proyectos = response.proyectos;
            this.num_proyectos = response.proyectos.length;
            this.equipos = response.equipos;
            this.num_equipos = response.equipos.length;
            this.ref.detectChanges();
            console.log(this.proyectos);
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }
}
