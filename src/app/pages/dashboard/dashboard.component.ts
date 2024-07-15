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

  dias: number = 0;
  completadas: number = 0;
  
  public idEquiposArray:any;
  public correoMiembrosEquipoList:any;

  public avatar_img = '/assets/media/avatars/300-1.jpg'
  isLoading: boolean = true;

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

          this.isLoading = false;
          this.ref.detectChanges(); 
        },
        (response) => {
          this.isLoading = false; 
            // Reset the form
            //this.signUpNgForm.resetForm();
        }
    );

  }

  getDias(etapa_activa: any){
    let dias: number = 6;
    let curso: number = 0;
    let completadas: number = 0;
    let fase_final: any = '';
    if(etapa_activa){
      const numerosFinales = etapa_activa.match(/\d+$/);
      const partes = etapa_activa.split("/");
      const ultimaFase = partes[partes.length - 1];
    
      if (numerosFinales || (ultimaFase == 'scope' || ultimaFase == 'lean' ||ultimaFase == 'uploadFileProyect')) {

        switch (ultimaFase) {
          case 'scope':
            fase_final = 23;
            break;
            case 'lean':
              fase_final = 41;
              break;
              case 'uploadFileProyect':
                fase_final = 45;
                break;
        
          default:
            fase_final = numerosFinales[0];
            break;
        }

        console.log('etapa',);

          if(fase_final > 0){

            curso = 1;
     
            if(fase_final > 8){

              completadas ++;
            
            }

            if(fase_final > 22){

              completadas ++;
            
            }

            if(fase_final > 40){

              completadas ++;
            
            }

            if(fase_final > 46){

              completadas ++;
            
            }
            
            if(fase_final > 48){

              completadas ++;
            
            }

          }

          dias = dias - (completadas + curso);
      }
    }

    this.dias += dias;
    this.completadas += completadas;
  }

  getCompleted(etapa_activa: any){
    let dias: number = 6;
    let curso: number = 0;
    let completadas: number = 0;
    let fase_final: any = '';
    if(etapa_activa){
      const numerosFinales = etapa_activa.match(/\d+$/);
      const partes = etapa_activa.split("/");
      const ultimaFase = partes[partes.length - 1];
    
      if (numerosFinales || (ultimaFase == 'scope' || ultimaFase == 'lean' ||ultimaFase == 'uploadFileProyect')) {

        switch (ultimaFase) {
          case 'scope':
            fase_final = 23;
            break;
            case 'lean':
              fase_final = 41;
              break;
              case 'uploadFileProyect':
                fase_final = 45;
                break;
        
          default:
            fase_final = numerosFinales[0];
            break;
        }

          if(fase_final > 0){

            curso = 1;
     
            if(fase_final > 8){

              completadas ++;
            
            }

            if(fase_final > 22){

              completadas ++;
            
            }

            if(fase_final > 40){

              completadas ++;
            
            }

            if(fase_final > 46){

              completadas ++;
            
            }
            
            if(fase_final > 48){

              completadas ++;
            
            }

          }

          dias = dias - (completadas + curso);
      }
    }

    return Math.round((completadas / 6) * 100);
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

      this.getDias(i[0].etapa_activa);

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
    var d = fecha_format.getDate()/* + 1*/;
    var m = strArray[fecha_format.getMonth()];
    var y = fecha_format.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + ' ' + m + ', ' + y;
}

imgError(ev: any){

  let source = ev.srcElement;
  let imgSrc = 'assets/media/svg/brand-logos/plurk.svg';

  source.src = imgSrc;
}

}
