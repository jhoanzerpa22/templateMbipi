import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';/*
import { LayoutService } from './core/layout.service';
import { LayoutInitService } from './core/layout-init.service';*/
import * as $ from 'jquery';
import { SocketWebService } from '../../pages/boards/boards.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, AfterViewInit {
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

  usuarios: any = [];
  usuario: any = {};

  notes: any = [];
  recognition:any;
  notes_all: any = [];

  constructor(/*
  private initService: LayoutInitService,
  private layout: LayoutService*/
  private el:ElementRef,
  private socketWebService: SocketWebService,
  private ref: ChangeDetectorRef,
  private modalService: NgbModal
  ) {
    /*this.initService.init();*/
    this.socketWebService.outEvenUsers.subscribe((res: any) => {
      //console.log('escucha_tablero',res);
      const { usuarios } = res;
      console.log('escuchando',res);
      this.readUsers(usuarios, false);
    });

    this.socketWebService.outEvenTablero.subscribe((res: any) => {
      console.log('escucha_tablero',res);
      const { tablero } = res;
      this.readBoard(tablero, false);
    });

    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;

    const notes: any = localStorage.getItem('notes');
    this.notes = JSON.parse(notes) || [{ id: 0+'-'+this.usuario.nombre,content:'' }];

    const {webkitSpeechRecognition} : IWindow = <any>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onresult = (event: any)=> {
      console.log(this.el.nativeElement.querySelectorAll(".content")[0]);
      this.el.nativeElement.querySelectorAll(".content")[0].innerText = event.results[0][0].transcript

    };
  }

  ngOnInit(): void {

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

    //this.usuarios = [];
    const index = this.usuarios.findIndex((c: any) => c.id == this.usuario.id);
    
    if (index != -1) {
      this.usuarios.splice(index, 1);
    }
  this.usuarios.push({'id': this.usuario.id, 'title': this.usuario.nombre/*, 'data': this.usuario*/});

    console.log('enviando_usuarios',this.usuarios);

    this.socketWebService.emitEventUsers({usuarios: JSON.stringify(this.usuarios)});
    this.ref.detectChanges();
  }

  private readUsers(usuarios: any, emit: boolean){
    const data = JSON.parse(usuarios);
    //console.log('data',data);
    //this.usuarios = [];
    let nuevo: number = 0;
    for(let c in data){
      let index = this.usuarios.findIndex((u: any) => u.id == data[c].id);
    
      if (index != -1) {
        //this.usuarios.splice(index, 1);
      }else{
        nuevo = 1;
        
        this.usuarios.push({'id': data[c].id, 'title': data[c].title/*typeof data[c].nombre !== 'undefined' ? data[c].nombre : data[c].data.nombre, 'data': data[c]*/});
      }
    }
    console.log('usuarios',this.usuarios);
    if(nuevo == 1){
      this.socketWebService.emitEventUsers({usuarios: JSON.stringify(this.usuarios)});
      this.ref.detectChanges();
    }
    
  }

  private readBoard(tablero: any, emit: boolean){
    const data = JSON.parse(tablero);
    //console.log('data',data);
    this.notes_all = [];
    for(let c in data){
      this.notes_all.push({'id': data[c].id, 'title': data[c].title, "data": data[c].data});
    }

  }

  onPlayPause(){
    //Revisa si el video esta pausado mediante su propiedad 'paused'(bool)
    this.playing= true;
    if($('#myVideo').prop('paused')){
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
    }

  }
  // onPause(){

  //   $('#myVideo').trigger('pause')
  // }

  // videoCurrentTime(){
  //   let currentTime = 0
  //   do {
  //       console.log(currentTime)
  //       currentTime = $('#myVideo').prop('currentTime')
  //       currentTime +=1
  //   } while(currentTime <= 3 )
  //   $('#myVideo').trigger('pause')
  // }
  // const ct = $('#myVideo').prop('currentTime')
  // console.log("Current Time:", ct)

  displayVideo(){
    this.showVideoFlag = true;
  }

  hideVideo(){
    this.showVideoFlag = false;
  }

  updateAllNotes() {
    console.log(document.querySelectorAll('app-note'));
    let notes = document.querySelectorAll('app-note');

    notes.forEach((note: any, index: any)=>{
         this.notes[note.id].content = note.querySelector('.content').innerHTML;
    });

    localStorage.setItem('notes', JSON.stringify(this.notes));

  }

  addNote () {
    this.notes.push({ id: /*this.notes.length + 1*/(this.notes.length + 1)+'-'+this.usuario.nombre,content:'' });
    // sort the array
    this.notes= this.notes.sort((a: any,b: any)=>{ return b.id-a.id});
    localStorage.setItem('notes', JSON.stringify(this.notes));
  };

  saveNote(event: any){
    console.log('event',event);
    const id = event.srcElement.parentElement.parentElement/*.parentElement.parentElement*/.getAttribute('id');
    const content = event.target.innerText;
    event.target.innerText = content;
    const json = {
      'id':id,
      'content':content
    }
    console.log('json',json);
    this.updateNote(json);
    this.updateNoteAll(json);

    this.socketWebService.emitEventTablero({tablero: JSON.stringify(this.notes_all)});
    localStorage.setItem('notes', JSON.stringify(this.notes));
    console.log("********* updating note *********")
  }

  updateNote(newValue: any){
    this.notes.forEach((note: any, index: any)=>{
      if(note.id== newValue.id) {
        this.notes[index].content = newValue.content;
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
      this.notes_all.push({ id: newValue.id,content:newValue.content });
    }
  }

  deleteNote(event: any){
     const id = event.srcElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
     this.notes.forEach((note: any, index: any)=>{
      console.log('nota',note);
      if(note.id== id) {
        this.notes.splice(index,1);
        localStorage.setItem('notes', JSON.stringify(this.notes));
        console.log("********* deleting note *********")
        return;
      }
    });
  }

   record(event: any) {
    this.recognition.start();
    this.addNote();
  }


}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
