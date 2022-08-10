import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit, ChangeDetectorRef
} from '@angular/core';/*
import { LayoutService } from './core/layout.service';
import { LayoutInitService } from './core/layout-init.service';*/
import * as $ from 'jquery';
import { SocketWebService } from '../../pages/boards/boards.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
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

  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  usuarios: any = [];
  usuario: any = {};

  constructor(/*
  private initService: LayoutInitService,
  private layout: LayoutService*/
  private socketWebService: SocketWebService,
  private ref:ChangeDetectorRef
  ) {
    /*this.initService.init();*/
    this.socketWebService.outEvenUsers.subscribe((res: any) => {
      //console.log('escucha_tablero',res);
      const { usuarios } = res;
      console.log('escuchando',res);
      this.readUsers(usuarios, false);
    });
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
    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;

    this.usuarios = [];
    this.usuarios.push({'title': user.nombre, 'data': user});
    
    console.log('enviando_usuario',this.usuarios);
    
    this.socketWebService.emitEventUsers({usuarios: JSON.stringify(this.usuarios)});

  }

  private readUsers(usuarios: any, emit: boolean){
    const data = JSON.parse(usuarios);
    //console.log('data',data);
    //this.usuarios = [];
    for(let c in data){  
        this.usuarios.push({'title': typeof data[c].nombre !== 'undefined' ? data[c].nombre : data[c].data.nombre, 'data': data[c]});
    }
    console.log('usuarios',this.usuarios);
    this.ref.detectChanges();
  }

  onPlay(){
    console.log("PLAY")
    $('#myVideo').trigger('play')
  }
  onPause(){
    console.log("PAUSE")
    $('#myVideo').trigger('pause')
  }
  videoCurrentTime(){
    const ct = $('#myVideo').prop('currentTime')
    console.log("Current Time:", ct)
  }

  displayVideo(){
    this.showVideoFlag = true;
  }

  hideVideo(){
    this.showVideoFlag = false;
  }


}
