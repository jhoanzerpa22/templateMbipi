import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef,  OnDestroy, OnInit, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectsService } from '../config-project-wizzard/proyects.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-project',
  templateUrl: './dashboard-project.component.html',
  styleUrls: ['./dashboard-project.component.scss']
})
export class DashboardProjectComponent implements OnInit {

  public proyecto: any = {};
  public proyecto_id: number;
  public usuario: any = {};
  public usuarios: any = [];
  public members: any = [];
  public rol: any = '';

  public activeClass: any = 'overview';

  public location: any = location.pathname.split("/")[3];

  parentMessage = "message from parent"

  form: FormGroup;

  constructor(private ref: ChangeDetectorRef, private _proyectsService: ProyectsService,
    private _router: Router,
    private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      search_members: ['']
    });

    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;

    //this.rol = user.roles[0];
    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      this.getProyect();
    });


  }

  setActive(pestana:any){
    this.activeClass = pestana;
  }

  iniciar(){
    let fecha = new Date();
    const data = {estado: 'Iniciado', fecha_inicio: fecha, etapa_activa: '/proyect-init/'+this.proyecto_id};
    this._proyectsService.updateStatus(this.proyecto_id, data)
    .subscribe(
        data => {
            this._router.navigate(['/proyect-init/'+this.proyecto_id]);
        },
        (response) => {
        }
    );
  }

  /*getFecha(fecha: any) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    
      let fecha_format = new Date(fecha).toLocaleDateString("en-US", options);      
      return fecha_format;
  }*/

  getFecha(fecha: any) {
    var strArray=['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let fecha_format = new Date(fecha);
    var d = fecha_format.getDate() + 1;
    var m = strArray[fecha_format.getMonth()];
    var y = fecha_format.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + ' ' + m + ', ' + y;
}

  getProyect(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.usuarios = this.proyecto.proyecto_equipo.equipo_usuarios;
            let usuario_proyecto = this.usuarios.filter(
              (op: any) => (
                op.usuario_id == this.usuario.id)
              );
            this.rol = usuario_proyecto[0].rol;
            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }

  add(){
    const search_members = this.form.get('search_members')?.value;
    this.members.push({nombre: search_members, rol: 'Participante'});

    this.form.get('search_members')?.setValue('');
  }

  changeRol($event: any, i: any){
    this.members[i].rol = $event.target.value;
  }

  invitar(){

    const usuario: any = localStorage.getItem('usuario');
      let user: any = JSON.parse(usuario);

    const data = {invitados: this.members, equipo_id: this.proyecto.equipo_id};
    this._proyectsService.updateMembers(this.proyecto_id, data)
    .subscribe(
        data => {
          const datos = { nombre_usuario: user.nombre, nombre: this.proyecto.nombre, code: this.proyecto.code, emails: this.members};

          this.members = [];
            this._proyectsService.invitations(datos)
            .subscribe(
                (response) => {
                  Swal.fire({
                    text: "Se ha enviado la invitación exitosamente!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok!",
                    customClass: {
                      confirmButton: "btn btn-primary"
                    }
                  });
                });

          this.getProyect();
          this.ref.detectChanges();
        },
        (response) => {
            // Reset the form
            //this.signUpNgForm.resetForm();
        }
    );
  }

}
