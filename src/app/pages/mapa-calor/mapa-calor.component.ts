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
  selector: 'app-mapa-calor',
  templateUrl: './mapa-calor.component.html',
  styleUrls: ['./mapa-calor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapaCalorComponent implements OnInit, AfterViewInit, OnDestroy {
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
  @ViewChild('tableroRef', { static: false }) tableroRef: ElementRef;

  //Lista de Usuarios
  usuarios: any = []; //usuarios
  usuarios_active: any = []; //usuarios activos
  usuario: any = {}; //usuario logueado
  _user: any = {};

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

  ms_paso:any = '0' + 0;
  sec_paso: any = '0' + 0;
  min_paso: any = '0' + 0;
  hr_paso: any = '0' + 0;
  dia_paso: any = 'dia5_paso1';
  tiempo_paso: any = '';

  showTimerPass: boolean = false;

  isLoading:boolean = true;
  video_url: any = 'http://res.cloudinary.com/tresideambipi/video/upload/v1659722491/videos/video_test_clgg4o.mp4'; 
  recursos: any = [];

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
    console.log('dragPosition',this.dragPosition);
    const xPos = this.dragPosition[j].x + event.distance.x;//event.dropPoint.x - 650;
    const yPos = this.dragPosition[j].y + event.distance.y;//event.dropPoint.y - 500;
    
    this.dragPosition[j] = {x: xPos, y: yPos};

    this.notes[j].position = j;
    this.notes[j].dragPosition = this.dragPosition[j];
    //console.log('tablero:',this.tablero);

    this.notes_all = this.notes;

    let mapa_calor: any = { 'position': this.notes[j].position, 'dragPosition': this.notes[j].dragPosition };

    this._proyectsService.updateMapaCalor(this.notes[j].id, mapa_calor)
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

    //escuchamos el evento de las notas de los usuarios
    this.socketWebService.outEvenTableroMapaCalor.subscribe((res: any) => {
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
    const notes: any = localStorage.getItem('notes_mapa_calor');
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
            
            let imagenes: any = [];
            let mapa_calor: any = [];
            let position: number = 0;
            
            for(let c in this.proyecto.proyecto_recursos){
              if(this.proyecto.proyecto_recursos[c].cloud_user != null){

                  imagenes.push({'id': this.proyecto.proyecto_recursos[c].cloud_user.id,'name': this.proyecto.proyecto_recursos[c].cloud_user.name, 'secure_url': this.proyecto.proyecto_recursos[c].cloud_user.secure_url,'cloudinary_id': this.proyecto.proyecto_recursos[c].cloud_user.cloudinary_id,'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id});
                
              }

              if(this.proyecto.proyecto_recursos[c].mapa_calor != null){
                if(this.proyecto.proyecto_recursos[c].usuario_id == this.usuario.id){
                mapa_calor.push({'id': this.proyecto.proyecto_recursos[c].mapa_calor.id,'content': this.proyecto.proyecto_recursos[c].mapa_calor.contenido, 'usuario_id': this.proyecto.proyecto_recursos[c].usuario_id, 'position': this.proyecto.proyecto_recursos[c].mapa_calor.position ? this.proyecto.proyecto_recursos[c].mapa_calor.position : position, 'dragPosition': this.proyecto.proyecto_recursos[c].mapa_calor.dragPosition ? JSON.parse(this.proyecto.proyecto_recursos[c].mapa_calor.dragPosition) :  {'x': 0, 'y': 0}});
                this.dragPosition.push(this.proyecto.proyecto_recursos[c].mapa_calor.dragPosition ? JSON.parse(this.proyecto.proyecto_recursos[c].mapa_calor.dragPosition) : {x: 0, y: 0});
                
                position = position + 1;
                }
              }
            }

            this.recursos = imagenes;
            this.notes = mapa_calor;

            if(this.notes.length > 0){
              //this.socketWebService.emitEventTablero({tablero: JSON.stringify(this.notes)});
              this.sendNotes(this.notes);
            }
              
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

  //actualizamos listado de notas de usuarios
  private readBoard(tablero: any, emit: boolean){
    /*const data = JSON.parse(tablero);
    console.log('notas_all_mapa_calor',data);
    this.notes_all = data;
    
    this.notes = data;

    for(let d in data){
      this.dragPosition[data[d].position] = data[d].dragPosition;
    }

    this.ref.detectChanges();*/
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
    console.log(document.querySelectorAll('app-note-mapa-calor'));
    let notes = document.querySelectorAll('app-note-mapa-calor');

    notes.forEach((note: any, index: any)=>{
         this.notes[note.id].content = note.querySelector('.content').innerHTML;
    });

    localStorage.setItem('notes_mapa_calor', JSON.stringify(this.notes));

  }

  saveNoteAll() {
    console.log('save_notes_all_mapa_calor',this.notes_all);
    localStorage.setItem('notes_all_mapa_calor', JSON.stringify(this.notes_all));

    let mapa: any = [];
    let tablero: any = [];
    for(let n in this.notes_all){
      mapa.push({'content': this.notes_all[n].content});
    }

    tablero.push({'title': 'Como podriamos', "data": mapa});

    const data_etapa = {etapa_activa: '/proyect-init/'+this.proyecto_id+'/fase47', tablero: this.notes_all, type: 'notas'};

    this._proyectsService.updateEtapaMapaCalor(this.proyecto_id, data_etapa)
    .subscribe(
        data => {

          this.socketWebService.emitEventSetEtapa('/proyect-init/'+this.proyecto_id+'/fase47');

          this.socketWebService.emitEventTableroSaveMapaCalor({tablero: JSON.stringify(tablero)});

        },
        (response) => {
        }
    );

    //this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase47']);
  }

  continue() {
    this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase47']);
  }

  etapa_active(etapa_active: any) {
    if(etapa_active != ''){
      this._router.navigate([etapa_active]);
    }
  }

  addNote(event?: any) {
    if (event.target.value.trim() == ""){
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
    
    const position = this.notes.length - 1;
    const data = {
      proyecto_id: this.proyecto_id,
      usuario_id: this.usuario.id,
      content: event.target.value, 
      position: position,
      dragPosition: {'x': 0, 'y': 0}
    };
    
    this._proyectsService.createMapaCalor(data)
        .subscribe(
            data => {
    const id = data.mapa_calor_id;
    //const id = this.notes.length+'-'+this.usuario.nombre;
    this.notes.push({ id: id, content: event.target.value, usuario_id: this.usuario.id, position: position, dragPosition: {'x': 0, 'y': 0} });
    // sort the array
    this.notes= this.notes.sort((a: any,b: any)=>{ return b.id-a.id});
    localStorage.setItem('notes_mapa_calor', JSON.stringify(this.notes));

    this.dragPosition.push({x: 0, y: 0});

    this.ref.detectChanges();
    
    this.socketWebService.emitEventTableroUpdateMapaCalor({id: id, content: event.target.value, usuario_id: this.usuario.id, position: position,dragPosition: {'x': 0, 'y': 0} });

    $('#agregar_nota').val('');
    $('#agregar_nota').text('');
    $('#agregar_nota').focus();
  },
            (response) => {
            }
    );
    }
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
      'usuario_id': this.usuario.id
    }
    console.log('json',json);
    this.updateNote(json);
    //this.updateNoteAll(json);

    localStorage.setItem('notes_mapa_calor', JSON.stringify(this.notes));
    //this.sendNotes(this.notes);
    console.log("********* updating note *********")
    }
  }

  updateNote(newValue: any){
    this.notes.forEach((note: any, index: any)=>{
      if(note.id== newValue.id) {
        this.notes[index].content = newValue.content;
        this.socketWebService.emitEventTableroUpdateMapaCalor(newValue);
        this._proyectsService.updateMapaCalor(newValue.id,newValue)
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
      this.notes_all.push({ id: newValue.id, content:newValue.content });
    }

    this.socketWebService.emitEventTableroMapaCalor({tablero: JSON.stringify(this.notes_all)});
  }
  
  private writeBoard(){
    this.socketWebService.emitEventTableroMapaCalor({tablero: JSON.stringify(this.notes_all)});
  }

  sendNotes(notes: any){
    this.socketWebService.emitEventTableroMapaCalor({tablero: JSON.stringify(notes)});
  }

  deleteNote(event: any, idNote: any){
    event.preventDefault();
    const id = idNote/*event.srcElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id')*/;
    this.notes.forEach((note: any, index: any)=>{
      console.log('nota',note);
      if(note.id== id) {
        this.notes.splice(index,1);
        this.socketWebService.emitEventTableroDeleteMapaCalor(note);
        
        localStorage.setItem('notes_mapa_calor', JSON.stringify(this.notes));
        if(id > 0){
        this._proyectsService.deleteMapaCalor(id)
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

  disableScroll(){
    window.scrollTo(0, 0);
  }

}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
