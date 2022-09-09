import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProyectsService } from '../config-project-wizzard/proyects.service';
import { elementAt, filter } from 'rxjs/operators';
import { map } from 'rxjs';
import { UsersService } from '../users/users.service';

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

  public arrayProyectos: any = [];

  public sinIniciarLength:number=0
  public iniciadoLength:number=0
  public completadoLength:number=0

  public idEquiposArray:any;
  public correoMiembrosEquipoList:any;

  public avatar_img = '/assets/media/avatars/300-1.jpg'

  constructor(
    private ref:ChangeDetectorRef,
    private _proyectsService: ProyectsService,
    private _userService: UsersService
  ) {}

  ngOnInit(): void {
    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;
    this._proyectsService.dashboard(user.id, user.correo_login)
    .subscribe(
        (response) => {

          this.proyectos = response;
          this.num_proyectos = response.length;
          this.equipos = response;
          console.log(response);
          //Arreglo de arreglo de proyectos
          this.arrayProyectos=this.proyectos.map((element:any)=>element.equipos_equipo).map((element:any)=>element.equipo_proyecto);
          this.estadoProyectCount(this.arrayProyectos);
          this.idEquiposArray=this.proyectos.map((element:any)=>element.equipos_equipo).map((element:any)=>element.equipo_usuarios);
          this.correoMiembrosEquipoList = this.allProyectMembersList(this.idEquiposArray);
          // console.log(this.arrayProyectos);
          // console.log(this.correoMiembrosEquipoList);

          this.ref.detectChanges();
        },
        (response) => {
            // Reset the form
            //this.signUpNgForm.resetForm();
        }
    );

  }
  //Cuenta numero de proyectos sin iniciar, iniciados y completados
  estadoProyectCount(arrayProyectos:any){
    for(let i of arrayProyectos){
      if(i[0].estado == 'Sin Iniciar'){
        this.sinIniciarLength +=1
      }
      else if(i[0].estado == 'Iniciado'){
        this.iniciadoLength +=1
      }
      else if(i[0].estado == 'Compleado'){
        this.completadoLength +=1
      }
    }
    // console.log(this.sinIniciarLength);
    // console.log(this.iniciadoLength);
    // console.log(this.completadoLength);
  }

  allProyectMembersList(idEquiposArray:any){
    let correoMiembrosEquipo:any = [];
    for (let i of idEquiposArray){
      // console.log(i[0].correo);

      for (let j of i){
        let index = correoMiembrosEquipo.findIndex((c: any) => c.correo == j.correo);

        if (index == -1) {
          correoMiembrosEquipo.push(j);
        }
      }
    }

    this.num_equipos = correoMiembrosEquipo.length;
    return new Set(correoMiembrosEquipo);

  }

  getFecha(fecha: any) {
    var strArray=['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let fecha_format = new Date(fecha);
    var d = fecha_format.getDate() + 1;
    var m = strArray[fecha_format.getMonth()];
    var y = fecha_format.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + ' ' + m + ', ' + y;
}

}
