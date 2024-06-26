import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { SocketWebService } from '../boards-default/boards.service';
import { ProyectsService } from '../config-project-wizzard/proyects.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
//import {maxlengthContentEditable} from 'maxlength-contenteditable';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-lean',
  templateUrl: './lean.component.html',
  styleUrls: ['./lean.component.scss'],
  //encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeanComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  @ViewChild('tableroRef', { static: false }) tableroRef: ElementRef;

  _user: any = {};
  equipo: any = [];

  etapa: any = 'lean';
  fase: any = '';

  public filteredTablero: ReplaySubject<any> = new ReplaySubject<[]>(1);
  public filteredNotas: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

    public width: number = 50;
    public height: number = 50;

    private cx: CanvasRenderingContext2D;

    private points: Array<any> = [];

    public isAvailabe: boolean = false;

    showTimer: boolean = false;

  usuarios: any = [];
  usuarios_active: any = [];
  usuario: any = {};

  public proyecto: any = {};
  public proyecto_id: number;
  public rol: any = '';

  ms:any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  ms_paso:any = '0' + 0;
  sec_paso: any = '0' + 0;
  min_paso: any = '0' + 0;
  hr_paso: any = '0' + 0;
  dia_paso: any = 'dia3_paso9';
  tiempo_paso: any = '';

  showTimerPass: boolean = false;

  isLoading: boolean = true;
  video_url: any = 'http://res.cloudinary.com/tresideambipi/video/upload/v1659722491/videos/video_test_clgg4o.mp4'; 

  problema: any = [];
  solucion: any = [];
  propuesta: any = [];
  ventajas: any = [];
  metricas: any = [];
  clientes: any = [];
  canales: any = [];
  flujos: any = [];
  estructuras: any = [];

  constructor(
    private route: ActivatedRoute,
    private socketWebService: SocketWebService,
    private _proyectsService: ProyectsService,
    private el:ElementRef,
    private ref: ChangeDetectorRef,
    private _router: Router
  ) {
    this.socketWebService.outEvenUsersActive.subscribe((res: any) => {
      const { usuarios_active } = res;
      this.readUsersActive(usuarios_active, false);
    });

    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;
    this.usuario.active = true;

  }

  ngOnInit(): void {

    //Buscar etapa activa
    //this.socketWebService.emitEventGetEtapa();

    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      this.getProyect();
    });
    
    this.socketWebService.ioSocket.connect();
    this.socketWebService.emitLogin(this.proyecto_id);

    const usuario: any = localStorage.getItem('usuario');
    this._user = JSON.parse(usuario);
    //this.board = this.route.snapshot.paramMap.get('board');
    //this.cookieService.set('board', this.board)
  }

  ngAfterViewInit() {

    const index2 = this.usuarios_active.findIndex((c: any) => c.id == this.usuario.id);

    if (index2 != -1) {
      this.usuarios_active.splice(index2, 1);
    }
    this.usuarios_active.push({'id': this.usuario.id, 'nombre': this.usuario.nombre, 'active': true});

    console.log('enviando_usuario',this.usuario);

    //this.socketWebService.emitEventUsers({usuarios: JSON.stringify(this.usuarios)});
    this.socketWebService.emitEventUsersActive(this.usuario);

    this.ref.detectChanges();
  }

  ngOnDestroy() {
    console.log('ngdestroy');
    this.socketWebService.emitEventUsersInactive(this.usuario);

    this.socketWebService.ioSocket.disconnect();

    this._onDestroy.next();
    this._onDestroy.complete();
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

            if(this.proyecto.tiempo != '' && this.proyecto.tiempo != undefined){
              let tiempo = this.proyecto.tiempo.split(':');
              this.hr = tiempo[0];
              this.min = tiempo[1];
            }
            this.showTimer = true;
            
            if(this.proyecto.tiempo_paso != '' && this.proyecto.tiempo_paso != undefined){
              this.tiempo_paso = this.proyecto.tiempo_paso;
              
              const time_proyect = JSON.parse(this.tiempo_paso);

              if (time_proyect.hasOwnProperty(this.dia_paso)) {
                
                let tiempo_paso_dia = time_proyect[this.dia_paso].split(':');
                this.hr_paso = tiempo_paso_dia[0];
                this.min_paso = tiempo_paso_dia[1];
              }
            }
            this.showTimerPass = false;
            
            let problema: any = [];
            let solucion: any = [];
            let propuesta: any = [];
            let ventajas: any = [];
            let metricas: any = [];
            let clientes: any = [];
            let canales: any = [];
            let flujos: any = [];
            let estructuras: any = [];
            
            for(let c in this.proyecto.proyecto_recursos){
              if(this.proyecto.proyecto_recursos[c].leancanvas_problema != null){
                 problema.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_problema.id,'content': this.proyecto.proyecto_recursos[c].leancanvas_problema.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
                
              }  

              if(this.proyecto.proyecto_recursos[c].leancanvas_solucion != null){
                 solucion.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_solucion.id,'content': this.proyecto.proyecto_recursos[c].leancanvas_solucion.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
              }

              if(this.proyecto.proyecto_recursos[c].leancanvas_propuestum
                != null){
                 propuesta.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_propuestum
                 .id,'content': this.proyecto.proyecto_recursos[c].leancanvas_propuestum
                 .contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
              }

              if(this.proyecto.proyecto_recursos[c].leancanvas_ventaja != null){
                 ventajas.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_ventaja.id,'content': this.proyecto.proyecto_recursos[c].leancanvas_ventaja.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
                
              }

              if(this.proyecto.proyecto_recursos[c].leancanvas_metrica != null){
                 metricas.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_metrica.id,'content': this.proyecto.proyecto_recursos[c].leancanvas_metrica.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
              }

              if(this.proyecto.proyecto_recursos[c].leancanvas_cliente != null){
                 clientes.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_cliente.id,'content': this.proyecto.proyecto_recursos[c].leancanvas_cliente.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
                
              }

              if(this.proyecto.proyecto_recursos[c].leancanvas_canale != null){
                 canales.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_canale.id,'content': this.proyecto.proyecto_recursos[c].leancanvas_canale.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
                
              }

              if(this.proyecto.proyecto_recursos[c].leancanvas_flujo != null){
                 flujos.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_flujo.id,'content': this.proyecto.proyecto_recursos[c].leancanvas_flujo.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
              }

              if(this.proyecto.proyecto_recursos[c].leancanvas_estructura != null){
                 estructuras.push({'id': this.proyecto.proyecto_recursos[c].leancanvas_estructura.id,'content': this.proyecto.proyecto_recursos[c].leancanvas_estructura.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
                
              }
            }
            
            this.problema = problema;
            this.solucion = solucion;
            this.propuesta = propuesta;
            this.ventajas = ventajas;
            this.metricas = metricas;
            this.clientes = clientes;
            this.canales = canales;
            this.flujos = flujos;
            this.estructuras = estructuras;

            this.isLoading = false; 

            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }

  private readUsersActive(data: any, emit: boolean){
    const usuarios = JSON.parse(data);
    console.log('recibe_usuarios', usuarios);
    this.usuarios_active = usuarios;

    this.ref.detectChanges();
  }
  
  continue() {
    this._router.navigate(['/proyect-init/'+this.proyecto_id]);
  }

  disableScroll(){
    window.scrollTo(0, 0);
  }

}
