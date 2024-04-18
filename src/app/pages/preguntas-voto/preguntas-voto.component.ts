import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { SocketWebService } from '../boards-default/boards.service';
import { ProyectsService } from '../config-project-wizzard/proyects.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragMove, CdkDragEnd} from '@angular/cdk/drag-drop';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Location} from '@angular/common';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-preguntas-voto',
  templateUrl: './preguntas-voto.component.html',
  styleUrls: ['./preguntas-voto.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreguntasVotoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  @ViewChild('tableroRef', { static: false }) tableroRef: ElementRef;
  board: string;

  notas: any = [];

  tablero: any = [];
  tablero2: any = [];
  votos: any = [];
  voto_tablero: any = [];
  voto_maximo: any = [];
  maximo_votos: number = 0;
  num_votos: number = 0;
  _user: any = {};
  equipo: any = [];

  public filteredTablero: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

    public width: number = 50;
    public height: number = 50;

    private cx: CanvasRenderingContext2D;

    private points: Array<any> = [];

    public isAvailabe: boolean = false;

    showTimer: boolean = false;
    currentTime = 0;

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

  style: any = null;
  offset: any= {x: 0, y: 0};
  dragPosition: any = [];//{x: 0, y: 0};

  isLoading:boolean = true;  
  video_url: any = 'http://res.cloudinary.com/tresideambipi/video/upload/v1659722491/videos/video_test_clgg4o.mp4';  

    @HostListener('document:mousemove', ['$event'])
    onMouseMove = (e: any) => {
      //if (e.target.id === 'canvasId' && (this.isAvailabe)) {
        this.write(e);
      //}
    }

    @HostListener('click', ['$event'])
    onClick = (e: any) => {
      if (e.target.id === 'canvasId') {
        this.isAvailabe = !this.isAvailabe;
      }
    }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.writeBoard();
  }

  public onDragMove(event: CdkDragMove<any>, i?: any, j?: any): void {
    const el=(document.getElementsByClassName('cdk-drag-preview')[0])as any
    const xPos = event.pointerPosition.x - this.offset.x;
    const yPos = event.pointerPosition.y - this.offset.y;
    //el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    //console.log('move:',event.pointerPosition);
    //this.dragPosition.x = xPos;
    //this.dragPosition.y = yPos;
  }

  public onDragEnded(event: CdkDragEnd<any>, i?: any, j?: any){
    console.log('fin',event);
    //console.log('dragPosition',this.dragPosition);
    /*const xPos = event.dropPoint.x;
    const yPos = event.dropPoint.y;*/
    const xPos = this.dragPosition[j].x + event.distance.x;//event.dropPoint.x - 650;
    const yPos = this.dragPosition[j].y + event.distance.y;//event.dropPoint.y - 500;
    
    this.dragPosition[j] = {x: xPos, y: yPos};

    this.tablero[i].data[j].position = j;
    this.tablero[i].data[j].dragPosition = this.dragPosition[j];
    //console.log('tablero:',this.tablero);

    let pregunta: any = { 'votos': this.tablero[i].data[j].votos, 'detalle': this.tablero[i].data[j].detalle, 'position': this.tablero[i].data[j].position, 'dragPosition': this.tablero[i].data[j].dragPosition };

    this._proyectsService.updatePreguntaSprint(this.tablero[i].data[j].id, pregunta)
    .subscribe(
        data => {
        },
        (response) => {
        }
    );

    this.writeBoard();
  }
  
  constructor(
    private route: ActivatedRoute,
    private socketWebService: SocketWebService,
    private _proyectsService: ProyectsService,
    private el:ElementRef,
    private ref: ChangeDetectorRef,
    private _router: Router, 
    private _location: Location
  ) {
    this.socketWebService.outEvenTableroVotoPreguntas.subscribe((res: any) => {
      //console.log('escucha_tablero',res);
      const { tablero } = res;
      this.readBoard(tablero, false);
    });

    this.socketWebService.outEven2.subscribe((res: any) => {
      //console.log('escucha_puntero',res);

      const { prevPost } = res;
      let usuario_label = prevPost.usuario.split(' ');
      let usuario_nombre = usuario_label[0].replace("-", "");
      usuario_nombre = usuario_nombre.replace(".", "");
      usuario_nombre = usuario_nombre.replace("@", "");

      const index = this.equipo.findIndex((c: any) => c == usuario_nombre);
      //console.log('usuario',prevPost.usuario);
        if (index == -1) {
          this.equipo.push(usuario_nombre);
        }
        this.ref.detectChanges();
      //jQuery("#canvasId").css({"left" : prevPost.x, "top" : prevPost.y});
      jQuery("#puntero-"+usuario_nombre).css({"left" : prevPost.x, "top" : prevPost.y, "display": "block"});
      jQuery("#equipo-"+usuario_nombre).css({"left" : prevPost.x + 30, "top" : prevPost.y, "display": "block"});
      //console.log('equipo',this.equipo);

      this.writeSingle(prevPost, false);
    })

     /*this.initService.init();*/
    /* this.socketWebService.outEvenUsers.subscribe((res: any) => {
      //console.log('escucha_tablero',res);
      const { usuarios } = res;
      console.log('escuchando',res);
      this.readUsers(usuarios, false);
    });*/

    this.socketWebService.outEvenUsersActive.subscribe((res: any) => {
      const { usuarios_active } = res;
      this.readUsersActive(usuarios_active, false);
    });

    //escuchamos el evento activo
    this.socketWebService.outEvenEtapaActive.subscribe((res: any) => {
      this.etapa_active(res);
    });

    //escuchamos el evento para continuar
    this.socketWebService.outEvenContinueVoto.subscribe((res: any) => {
      this.continue();
    });

    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;
    this.usuario.active = true;

   }

  ngOnInit(): void {

    //this.socketWebService.emitEventGetEtapa();

    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      this.getProyect();
    });

    this.socketWebService.ioSocket.connect();
    this.socketWebService.emitLogin(this.proyecto_id);

    //this.socketWebService.emitEventGetClasi();

    const usuario: any = localStorage.getItem('usuario');
    this._user = JSON.parse(usuario);
    //this.board = this.route.snapshot.paramMap.get('board');
    //this.cookieService.set('board', this.board)
  }

  ngAfterViewInit() {
    this.setInitialValue();
    this.render();

    const index2 = this.usuarios_active.findIndex((c: any) => c.id == this.usuario.id);

    if (index2 != -1) {
      this.usuarios_active.splice(index2, 1);
    }
    this.usuarios_active.push({'id': this.usuario.id, 'nombre': this.usuario.nombre, 'active': true});

    console.log('enviando_usuario',this.usuario);

    //this.socketWebService.emitEventUsers({usuarios: JSON.stringify(this.usuarios)});
    this.socketWebService.emitEventUsersActive(this.usuario);

    //Inicia video y cancela scroll
    //this.onPlayPause();

    this.ref.detectChanges();
  }

  ngOnDestroy() {
    console.log('ngdestroy');
    this.socketWebService.emitEventUsersInactive(this.usuario);
    this.socketWebService.ioSocket.disconnect();
    this._onDestroy.next();
    this._onDestroy.complete();
    window.removeEventListener('scroll', this.disableScroll);
  }

  continue() {
    this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase8']);
  }

  getCoordenadas(xPos: number,yPos: number){
    return {x: xPos, y: yPos};
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
            this.maximo_votos = this.rol == 'Decisor' ? 4 : 2;

            if(this.proyecto.tiempo != '' && this.proyecto.tiempo != undefined){
              let tiempo = this.proyecto.tiempo.split(':');
              this.hr = tiempo[0];
              this.min = tiempo[1];
            }
            this.showTimer = true;

            this.tablero = [];
            let preguntas: any = [];
            let position: number = 0;
            for(let c in this.proyecto.proyecto_recursos){

              if(this.proyecto.proyecto_recursos[c].preguntasprint != null){
                
              preguntas.push({'id': this.proyecto.proyecto_recursos[c].preguntasprint.id,'label': this.proyecto.proyecto_recursos[c].preguntasprint.contenido, 'votos': this.proyecto.proyecto_recursos[c].preguntasprint.votos, 'detalle': JSON.parse(this.proyecto.proyecto_recursos[c].preguntasprint.detalle) || [], 'position': this.proyecto.proyecto_recursos[c].preguntasprint.position ? this.proyecto.proyecto_recursos[c].preguntasprint.position : position, 'dragPosition': this.proyecto.proyecto_recursos[c].preguntasprint.dragPosition ? JSON.parse(this.proyecto.proyecto_recursos[c].preguntasprint.dragPosition) :  {'x': 0, 'y': 0}});
              
              this.dragPosition.push(this.proyecto.proyecto_recursos[c].preguntasprint.dragPosition ? JSON.parse(this.proyecto.proyecto_recursos[c].preguntasprint.dragPosition) : {x: 0, y: 0});

              let detalle: any = JSON.parse(this.proyecto.proyecto_recursos[c].preguntasprint.detalle) || [];
                const index_usuario = detalle.findIndex((d: any) => d.usuario_id == this.usuario.id);

                if (index_usuario != -1) {
                  this.num_votos = this.num_votos + detalle[index_usuario].votos;
                }
                position = position + 1;
              }
            }

            console.log('preguntas',preguntas);

            this.tablero.push({'title': 'Preguntas', "data": preguntas});

            //console.log('tablero_all', this.tablero);
            this.tablero2 = JSON.stringify(this.tablero);
            
            console.log('tablero_inicial:',this.tablero);

            this.filteredTablero.next(this.tablero.slice());
            
            this.isLoading = false;    

            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }

  saveVotoAll(){
    console.log('save_voto_all_preguntas',this.tablero);
    let tablero: any = [];
    let usuarios_votos: any = [];
    let usuarios_votos_detalle: any = [];
    let index_usuario: any = '';
    let index_votos: any = '';
    let index_votos_detalle: any = '';
    let valido: number = 0;

    for(let n in this.tablero){
      let categorias: any = [];

      for(let m in this.tablero[n].data){
        categorias.push({'id': this.tablero[n].data[m].id, 'label': this.tablero[n].data[m].label, 'votos': this.tablero[n].data[m].votos, 'detalle': /*JSON.stringify(*/this.tablero[n].data[m].detalle/*)*/, position: this.tablero[n].data[m].position, dragPosition: this.tablero[n].data[m].dragPosition});
        
        for(let u in this.usuarios_active){
          index_usuario = this.tablero[n].data[m].detalle.findIndex((d: any) => d.usuario_id == this.usuarios_active[u].id);

          if (index_usuario != -1) {
            index_votos = usuarios_votos.findIndex((v: any) => v == this.usuarios_active[u].id);

            if (index_votos == -1) {
              usuarios_votos.push(this.usuarios_active[u].id);
              usuarios_votos_detalle.push({'usuario_id': this.usuarios_active[u].id, 'votos': this.tablero[n].data[m].detalle[index_usuario].votos});
            }else{
              
              index_votos_detalle = usuarios_votos_detalle.findIndex((d: any) => d.usuario_id == this.usuarios_active[u].id);

              usuarios_votos_detalle[index_votos_detalle].votos = usuarios_votos_detalle[index_votos_detalle].votos + this.tablero[n].data[m].detalle[index_usuario].votos;
            }
          }
        }
      }
        tablero.push({'title': this.tablero[n].title, "data": categorias});
    }
    
    let index_validar: any = '';
    for(let ua in this.usuarios_active){

      index_validar = usuarios_votos_detalle.findIndex((vd: any) => vd.usuario_id == this.usuarios_active[ua].id);

      valido += (this.usuarios_active[ua].id == this.usuario.id && usuarios_votos_detalle[index_validar].votos >= 4) || (this.usuarios_active[ua].id != this.usuario.id && usuarios_votos_detalle[index_validar].votos >= 2) ? 1 : 0;

    }

    if(this.usuarios_active.length == usuarios_votos.length && this.usuarios_active.length == valido){
    console.log('guardar_votos',tablero);

    const data_etapa = {etapa_activa: '/proyect-init/'+this.proyecto_id+'/fase8', tablero: tablero, type: 'voto'};

    this._proyectsService.updateEtapaPreguntas(this.proyecto_id, data_etapa)
    .subscribe(
        data => {

          this.socketWebService.emitEventSetEtapa('/proyect-init/'+this.proyecto_id+'/fase8');

          this.socketWebService.emitEventTableroSaveVotoPreguntas({tablero: JSON.stringify(tablero)});

        },
        (response) => {
        }
    );
    }else{
      Swal.fire({
        text: "Ups, no todos los participantes han votado.",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok!",
        customClass: {
          confirmButton: "btn btn-primary"
        }
      });
    }
  }

  etapa_active(etapa_active: any) {
    if(etapa_active != ''){
      this._router.navigate([etapa_active]);
    }
  }

  private readUsersActive(data: any, emit: boolean){
    const usuarios = JSON.parse(data);
    console.log('recibe_usuarios', usuarios);
    this.usuarios_active = usuarios;

    this.ref.detectChanges();
  }

  private render() {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');/*
    var img = new Image();
    img.src = "https://w7.pngwing.com/pngs/547/1024/png-transparent-computer-mouse-pointer-arrow-mouse-cursor-white-arrow-on-black-background-miscellaneous-angle-text.png";*/
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';/*
    this.cx.drawImage(img, 0, 0);
    this.cx.save();*/
  }

  private write(res: any) {
    //const canvasEl = this.canvasRef.nativeElement;
    const canvasEl = this.tableroRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    let usuario_label = this._user.nombre.split(' ');
    let usuario_nombre = usuario_label[0].replace("-", "");
    usuario_nombre = usuario_nombre.replace(".", "");
    usuario_nombre = usuario_nombre.replace("@", "");
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top,
      usuario: usuario_nombre
    }
    /*const prevPos = {
      x: res.clientX,
      y: res.clientY,
    }*/
    this.writeSingle(prevPos);
  }

  private writeSingle(prevPos: any, emit: boolean = true) {
    this.points.push(prevPos);
    //if (this.points.length > 3) {
      const prevPost = this.points[this.points.length - 1];
      const currentPost = this.points[this.points.length - 2];

      //this.drawOnCanvas(prevPost, currentPost);
      if (emit) {
        this.socketWebService.emitEvent2({ prevPost })
      }

    //}
  }

  private drawOnCanvas(prevPos: any, currentPost: any) {
    if (!this.cx) return;
    this.cx.beginPath();

    if (prevPos) {
      this.points = [];
      this.cx.clearRect(0, 0, this.width, this.height);
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPost.x, currentPost.y);
      this.cx.stroke();
    }
  }

  public clearZone = () => {
    this.points = [];
    this.cx.clearRect(0, 0, this.width, this.height);
  }

  private setInitialValue() {
    this.filteredTablero
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  private writeBoard(){
    //console.log('writeBoard');
    this.socketWebService.emitEventTableroVotoPreguntas({tablero: JSON.stringify(this.tablero)});
  }

  private readBoard(tablero: any, emit: boolean){
    const data = JSON.parse(tablero);
    //console.log('data',data);
    this.tablero = [];
    for(let c in data){
      this.tablero.push({'title': data[c].title, "data": data[c].data});
    }
    //console.log('tablero_all', this.tablero);
    this.tablero2 = JSON.stringify(this.tablero);

    for(let d in this.tablero[0].data){
      this.dragPosition[this.tablero[0].data[d].position] = this.tablero[0].data[d].dragPosition;
    }

    this.filteredTablero.next(this.tablero.slice());
  }

  votar(i: any, j: any){
    //console.log('votar', i, j);
    //console.log(this.tablero[i].data[j].label);
    this.tablero[i].data[j].votos = this.tablero[i].data[j].votos + 1;

    const index = this.votos.findIndex((c: any) => c.id == i+':'+j);

      if (index == -1) {
        this.votos.push({id: i+':'+j, votos: 1});
      }else{
        this.votos[index].votos = this.votos[index].votos + 1;
      }

      const index2 = this.voto_tablero.findIndex((c: any) => c == i);

      if (index2 == -1) {
        this.voto_tablero.push(i);
      }

    this.num_votos = this.num_votos + 1;
    //console.log('votos', this.votos);

    let detalle: any = this.tablero[i].data[j].detalle;
    const index_usuario = detalle.findIndex((d: any) => d.usuario_id == this.usuario.id);

    if (index_usuario == -1) {
      this.tablero[i].data[j].detalle.push({usuario_id: this.usuario.id, votos: 1});
    }else{
      this.tablero[i].data[j].detalle[index_usuario].votos = this.tablero[i].data[j].detalle[index_usuario].votos + 1;
    }

    let pregunta: any = { 'votos': this.tablero[i].data[j].votos, 'detalle': this.tablero[i].data[j].detalle, position: this.tablero[i].data[j].position, dragPosition: this.tablero[i].data[j].dragPosition };

    this._proyectsService.updatePreguntaSprint(this.tablero[i].data[j].id, pregunta)
    .subscribe(
        data => {
        },
        (response) => {
        }
    );

    this.writeBoard();
  }

  votarMaximo(i: any, j: any){
    //console.log('votar_maximo', i, j);
    //console.log(this.tablero[i].data[j].label);
    this.voto_maximo.push(i+':'+j);
    this.voto_tablero.push(i);
    this.tablero[i].data[j].voto_maximo = true;
    //console.log('votos', this.votos);
    this.writeBoard();
  }

  quitar(i: any, j: any){
    //console.log('quitar', i, j);
    //console.log(this.tablero[i].data[j].label);
    this.tablero[i].data[j].votos = this.tablero[i].data[j].votos - 1;

    this.num_votos = this.num_votos - 1;

    const index = this.votos.findIndex((c: any) => c.id == i+':'+j);

      if (index != -1) {
        this.votos[index].votos = this.votos[index].votos - 1;

        if(this.votos[index].votos == 0){
          this.votos.splice(index, 1);

          const index2 = this.voto_tablero.findIndex((c: any) => c == i);

          if (index2 != -1) {
            this.voto_tablero.splice(index2, 1);
          }
        }
      }

      let detalle: any = this.tablero[i].data[j].detalle;
    const index_usuario = detalle.findIndex((d: any) => d.usuario_id == this.usuario.id);

    if (index_usuario != -1) {
      let voto: any = this.tablero[i].data[j].detalle[index_usuario].votos - 1;
      if(voto < 1){
        this.tablero[i].data[j].detalle.splice(index_usuario, 1);
      }else{
        this.tablero[i].data[j].detalle[index_usuario].votos = voto;
      }
      
    }

    let pregunta: any = { 'votos': this.tablero[i].data[j].votos, 'detalle': this.tablero[i].data[j].detalle, 'position': this.tablero[i].data[j].position, 'dragPosition': this.tablero[i].data[j].dragPosition };

    this._proyectsService.updatePreguntaSprint(this.tablero[i].data[j].id, pregunta)
    .subscribe(
        data => {
        },
        (response) => {
        }
    );

    //console.log('votos', this.votos);
    this.writeBoard();
  }


  quitarMaximo(i: any, j: any){
    //console.log('quitar_maximo', i, j);
    //console.log(this.tablero[i].data[j].label);

    const index = this.voto_maximo.findIndex((c: any) => c == i+':'+j);

    if (index != -1) {
      this.voto_maximo.splice(index, 1);
    }

    const index2 = this.voto_tablero.findIndex((c: any) => c == i);

    if (index2 != -1) {
      this.voto_tablero.splice(index2, 1);
    }

    this.tablero[i].data[j].voto_maximo = false;

    //console.log('votos', this.votos);
    this.writeBoard();
  }

  verifyVoto(i: any, j: any){
    const index = this.votos.findIndex((c: any) => c.id == i+':'+j);
    const detalle: any = this.tablero[i].data[j].detalle;
    const index_usuario = detalle.findIndex((d: any) => d.usuario_id == this.usuario.id);

    if (index != -1 || index_usuario != -1) {
      return true;
    }

    return false;
  }

  verifyVotoMaximo(i: any, j: any){
    /*const index = this.voto_maximo.findIndex((c) => c == i+':'+j);

    if (index != -1) {
      return true;
    }

    return false;*/

    if(this.tablero[i].data[j].voto_maximo == true){
      return true;
    }else{
      return false;
    }

  }


  verifyVotoTablero(i: any){
    //console.log('voto_tablero',this.voto_tablero);
    const index = this.voto_tablero.findIndex((c: any) => c == i);

    if (index != -1) {
      return true;
    }

    return false;

  }
  disableScroll(){
    window.scrollTo(0, 0);
  }

}
