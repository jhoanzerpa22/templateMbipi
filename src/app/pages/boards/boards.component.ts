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
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsComponent implements OnInit, AfterViewInit, OnDestroy {

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

  constructor(
    private route: ActivatedRoute,
    private socketWebService: SocketWebService,
    private _proyectsService: ProyectsService,
    private el:ElementRef,
    private ref: ChangeDetectorRef,
    private _router: Router
  ) {
    this.socketWebService.outEven.subscribe((res: any) => {
      //console.log('escucha_tablero',res);
      const { tablero } = res;
      //const { notas } = res;
      this.readBoard(tablero, false);/*
      this.readNotas(notas, false);*/
    });

    //escuchamos el evento para continuar
    this.socketWebService.outEvenContinueVoto.subscribe((res: any) => {
      this.continue();
    });

    this.socketWebService.outEven2.subscribe((res: any) => {
      //console.log('escucha_puntero',res);

      const { prevPost } = res;
      let usuario_label = prevPost.usuario.split(' ');
      const index = this.equipo.findIndex((c: any) => c == usuario_label[0]);
      //console.log('usuario_equipo',usuario_label[0]);
        if (index == -1) {
          this.equipo.push(usuario_label[0]);
        }
        this.ref.detectChanges();
      //jQuery("#canvasId").css({"left" : prevPost.x, "top" : prevPost.y});
      jQuery("#puntero-"+usuario_label[0]).css({"left" : prevPost.x, "top" : prevPost.y, "display": "block"});
      jQuery("#equipo-"+usuario_label[0]).css({"left" : prevPost.x + 30, "top" : prevPost.y, "display": "block"});
      //console.log('equipo',this.equipo);

      this.writeSingle(prevPost, false);
    })

     /*this.initService.init();*/
     /*this.socketWebService.outEvenUsers.subscribe((res: any) => {
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

    //Buscar notas iniciales de etapa anterior
    //this.socketWebService.emitEventGet();

    /*const notes: any = localStorage.getItem('notes_all');
    this.notas = JSON.parse(notes);
    let como_podriamos: any = [];
    for(let n in this.notas){
      como_podriamos.push({'content': this.notas[n].content});
    }

    this.filteredNotas.next(this.notas.slice());

    this.tablero.push({'title': 'Como podriamos', "data": como_podriamos});*/

    /*this.notas.push({'label': 'Get to work'}, {'label': 'Pick up groceries'}, {'label': 'Go home'},{'label': 'Get to work'}, {'label': 'Pick up groceries'}, {'label': 'Go home'},{'label': 'Get to work'}, {'label': 'Pick up groceries'}, {'label': 'Go home'},{'label': 'Get to work'}, {'label': 'Pick up groceries'}, {'label': 'Go home'});*/

    /*this.tablero.push({'title': 'Tablero 1', "data": [{'content': 'Get to work', 'voto': 0, 'voto_maximo': false}, {'content': 'Pick up groceries', 'voto': 0, 'voto_maximo': false}, {'content': 'Go home', 'voto': 0, 'voto_maximo': false}, {'content': 'Fall asleep', 'voto': 0, 'voto_maximo': false}]});
    this.tablero.push({'title': 'Tablero 2', "data": [{'content': 'Get to work2', 'voto': 0, 'voto_maximo': false}, {'content': 'Pick up groceries2', 'voto': 0, 'voto_maximo': false}, {'content': 'Go home2', 'voto': 0, 'voto_maximo': false}, {'content': 'Fall asleep2', 'voto': 0, 'voto_maximo': false}]});*/
    //this.tablero2 = JSON.stringify(this.tablero);
    //this.filteredTablero.next(this.tablero.slice());

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
    $('#myVideo').trigger('play');
    window.addEventListener('scroll', this.disableScroll);

    this.ref.detectChanges();
  }

  ngOnDestroy() {
    console.log('ngdestroy');
    this.socketWebService.emitEventUsersInactive(this.usuario);
    this._onDestroy.next();
    this._onDestroy.complete();
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

            this.tablero = [];
            let categorias: any = [];
            let como_podriamos: any = [];
            
            for(let c in this.proyecto.proyecto_recursos){
              if(this.proyecto.proyecto_recursos[c].notascp != null){
                if(this.proyecto.proyecto_recursos[c].notascp.categoria != 'como podriamos'){
                  const index3 = categorias.findIndex((ct: any) => ct.categoria == this.proyecto.proyecto_recursos[c].notascp.categoria);
                  if(index3 == -1){
                    categorias.push({categoria: this.proyecto.proyecto_recursos[c].notascp.categoria, data: []});
                  }
                  
                  const index4 = categorias.findIndex((ct: any) => ct.categoria == this.proyecto.proyecto_recursos[c].notascp.categoria);
                
                  categorias[index4].data.push({'id': this.proyecto.proyecto_recursos[c].notascp.id,'content': this.proyecto.proyecto_recursos[c].notascp.contenido, 'votos': this.proyecto.proyecto_recursos[c].notascp.votos});
                }else{
                  
                  como_podriamos.push({'id': this.proyecto.proyecto_recursos[c].notascp.id,'content': this.proyecto.proyecto_recursos[c].notascp.contenido, 'votos': this.proyecto.proyecto_recursos[c].notascp.votos});
                }
              }
            }

            console.log('categorias',categorias);

            //const index5 = categorias.findIndex((ct: any) => ct.categoria == 'como podriamos');
                //if(index5 == -1){
                if(como_podriamos.length > 0){
                  this.tablero.push({'title': 'como podriamos', "data": como_podriamos});
                }else{
                  this.tablero.push({'title': 'como podriamos', "data": []});
                }

            for(let d in categorias){
              this.tablero.push({'title': categorias[d].categoria, "data": categorias[d].data});
            }

            //console.log('tablero_all', this.tablero);
            this.tablero2 = JSON.stringify(this.tablero);

            this.filteredTablero.next(this.tablero.slice());

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
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top,
      usuario: usuario_label[0]
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

      this.filteredNotas
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  private writeBoard(){
    //console.log('writeBoard');
    console.log('notas',this.notas);
    this.socketWebService.emitEvent({tablero: JSON.stringify(this.tablero)/*,notas: JSON.stringify(this.notas)*/});
  }

  private readBoard(tablero: any, emit: boolean){
    const data = JSON.parse(tablero);
    console.log('readBoard',data);
    //console.log('data',data);
    this.tablero = [];
    for(let c in data){
      this.tablero.push({'title': data[c].title, "data": data[c].data});
    }
    //console.log('tablero_all', this.tablero);
    this.tablero2 = JSON.stringify(this.tablero);

    this.filteredTablero.next(this.tablero.slice());
  }

  private readNotas(notas: any, emit: boolean){
    const data = JSON.parse(notas);
    console.log('readNota',data);
    //console.log('data',data);
    this.notas = data;

    this.filteredNotas.next(this.notas.slice());
  }

  addCategory(){
    let title = 'Categoria '+ /*(*/this.tablero.length/* + 1)*/;
    this.tablero.push({"title": title, "data": []});
    this.tablero2 = JSON.stringify(this.tablero);
    this.filteredTablero.next(this.tablero.slice());

    this.socketWebService.emitEvent({tablero: JSON.stringify(this.tablero)});
  }

  deleteCategory(contenido: any, index: any){
      console.log('contenido', contenido);
      for (let i = 0; i < contenido.length; i++) {
        this.tablero[0].data.push(contenido[i]);
      }
      this.tablero.splice(index,1);
      this.tablero2 = JSON.stringify(this.tablero);
      this.filteredTablero.next(this.tablero.slice());
      //this.socketWebService.emitEvent({tablero: JSON.stringify(this.tablero)});
  }

  onFocusOut(event: any, i: any){
    this.tablero[i].title = event.target.innerText;
    this.tablero2 = JSON.stringify(this.tablero);

    this.socketWebService.emitEvent({tablero: JSON.stringify(this.tablero)});
  }

  saveCategoryAll() {
    console.log('save_category_all',this.tablero);
    localStorage.setItem('category_all', this.tablero2);

    let primero = 0;
    let tablero: any = [];

    for(let n in this.tablero){
      let categorias: any = [];

      for(let m in this.tablero[n].data){
        categorias.push({'id': this.tablero[n].data[m].id, 'label': this.tablero[n].data[m].content, 'votos': 0, 'voto_maximo': false});
      }
      if(primero > 0){
        tablero.push({'title': this.tablero[n].title, "data": categorias});
      }
      primero = primero + 1;
    }

    console.log('guardar_clasificacion',tablero);

    const data_etapa = {etapa_activa: '/proyect-init/'+this.proyecto_id+'/fase3', tablero: tablero, type: 'clasificacion'};

    this._proyectsService.updateEtapa(this.proyecto_id, data_etapa)
    .subscribe(
        data => {

          this.socketWebService.emitEventSetEtapa('/proyect-init/'+this.proyecto_id+'/fase3');

          this.socketWebService.emitEventTableroSaveClasi({tablero: JSON.stringify(tablero)});

        },
        (response) => {
        }
    );

  }

  continue() {
    this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase3']);
  }

  etapa_active(etapa_active: any) {
    if(etapa_active != ''){
      this._router.navigate([etapa_active]);
    }
  }

  onPlayPause(){
    //Revisa si el video esta pausado mediante su propiedad 'paused'(bool)
    this.playing= true;
    if($('#myVideo').prop('paused')){
      window.scrollTo(0,0);
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
    this.ref.detectChanges();
  }

}
