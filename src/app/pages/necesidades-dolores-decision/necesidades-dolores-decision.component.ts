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
  selector: 'app-necesidades-dolores-decision',
  templateUrl: './necesidades-dolores-decision.component.html',
  styleUrls: ['./necesidades-dolores-decision.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NecesidadesDoloresDecisionComponent implements OnInit, AfterViewInit, OnDestroy {
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

  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;
  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  @ViewChild('tableroRef', { static: false }) tableroRef: ElementRef;

  //Lista de Usuarios
  usuarios: any = []; //usuarios
  usuarios_active: any = []; //usuarios activos
  usuario: any = {}; //usuario logueado

  //Lista de notas
  notes: any = []; // lista de notas del tablero
  recognition:any;
  notes_all: any = []; // lista de notas de todos los participantes
  notes_cache: any = [];
  public proyecto: any = {};
  public proyecto_id: number;
  public rol: any = '';

  ms:any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  _user: any = {};
  equipo: any = [];

  isLoading:boolean = true;

  public width: number = 50;
  public height: number = 50;

  private cx: CanvasRenderingContext2D;

  private points: Array<any> = [];
  style: any = null;
  offset: any= {x: 0, y: 0};
  dragPosition: any = [];//{x: 0, y: 0};

  public isAvailabe: boolean = false;

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
  }

  public onDragEnded(event: CdkDragEnd<any>, i?: any, j?: any){
    const xPos = this.dragPosition[j].x + event.distance.x;//event.dropPoint.x - 650;
    const yPos = this.dragPosition[j].y + event.distance.y;//event.dropPoint.y - 500;
    
    this.dragPosition[j] = {x: xPos, y: yPos};

    this.notes[j].position = j;
    this.notes[j].dragPosition = this.dragPosition[j];
    //console.log('tablero:',this.tablero);

    this.notes_all = this.notes;

    let necesidad: any = { 'position': this.notes[j].position, 'dragPosition': this.notes[j].dragPosition };

    this._proyectsService.updateNecesidades(this.notes[j].id, necesidad)
    .subscribe(
        data => {
        },
        (response) => {
        }
    );

    this.writeBoard();
  }

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
    });


    //escuchamos el evento de las notas de los usuarios
    this.socketWebService.outEvenTableroNecesidades.subscribe((res: any) => {
      const { tablero } = res;
      this.readBoard(tablero, false);
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

    //leemos nota en cache
    const notes: any = localStorage.getItem('notes_necesidades_dolores_decision');
    this.notes_cache = JSON.parse(notes) || [/*{ id: 0+'-'+this.usuario.nombre, content:'' }*/];

    //si existen notas en cache las enviamos al socket
    //if(this.notes.length > 0){
      //this.socketWebService.emitEventTablero({tablero: JSON.stringify(this.notes)});
      //this.sendNotes(this.notes);
    //}

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

    // build view by layout config settings
    /*
    this.asideDisplay = this.layout.getProp('aside.display') as boolean;
    this.toolbarDisplay = this.layout.getProp('toolbar.display') as boolean;
    this.contentContainerClasses = this.layout.getStringCSSClasses('contentContainer');
    this.asideCSSClasses = this.layout.getStringCSSClasses('aside');
    this.headerCSSClasses = this.layout.getStringCSSClasses('header');
    this.headerHTMLAttributes = this.layout.getHTMLAttributes('headerMenu');*/
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
            
            let necesidades: any = [];
            let position: number = 0;
            
            for(let c in this.proyecto.proyecto_recursos){
              if(this.proyecto.proyecto_recursos[c].scopecanvas_necesidade != null){
                if(/*this.proyecto.proyecto_recursos[c].usuario_id == this.usuario.id*/this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.tipo == 'Dolores'){
                 necesidades.push({'id': this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.id,'content': this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.contenido, 'type': this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.tipo, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id, 'position': this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.position ? this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.position : position, 'dragPosition': this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.dragPosition ? JSON.parse(this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.dragPosition) :  {'x': 0, 'y': 0}});

                 this.dragPosition.push(this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.dragPosition ? JSON.parse(this.proyecto.proyecto_recursos[c].scopecanvas_necesidade.dragPosition) : {x: 0, y: 0});
                 
                position = position + 1;
                }
              }
            }

            this.notes = necesidades;

            //leemos nota en cache
              //this.notes = localStorage.getItem('proyecto_id') == this.proyecto_id ? '' : '';

              //si existen notas en cache las enviamos al socket
              if(this.notes.length > 0){
                //this.socketWebService.emitEventTablero({tablero: JSON.stringify(this.notes)});
                this.sendNotes(this.notes);
              }
              
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

  //actualizamos lista de usuarios activos
  private readUsersActive(data: any, emit: boolean){
    const usuarios = JSON.parse(data);
    console.log('recibe_usuarios', usuarios);
    
    this.usuarios_active = usuarios;

    this.ref.detectChanges();
  }

  //actualizamos listado de notas de usuarios
  private readBoard(tablero: any, emit: boolean){
    const data = JSON.parse(tablero);
    console.log('notas_all_necesidades_dolores_decision',data);
    this.notes_all = data;
    this.notes = data;

    for(let d in data){
      this.dragPosition[data[d].position] = data[d].dragPosition;
    }

    this.ref.detectChanges();
    /*this.notes_all = [];
    for(let c in data){
      this.notes_all.push({'id': data[c].id, 'content': data[c].content, "data": data[c].data});
    }*/

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

  updateAllNotes() {
    console.log(document.querySelectorAll('app-note-necesidades-dolores-decision'));
    let notes = document.querySelectorAll('app-note-necesidades-dolores-decision');

    notes.forEach((note: any, index: any)=>{
         this.notes[note.id].content = note.querySelector('.content').innerHTML;
    });

    localStorage.setItem('notes_necesidades_dolores_decision', JSON.stringify(this.notes));

  }

  saveNoteAll() {
    console.log('save_notes_all_necesidades_dolores',this.notes_all);
    localStorage.setItem('notes_all_necesidades_dolores', JSON.stringify(this.notes_all));

    let necesidades: any = [];
    let tablero: any = [];
    for(let n in this.notes_all){
      necesidades.push({'content': this.notes_all[n].content, 'type': 'Dolores'});
    }

    tablero.push({'title': 'Como podriamos', "data": necesidades});

    const data_etapa = {etapa_activa: '/proyect-init/'+this.proyecto_id+'/fase13', tablero: this.notes_all, type: 'notas'};

    this._proyectsService.updateEtapaNecesidades(this.proyecto_id, data_etapa)
    .subscribe(
        data => {

          this.socketWebService.emitEventSetEtapa('/proyect-init/'+this.proyecto_id+'/fase13');

          this.socketWebService.emitEventTableroSaveNecesidades({tablero: JSON.stringify(tablero)});

        },
        (response) => {
        }
    );

    //this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase13']);
  }

  continue() {
    this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase13']);
  }

  etapa_active(etapa_active: any) {
    if(etapa_active != ''){
      this._router.navigate([etapa_active]);
    }
  }

  addNote(event?: any) {
    this.notes.push({ id: /*this.notes.length + 1*/this.notes.length+'-'+this.usuario.nombre, content: event.target.value, type: 'Dolores', usuario_id: this.usuario.id });
    // sort the array
    this.notes= this.notes.sort((a: any,b: any)=>{ return b.id-a.id});
    localStorage.setItem('notes_necesidades_dolores_decision', JSON.stringify(this.notes));
    
    this.socketWebService.emitEventTableroUpdateNecesidades({id: this.notes.length+'-'+this.usuario.nombre, content: event.target.value, type: 'Dolores', usuario_id: this.usuario.id });

    $('#agregar_nota').val('');
    $('#agregar_nota').text('');
    $('#agregar_nota').focus();
  }

  saveNote(event: any){
    if (event.target.innerText.trim() == ""){
      Swal.fire({
        text: "Ups, la nota no puede estar vacia.",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok!",
        customClass: {
          confirmButton: "btn btn-primary"
        }
      });
    }else{
    const id = event.srcElement.parentElement/*.parentElement*//*.parentElement.parentElement*/.getAttribute('id');
    const content = event.target.innerText;
    event.target.innerText = content;
    const json = {
      'id':id,
      'content':content,
      'type': 'Dolores',
      'usuario_id': this.usuario.id
    }
    console.log('json',json);
    this.updateNote(json);
    //this.updateNoteAll(json);

    localStorage.setItem('notes_necesidades_dolores_decision', JSON.stringify(this.notes));
    //this.sendNotes(this.notes);
    console.log("********* updating note *********")
    }
  }

  updateNote(newValue: any){
    this.notes.forEach((note: any, index: any)=>{
      if(note.id== newValue.id) {
        this.notes[index].content = newValue.content;
        this.socketWebService.emitEventTableroUpdateNecesidades(newValue);
        this._proyectsService.updateNecesidades(newValue.id,newValue)
        .subscribe(
            data => {

            },
            (response) => {
            }
        );
      }
    });
  }

  updateNoteAll(newValue: any){
    let existe = 0;
    this.notes_all.forEach((note: any, index: any)=>{
      if(note.id== newValue.id) {
        existe = 1;
        this.notes_all[index].content = newValue.content;
      }
    });

    if(existe == 0){
      this.notes_all.push({ id: newValue.id, content:newValue.content, type:newValue.type });
    }

    this.socketWebService.emitEventTableroNecesidades({tablero: JSON.stringify(this.notes_all)});
  }

  private writeBoard(){
    console.log('writeBoard', this.notes_all);
    this.socketWebService.emitEventTableroNecesidades({tablero: JSON.stringify(this.notes_all)});
  }

  sendNotes(notes: any){
    this.socketWebService.emitEventTableroNecesidades({tablero: JSON.stringify(notes)});
  }

  deleteNote(event: any, idNote: any){
    event.preventDefault();
    const id = idNote/*event.srcElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id')*/;
    this.notes.forEach((note: any, index: any)=>{
      console.log('nota',note);
      if(note.id== id) {
        this.notes.splice(index,1);
        this.socketWebService.emitEventTableroDeleteNecesidades(note);
        /*const index2 = this.notes_all.findIndex((n: any) => n.id == id);

        if (index2 != -1) {
          this.notes_all.splice(index2, 1);

          this.socketWebService.emitEventTablero({tablero: JSON.stringify(this.notes_all)});
        }*/

        localStorage.setItem('notes_necesidades_dolores_decision', JSON.stringify(this.notes));
        if(id > 0){
        this._proyectsService.deleteNecesidades(id)
        .subscribe(
            data => {

            },
            (response) => {
            }
        );
        }
        console.log("********* deleting note *********")
        return;
      }
    });
  }

   record(event: any) {
    this.recognition.start();
    this.addNote();
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
    $('#agregar_nota').focus();
  }
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
