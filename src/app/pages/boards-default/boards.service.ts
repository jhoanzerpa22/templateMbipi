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
  
  @Output() outEvenTableroMeta: EventEmitter<any> = new EventEmitter();
  @Output() outEvenTableroVotoMeta: EventEmitter<any> = new EventEmitter();
  
  @Output() outEvenTableroPreguntas: EventEmitter<any> = new EventEmitter();
  @Output() outEvenTableroVotoPreguntas: EventEmitter<any> = new EventEmitter();

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

    this.ioSocket.on('evento_tablero_meta', (res: any) => this.outEvenTableroMeta.emit(res));
    this.ioSocket.on('evento_tablero_voto_meta', (res: any) => this.outEvenTableroVotoMeta.emit(res));

    this.ioSocket.on('evento_tablero_preguntas', (res: any) => this.outEvenTableroPreguntas.emit(res));
    this.ioSocket.on('evento_tablero_voto_preguntas', (res: any) => this.outEvenTableroVotoPreguntas.emit(res));

  }

  emitEvent = (payload = {}, proyecto_id: any) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventGetEtapa = (payload = {}, proyecto_id: any) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento_get_etapa', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventSetEtapa = (payload = '', proyecto_id: any) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento_set_etapa', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventGet = (payload = {}, proyecto_id: any) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento_get', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventGetClasi = (payload = {}, proyecto_id: any) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento_get_clasi', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEvent2 = (payload = {}, proyecto_id: any) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento2', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventUsers = (payload = {}, proyecto_id: any) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento_usuarios', {payload: payload, proyecto_id: proyecto_id})
  }
  
  emitEventUsersActive = (payload = {}, proyecto_id: any) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento_usuarios_activos', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventUsersInactive = (payload = {}, proyecto_id: any) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento_usuarios_inactivos', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTablero = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero',payload);
    this.ioSocket.emit('evento_tablero', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroVoto = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_voto',payload);
    this.ioSocket.emit('evento_tablero_voto', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroSave = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_save',payload);
    this.ioSocket.emit('evento_tablero_save', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroSaveClasi = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_save_clasi',payload);
    this.ioSocket.emit('evento_tablero_save_clasi', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroSaveVoto = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_save_voto',payload);
    this.ioSocket.emit('evento_tablero_save_voto', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroDelete = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_delete',payload);
    this.ioSocket.emit('evento_tablero_delete', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroUpdate = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_update',payload);
    this.ioSocket.emit('evento_tablero_update', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroMeta = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_meta',payload);
    this.ioSocket.emit('evento_tablero_meta', {payload: payload, proyecto_id: proyecto_id})
  }
  
  emitEventTableroVotoMeta = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_voto_meta',payload);
    this.ioSocket.emit('evento_tablero_voto_meta', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroSaveMeta = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_save_meta',payload);
    this.ioSocket.emit('evento_tablero_save_meta', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroSaveVotoMeta = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_save_voto_meta',payload);
    this.ioSocket.emit('evento_tablero_save_voto_meta', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroDeleteMeta = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_delete_meta',payload);
    this.ioSocket.emit('evento_tablero_delete_meta', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroUpdateMeta = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_update_meta',payload);
    this.ioSocket.emit('evento_tablero_update_meta', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroPreguntas = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_preguntas',payload);
    this.ioSocket.emit('evento_tablero_preguntas', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroVotoPreguntas = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_voto_preguntas',payload);
    this.ioSocket.emit('evento_tablero_voto_preguntas', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroSavePreguntas = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_save_preguntas',payload);
    this.ioSocket.emit('evento_tablero_save_preguntas', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroSaveVotoPreguntas = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_save_voto_preguntas',payload);
    this.ioSocket.emit('evento_tablero_save_voto_preguntas', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroDeletePreguntas = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_delete_preguntas',payload);
    this.ioSocket.emit('evento_tablero_delete_preguntas', {payload: payload, proyecto_id: proyecto_id})
  }

  emitEventTableroUpdatePreguntas = (payload = {}, proyecto_id: any) => {
    console.log('evento_tablero_update_preguntas',payload);
    this.ioSocket.emit('evento_tablero_update_preguntas', {payload: payload, proyecto_id: proyecto_id})
  }
}
