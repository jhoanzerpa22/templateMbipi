import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewEncapsulation, Inject, Input, NgZone, Renderer2, HostListener
} from '@angular/core';/*
import { LayoutService } from './core/layout.service';
import { LayoutInitService } from './core/layout-init.service';*/
import * as $ from 'jquery';
import { SocketWebService } from '../boards-default/boards.service';
import { ProyectsService } from '../config-project-wizzard/proyects.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragMove, CdkDragEnd} from '@angular/cdk/drag-drop';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdeasComponent implements OnInit, AfterViewInit, OnDestroy {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  toolbarDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  asideDisplay: boolean;

  showTimer: boolean = false;

  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;
  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  
  //Lista de Usuarios
  usuarios: any = []; //usuarios
  usuarios_active: any = []; //usuarios activos
  usuario: any = {}; //usuario logueado

  recognition:any;
  
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
  dia_paso: any = 'dia4_paso3';
  tiempo_paso: any = '';

  showTimerPass: boolean = false;

  isLoading:boolean = true;
  video_url: any = 'http://res.cloudinary.com/tresideambipi/video/upload/v1659722491/videos/video_test_clgg4o.mp4'; 

  _user: any = {};
  equipo: any = [];

  public width: number = 50;
  public height: number = 50;

  private cx: CanvasRenderingContext2D;

  public isAvailabe: boolean = false;

  constructor(/*
  private initService: LayoutInitService,
  private layout: LayoutService*/
  private el:ElementRef,
  private socketWebService: SocketWebService,
  private _proyectsService: ProyectsService,
  private ref: ChangeDetectorRef,
  private modalService: NgbModal,
  private _router: Router,
  private route: ActivatedRoute
  ) {
    /*this.initService.init();*/

    //escuchamos el evento de usuarios activos
    this.socketWebService.outEvenUsersActive.subscribe((res: any) => {
      const { usuarios_active } = res;
      this.readUsersActive(usuarios_active, false);
    });

    //escuchamos el evento para continuar
    this.socketWebService.outEvenContinue.subscribe((res: any) => {
      this.continue();
    });

    //escuchamos el evento activo
    this.socketWebService.outEvenEtapaActive.subscribe((res: any) => {
      this.etapa_active(res);
    });

    //leemos usuario logueado
    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    //lo asignamos a variable
    this.usuario = user;
    this._user = user;
    this.usuario.active = true; // indicamos que esta activo

    const {webkitSpeechRecognition} : IWindow = <any>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onresult = (event: any)=> {
      console.log(this.el.nativeElement.querySelectorAll(".content")[0]);
      this.el.nativeElement.querySelectorAll(".content")[0].innerText = event.results[0][0].transcript

    };
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

  }

  ngAfterViewInit(): void {
    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[key] =
            this.headerHTMLAttributes[key];
        }
      }
    }

    //verificamos si el usuario logueado ya existe en el listado
    const index2 = this.usuarios_active.findIndex((c: any) => c.id == this.usuario.id);

    //si existe lo eliminamos y volvemos a agregarlo para evitar datos obsoletos
    if (index2 != -1) {
      this.usuarios_active.splice(index2, 1);
    }
    this.usuarios_active.push({'id': this.usuario.id, 'nombre': this.usuario.nombre, 'active': true});

    console.log('enviando_usuario',this.usuario);

    //this.socketWebService.emitEventUsers({usuarios: JSON.stringify(this.usuarios)});
    //enviamos al socket el usuario logueado
    this.socketWebService.emitEventUsersActive(this.usuario);

    //Inicia video y cancela scroll
    //this.onPlayPause();

    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    //si salimos de la pantalla indicamos que usuario salio
    console.log('ngdestroy');
    this.socketWebService.emitEventUsersInactive(this.usuario);
    this.socketWebService.ioSocket.disconnect();
    window.removeEventListener('scroll', this.disableScroll);
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
            this.showTimerPass = true;
              
              this.isLoading = false;

            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }

  //actualizamos lista de usuarios activos
  private readUsersActive(data: any, emit: boolean){
    const usuarios = JSON.parse(data);
    console.log('recibe_usuarios', usuarios);
    
    this.usuarios_active = usuarios;

    this.ref.detectChanges();
  }

  saveNoteAll() {
    
    const data_etapa = {etapa_activa: '/proyect-init/'+this.proyecto_id+'/fase44'};

    this._proyectsService.updateEtapaBosquejar(this.proyecto_id, data_etapa)
    .subscribe(
        data => {

          this.socketWebService.emitEventSetEtapa('/proyect-init/'+this.proyecto_id+'/fase44');

          this.socketWebService.emitEventTableroSaveBosquejar({});

        },
        (response) => {
        }
    );

    //this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase44']);
  }

  continue() {
    this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase44']);
  }

  etapa_active(etapa_active: any) {
    if(etapa_active != ''){
      this._router.navigate([etapa_active]);
    }
  }

  disableScroll(){
    window.scrollTo(0, 0);
  }

}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
