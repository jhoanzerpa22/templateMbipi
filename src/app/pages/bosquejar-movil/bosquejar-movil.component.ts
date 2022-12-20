import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { SocketWebService } from '../boards-default/boards.service';
import { ProyectsService } from '../config-project-wizzard/proyects.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ReplaySubject, Subject,BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
//import {maxlengthContentEditable} from 'maxlength-contenteditable';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { environment } from "../../../environments/environment";
import Swal from 'sweetalert2';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-bosquejar-movil',
  templateUrl: './bosquejar-movil.component.html',
  styleUrls: ['./bosquejar-movil.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BosquejarMovilComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  @ViewChild('tableroRef', { static: false }) tableroRef: ElementRef;

  _user: any = {};
  equipo: any = [];

  etapa: any = 'bosquejar-movil';
  fase: any = '';

  public filteredTablero: ReplaySubject<any> = new ReplaySubject<[]>(1);
  public filteredNotas: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

    public width: number = 50;
    public height: number = 50;

    private cx: CanvasRenderingContext2D;

    private points: Array<any> = [];

    public isAvailabe: boolean = false;

    showVideoFlag = true;
    showTimer: boolean = false;

  //Clases para esconder o mostrar video.
  videoOn = "videoOn";
  videoOff = "videoOff";
  currentTime = 0;

  //Eventos sobre video
  primerEventoFlag = false;
  segundoEventoFlag = false;
  playing = false;

  usuarios: any = [];
  usuarios_active: any = [];
  usuario: any = {};
  usuario_id: any = '';

  public proyecto: any = {};
  public proyecto_id: number;
  public rol: any = '';

  ms:any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  isLoading: boolean = true;

  necesidades_d: any = [];
  necesidades_m: any = [];
  propositos: any = [];
  objetivos_c: any = [];
  objetivos_l: any = [];
  acciones: any = [];
  metricas: any = [];

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  urlQr: any = '';
  showQr: boolean = false;

  files: File[] = [];
  recursos: any = [];
  files_base: any = [];
  selectedFile: File;

  private unsubscribe: Subscription[] = [];
  //isLoading$: Observable<boolean>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

onSelect(event: any) {
  console.log(event);
  this.files.push(...event.addedFiles);
  
  this.ref.detectChanges();
}

onRemove(event: any) {
  console.log(event);
  this.files.splice(this.files.indexOf(event), 1);
}

  constructor(
    private route: ActivatedRoute,
    private socketWebService: SocketWebService,
    private _proyectsService: ProyectsService,
    private el:ElementRef,
    private ref: ChangeDetectorRef,
    private _router: Router
  ) {

    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.socketWebService.outEvenRefresh.subscribe((res: any) => {
      this.refresh();
    });

    this.route.queryParams.subscribe(params => {
    this.usuario_id = params['usuario_id'];
    });
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

  ngAfterViewInit() {

    this.ref.detectChanges();
  }

  ngOnDestroy() {
    console.log('ngdestroy');
    //this.socketWebService.emitEventUsersInactive(this.usuario);

    //this.socketWebService.ioSocket.disconnect();

    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getFileUser(usuario_id: any){
    let usuario_file: any = this.recursos.findIndex((c: any) => c.usuario_id == usuario_id);
    if(usuario_file != -1){
      return true;
    }
    return false;
  }

  enviar(){
    
    this.isLoading$.next(true);
    //for(let f in this.files){
      console.log('files:',this.files);
    /*const data: any = {
      'files': JSON.stringify(this.files),
      'usuario_id': this.usuario.id,
      'proyecto_id': this.proyecto_id
    };*/
    this._proyectsService./*saveFiles*/uploadMulti(this.files, this.proyecto_id, this.usuario_id)
      .subscribe(
          data => {
            Swal.fire({
              text: "Archivos subidos exitosamente!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok!",
              customClass: {
                confirmButton: "btn btn-primary"
              }
            });
            this.socketWebService.emitEventRefresh();
            this.isLoading$.next(false);
            //this.socketWebService.emitEventSetEtapa('/proyect-init/'+this.proyecto_id+'/fase25');
            console.log('data_resp',data);
          },
          (response) => {
            this.isLoading$.next(false);
            console.log('error_resp',response);
          }
      );
    //}
  }

  refresh(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.usuarios = this.proyecto.proyecto_equipo.equipo_usuarios;

            let imagenes: any = [];
            
            for(let c in this.proyecto.proyecto_recursos){
              if(this.proyecto.proyecto_recursos[c].cloud_user != null){
                
                 imagenes.push({'id': this.proyecto.proyecto_recursos[c].cloud_user.id,'name': this.proyecto.proyecto_recursos[c].cloud_user.name, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
              }
            }

            this.recursos = imagenes;

            this.ref.detectChanges();
          },
          (response) => {
          }
      );
  }

  getProyect(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.usuarios = this.proyecto.proyecto_equipo.equipo_usuarios;
            let usuario_proyecto = this.usuarios.filter(
              (op: any) => (
                op.usuario_id == this.usuario_id)
              );
            this.rol = usuario_proyecto[0].rol;

            let imagenes: any = [];
            
            for(let c in this.proyecto.proyecto_recursos){
              if(this.proyecto.proyecto_recursos[c].cloud_user != null){
                
                 imagenes.push({'id': this.proyecto.proyecto_recursos[c].cloud_user.id,'name': this.proyecto.proyecto_recursos[c].cloud_user.name, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
              }
            }

            this.recursos = imagenes;

            this.isLoading = false; 
            this.ref.detectChanges();
          },
          (response) => {
          }
      );
  }
  
  disableScroll(){
    window.scrollTo(0, 0);
  }

  hideVideo(){
    this.showVideoFlag = false;
  }

}
