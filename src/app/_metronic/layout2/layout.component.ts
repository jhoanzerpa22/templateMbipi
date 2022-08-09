import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
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

  //Eventos sobre video
  primerEventoFlag = true;
  segundoEventoFlag = false;

  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  usuarios: any = [];
  usuario: any = {};

  constructor(/*
  private initService: LayoutInitService,
  private layout: LayoutService*/
  private socketWebService: SocketWebService
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
    this.usuarios.push(user);

    console.log('enviando_usuarios',this.usuarios);
    
    this.socketWebService.emitEventUsers(this.usuarios);

  }

  private readUsers(usuarios: any, emit: boolean){
    const data = JSON.parse(usuarios);
    //console.log('data',data);
    //this.usuarios = [];
    for(let c in data){
      this.usuarios.push({'title': data[c].nombre, 'data': data[c]});
    }
    console.log('usuarios',this.usuarios);
  }

  onPlayPause(){
    let currentTime = 0

    //Revisa si el video esta pausado mediante su propiedad 'paused'(bool)
    if($('#myVideo').prop('paused')){
      console.log('Play');
      $('#myVideo').trigger('play');

      //Cuenta los segundos desde que se hace play en el video
      var id = setInterval(()=>{

        //Asigna el valor de la propiedad 'currentTime' a la variable cada 1 segundo
        currentTime = $('#myVideo').prop('currentTime');
        console.log(currentTime);

        //Gatilla eventos cada cierto valor de currentTime
        if(currentTime >= 3 && this.primerEventoFlag){
          this.primerEventoFlag = false;
          $('#myVideo').trigger('pause');
          clearInterval(id); //Detiene intervalo
        }

        if(currentTime >= 6 && this.primerEventoFlag==false){
          this.showVideoFlag = false;
          $('#myVideo').trigger('pause');
          clearInterval(id) //Detiene intervalo
        }


      }, 500)


    }else{
      console.log('Pause')
      $('#myVideo').trigger('pause')
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


}
