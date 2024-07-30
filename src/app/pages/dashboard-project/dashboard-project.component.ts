import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef,  OnDestroy, OnInit, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectsService } from '../config-project-wizzard/proyects.service';
import Swal from 'sweetalert2';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { ProyectService } from './proyect.service';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  foto:string;
}

@Component({
  selector: 'app-dashboard-project',
  templateUrl: './dashboard-project.component.html',
  styleUrls: ['./dashboard-project.component.scss']
})
export class DashboardProjectComponent implements OnInit {

  public proyecto: any = {};
  public proyecto_id: any;
  public usuario: any = {};
  public usuarios: any = [];
  public miembros: any = [];
  public members: any = [];
  public rol: any = '';
  public avatar_img = '/assets/media/svg/avatars/blank-dark.svg';

  filteredOptionsUsuario: Observable<Usuario[]>;
  searchUsuarios: any[] = [];
  busqueda: any = '';

  public filteredUsuarios: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

  public activeClass: any = 'overview';

  public location: any = location.pathname.split("/")[3];

  parentMessage = "message from parent"

  form: FormGroup;
  isLoading: boolean = true;

  constructor(private ref: ChangeDetectorRef, private _proyectsService: ProyectsService,
    private _router: Router, private route: ActivatedRoute, private fb: FormBuilder, private _usersService: UsersService, private proyectService:ProyectService) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      search_members: ['']
    });

    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;
    
    this.searchOnchangeActive();

    //this.rol = user.roles[0];
    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      this.getProyect();
    });

  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private setInitialValue() {
    this.filteredUsuarios
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  onKey(event: any){
    this.busqueda = event.target.value;
    let filter: any = this._filterUsuario(event.target.value);
    this.filteredUsuarios.next(filter.slice());
  }

  private _filterUsuario(nombre: string): Usuario[] {
    const filterValue = nombre.toLowerCase();
    return this.searchUsuarios.filter(
      option => (
        (option.nombre != '' && option.nombre.toLowerCase().search(filterValue) >= 0) ||
        (option.correo != '' && option.correo.toLowerCase().search(filterValue) >= 0)
      )
    );
  }

  searchOnchangeActive() {
    this.proyectService._changes$.subscribe((resp:any) => {
  
        if (resp && resp == 'active') {
          this.getProyect();
        } 
      });
  }

 retrieveUsuarios(): void {
    this._usersService.getAll()
      .subscribe(
        (data: any) => {
          //console.log('usuarios',data);
          //this.usuarios = data;
          //this.filteredUsuarios.next(this.usuarios.slice());

          for (let index = 0; index < data.length; index++) {
            let index3 = this.miembros.findIndex((n: any) => n.usuario_id == data[index].login_id);

            if (index3 == -1 && this.usuario.id != data[index].id) {

              this.searchUsuarios.push({'id': data[index].login_id,'nombre': data[index].nombre, 'foto': '', 'correo': data[index].user.correo_login, 'existe': 1, negado: ((data[index].tipo_plan == 'gratuito' || !data[index].tipo_plan) && data[index].user.usuario_equipos.length > 0) });
            }

          }
          this.usuarios = this.searchUsuarios;
          this.filteredUsuarios.next(this.usuarios.slice());

        },
        error => {
          console.log(error);
        });
  }

  setActive(pestana:any){
    this.activeClass = pestana;
  }

  quitar(i: any){
    this.members.splice(i, 1);
  }

  eliminar(id: any){

  this._proyectsService.deleteMember(id)
  .subscribe(
      data => {
        this.getProyect();
        this.ref.detectChanges();
        Swal.fire({
          text: "Se ha quitado el usuario del proyecto exitosamente!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok!",
          customClass: {
            confirmButton: "btn btn-primary"
          }
        });
      },
      (response) => {
          // Reset the form
          //this.signUpNgForm.resetForm();
      }
  );
  }

  iniciar(){
    let fecha = new Date();
    const data = {estado: 'Iniciado', fecha_inicio: fecha, etapa_activa: '/proyect-init/'+this.proyecto_id+'/fase1'};
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
    let fecha_orig = new Date(fecha);
    let fecha_format = new Date(fecha_orig.toUTCString());

    var d = fecha_format.getDate()/* + 1*/;
    var m = strArray[fecha_format.getMonth()];
    var y = fecha_format.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + ' ' + m + ', ' + y;
}

  getProyect(){
    
    localStorage.setItem('proyecto_id', this.proyecto_id);

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.miembros = this.proyecto.proyecto_equipo.equipo_usuarios;
            let usuario_proyecto = this.miembros.filter(
              (op: any) => (
                op.usuario_id == this.usuario.id)
              );
            this.rol = usuario_proyecto[0].rol;
            this.retrieveUsuarios();
            this.ref.detectChanges();
            this.isLoading = false; 
          },
          (response) => {
              this.isLoading = false; 
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }
  
  imgError(ev: any){

    let source = ev.srcElement;
    let imgSrc = 'assets/media/svg/brand-logos/volicity-9.svg';

    source.src = imgSrc;
  }
  
  imgErrorUser(ev: any){

    let source = ev.srcElement;
    let imgSrc = 'assets/media/svg/avatars/blank-dark.svg';

    source.src = imgSrc;
  }

  add(){
    const search_members = this.form.get('search_members')?.value;
    this.members.push({nombre: search_members, rol: 'Participante'});

    this.form.get('search_members')?.setValue('');
  }

  addItem(item: any){
    let index = this.members.findIndex((n: any) => n.correo == item.correo);

    if(index != -1){
      Swal.fire({
        text: "Este Correo ya esta agregado.¡Por favor agregue otro!",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok!",
        customClass: {
          confirmButton: "btn btn-primary"
        }
      });
    }else{
      this.members.push({id: item.existe == 1 ? item.id : '', nombre: item.nombre, correo: item.correo, existe: item.existe, rol: 'Participante'});

      this.form.get('search_members')?.setValue('');
      this.form.get('members')?.setValue(this.members);
      this.busqueda = '';
      let filter: any = this._filterUsuario('');
      this.filteredUsuarios.next(filter.slice());
    }
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
