import { EventEmitter, Injectable, Output } from '@angular/core';
//import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {

  @Output() outEven: EventEmitter<any> = new EventEmitter();
  @Output() outEven2: EventEmitter<any> = new EventEmitter();
  @Output() outEvenUsers: EventEmitter<any> = new EventEmitter();
  @Output() outEvenUsersActive: EventEmitter<any> = new EventEmitter();
  @Output() outEvenTablero: EventEmitter<any> = new EventEmitter();
  @Output() outEvenTableroVoto: EventEmitter<any> = new EventEmitter();
  @Output() outEvenContinue: EventEmitter<any> = new EventEmitter();
  @Output() outEvenContinueVoto: EventEmitter<any> = new EventEmitter();
  @Output() outEvenEtapaActive: EventEmitter<any> = new EventEmitter();

  constructor(
    //public cookieService: CookieService,
  ) {
    super({
      url: environment.API,//'https://mbipi.tresidea.cl/',
      options: {
        query: {
          nameRoom: 'mbipi'//cookieService.get('room')
        },
        transports: ['websocket'],
        jsonp: false
      }
    })
    this.listen();
  }

  listen = () => {
    this.ioSocket.on('evento', (res: any) => this.outEven.emit(res));
    this.ioSocket.on('evento2', (res: any) => this.outEven2.emit(res));
    this.ioSocket.on('evento_usuarios', (res: any) => this.outEvenUsers.emit(res));
    this.ioSocket.on('evento_usuarios_activos', (res: any) => this.outEvenUsersActive.emit(res));
    this.ioSocket.on('evento_tablero', (res: any) => this.outEvenTablero.emit(res));
    this.ioSocket.on('evento_tablero_voto', (res: any) => this.outEvenTableroVoto.emit(res));
    this.ioSocket.on('evento_continue', (res: any) => this.outEvenContinue.emit(res));
    this.ioSocket.on('evento_continue_voto', (res: any) => this.outEvenContinueVoto.emit(res));
    this.ioSocket.on('evento_etapa_active', (res: any) => this.outEvenEtapaActive.emit(res));

  }
  emitEvent = (payload = {}) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento', payload)
  }

  emitEventGetEtapa = (payload = {}) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento_get_etapa', payload)
  }

  emitEventSetEtapa = (payload = '') => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento_set_etapa', payload)
  }

  emitEventGet = (payload = {}) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento_get', payload)
  }

  emitEventGetClasi = (payload = {}) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento_get_clasi', payload)
  }

  emitEvent2 = (payload = {}) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento2', payload)
  }

  emitEventUsers = (payload = {}) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento_usuarios', payload)
  }
  
  emitEventUsersActive = (payload = {}) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento_usuarios_activos', payload)
  }

  emitEventUsersInactive = (payload = {}) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento_usuarios_inactivos', payload)
  }

  emitEventTablero = (payload = {}) => {
    console.log('evento_tablero',payload);
    this.ioSocket.emit('evento_tablero', payload)
  }

  emitEventTableroVoto = (payload = {}) => {
    console.log('evento_tablero_voto',payload);
    this.ioSocket.emit('evento_tablero_voto', payload)
  }

  emitEventTableroSave = (payload = {}) => {
    console.log('evento_tablero_save',payload);
    this.ioSocket.emit('evento_tablero_save', payload)
  }

  emitEventTableroSaveClasi = (payload = {}) => {
    console.log('evento_tablero_save_clasi',payload);
    this.ioSocket.emit('evento_tablero_save_clasi', payload)
  }

  emitEventTableroDelete = (payload = {}) => {
    console.log('evento_tablero_delete',payload);
    this.ioSocket.emit('evento_tablero_delete', payload)
  }

  emitEventTableroUpdate = (payload = {}) => {
    console.log('evento_tablero_update',payload);
    this.ioSocket.emit('evento_tablero_update', payload)
  }
}
