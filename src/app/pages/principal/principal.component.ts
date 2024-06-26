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
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal2.component.scss'],
  //encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrincipalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  @ViewChild('tableroRef', { static: false }) tableroRef: ElementRef;

  board: string;

  notas: any = [];

  tablero: any = [];
  tablero2: any = [];
  votos: any = [];
  voto_tablero: any = [];
  voto_maximo: any = [];
  _user: any = {};
  equipo: any = [];

  etapa: any = 'principal';
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

  public proyecto: any = {};
  public proyecto_id: number;
  public rol: any = '';

  ms:any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  isLoading: boolean = true;
  mostrarTexto: boolean = false;

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
    
    this.route.queryParams.subscribe(params2 => {
      const etapa = params2['etapa'];
      console.log('Etapa:', etapa);
      this.etapa = etapa && etapa != '' && etapa != undefined ? etapa : 'principal';
      this.ref.detectChanges();
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

  mostrarTextoCompleto() {
    this.mostrarTexto = true;
  }

  mostrarInicial() {
    this.mostrarTexto = false;
  }

  getTimePass(dia_paso: any){
    let tiempo_paso_dia_format = '00:00';

    if(this.proyecto.tiempo_paso != '' && this.proyecto.tiempo_paso != undefined){
      const tiempo_paso = this.proyecto.tiempo_paso;
      
      const time_proyect = JSON.parse(tiempo_paso);

      if (time_proyect.hasOwnProperty(dia_paso)) {
        
        tiempo_paso_dia_format = time_proyect[dia_paso];
        let tiempo_paso_dia = tiempo_paso_dia_format.split(':');
        const hr_paso = tiempo_paso_dia[0];
        const min_paso = tiempo_paso_dia[1];
      }
    }
    return tiempo_paso_dia_format;
  }
  
  sumarHoras(dia: any): string {

    let horasString = '00';
    let minutosString = '00';

    if(this.proyecto.tiempo_paso != '' && this.proyecto.tiempo_paso != undefined){
      const tiempo_paso = this.proyecto.tiempo_paso;
      
      const time_proyect = JSON.parse(tiempo_paso);
      let totalMinutos = 0;
      for (const key in time_proyect) {
        if (key.includes(dia)) {
    
          const [hora1Horas, hora1Minutos] = time_proyect[key].split(':').map(Number);
          const [hora2Horas, hora2Minutos] = time_proyect[key].split(':').map(Number);

          totalMinutos += hora1Horas * 60 + hora1Minutos/* + hora2Horas * 60 + hora2Minutos*/;
        }
      }
      

      const horas = totalMinutos > 0 ? Math.floor(totalMinutos / 60) : 0;
      const minutos = totalMinutos > 0 ? totalMinutos % 60 : 0;

      horasString = String(horas).padStart(2, '0');
      minutosString = String(minutos).padStart(2, '0');


    }
    return `${horasString}:${minutosString}`;
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

            let etapa_activa: any = this.proyecto.etapa_activa;
            let ruta: any = etapa_activa.split('/');//location.pathname.split('/');
            let fase_activa: any = ruta.length > 0 ? ruta[ruta.length-1] : '';
            this.fase = parseInt(fase_activa.substring(4));
            this.tablero = [];
            let categorias: any = [];
            let como_podriamos: any = [];

            this.isLoading = false; 
            this.onPlayPause();

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

  entrar(ruta: any, valid: boolean) {
    //this._router.navigate(['/principal/'+ruta]);
    if(valid){
    this._router.navigate([], { queryParams: { etapa: ruta } });
    this.etapa = ruta;
    this.ref.detectChanges();
    }
  }

  ir(fase?: any, valid?: boolean) {
    if(valid){
    this._router.navigate(['/proyect-init/'+this.proyecto_id+fase]);
    }
  }
  
  capitalize(etapa: string): string {
    return etapa == 'principal' ? this.proyecto.nombre : etapa.charAt(0).toUpperCase() + etapa.slice(1).toLowerCase();
  }

  getDay(etapa: any){
    switch (etapa) {
      case 'entender':
        return 'Día 1'
        break;
      
      case 'enfoque':
        return 'Día 2'
        break;
          
      case 'modelo':
        return 'Día 3'
        break;
        
      case 'bosquejar':
        return 'Día 4'
        break;
        
      case 'decidir':
        return 'Día 5'
        break;
        
      case 'entender':
        return 'Día 6'
        break;
    
      default:
        return '';
        break;
    }
  }
  
  onPlayPause(){
    //Revisa si el video esta pausado mediante su propiedad 'paused'(bool)
    this.playing= true;
    if($('#myVideo').prop('paused')){

      window.scrollTo(0, 0);
      window.addEventListener('scroll', this.disableScroll)

      console.log('Play');
      this.displayVideo();
      this.ref.detectChanges();
      $('#myVideo').trigger('play');
      if(this.primerEventoFlag){
        //Cuenta los segundos desde que se hace play en el video
        var id = setInterval(()=>{
          //Asigna el valor de la propiedad 'currentTime' a la variable cada 1 segundo
          this.currentTime = $('#myVideo').prop('this.currentTime');
          console.log(this.currentTime);
          //Gatilla eventos cada cierto valor de currentTime
          if(this.currentTime >= 3){
            this.hideVideo();
            $('#myVideo').trigger('pause');
            this.ref.detectChanges();
            clearInterval(id); //Detiene intervalo
          }
        }, 500)
      }
    }else{
      this.playing= false;
      console.log('Pause');
      this.hideVideo();
      this.ref.detectChanges();
      $('#myVideo').trigger('pause');
      window.removeEventListener('scroll', this.disableScroll);
    }

  }

  disableScroll(){
    window.scrollTo(0, 0);
  }

  displayVideo(){
    this.showVideoFlag = true;
  }

  hideVideo(){
    this.showVideoFlag = false;
  }

}
