import { EventEmitter, Injectable, Output } from '@angular/core';
//import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {

  private proyecto_id: any = '';

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

  @Output() outEvenTableroNecesidades: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroPropositos: EventEmitter<any> = new EventEmitter();
  @Output() outEvenTableroVotoPropositos: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroObjetivos: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroAcciones: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroMetricas: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroProblema: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroClientes: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroSolucion: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroMetricasClave: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroPropuesta: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroVentajas: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroCanales: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroEstructura: EventEmitter<any> = new EventEmitter();

  @Output() outEvenTableroFlujo: EventEmitter<any> = new EventEmitter();

  constructor(
    //public cookieService: CookieService,
  ) {
    super({
      url: environment.API,//'https://mbipi.tresidea.cl/',
      options: {
        query: {
          nombreCurso: 'Proyecto-'+localStorage.getItem('proyecto_id'),//'mbipi'//cookieService.get('room')
        },
        transports: ['websocket'],
        jsonp: false
      }
    })
    this.proyecto_id = localStorage.getItem('proyecto_id');
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

    this.ioSocket.on('evento_tablero_necesidades', (res: any) => this.outEvenTableroNecesidades.emit(res));

    this.ioSocket.on('evento_tablero_objetivos', (res: any) => this.outEvenTableroObjetivos.emit(res));

    this.ioSocket.on('evento_tablero_propositos', (res: any) => this.outEvenTableroPropositos.emit(res));
    this.ioSocket.on('evento_tablero_voto_propositos', (res: any) => this.outEvenTableroVotoPropositos.emit(res));

    this.ioSocket.on('evento_tablero_acciones', (res: any) => this.outEvenTableroAcciones.emit(res));

    this.ioSocket.on('evento_tablero_metricas', (res: any) => this.outEvenTableroMetricas.emit(res));

    this.ioSocket.on('evento_tablero_problema', (res: any) => this.outEvenTableroProblema.emit(res));

    this.ioSocket.on('evento_tablero_cliente', (res: any) => this.outEvenTableroClientes.emit(res));

    this.ioSocket.on('evento_tablero_solucion', (res: any) => this.outEvenTableroSolucion.emit(res));

    this.ioSocket.on('evento_tablero_metricas_clave', (res: any) => this.outEvenTableroMetricasClave.emit(res));

    this.ioSocket.on('evento_tablero_propuesta', (res: any) => this.outEvenTableroPropuesta.emit(res));

    this.ioSocket.on('evento_tablero_ventajas', (res: any) => this.outEvenTableroVentajas.emit(res));

    this.ioSocket.on('evento_tablero_canales', (res: any) => this.outEvenTableroCanales.emit(res));

    this.ioSocket.on('evento_tablero_estructura', (res: any) => this.outEvenTableroEstructura.emit(res));

    this.ioSocket.on('evento_tablero_flujo', (res: any) => this.outEvenTableroFlujo.emit(res));

  }

  emitLogin = (payload: any) => {
    this.ioSocket.emit('login', payload)
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
    console.log('usuarios_inactivos_nombre_curso',localStorage.getItem('proyecto_id'));
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

  emitEventTableroSaveVoto = (payload = {}) => {
    console.log('evento_tablero_save_voto',payload);
    this.ioSocket.emit('evento_tablero_save_voto', payload)
  }

  emitEventTableroDelete = (payload = {}) => {
    console.log('evento_tablero_delete',payload);
    this.ioSocket.emit('evento_tablero_delete', payload)
  }

  emitEventTableroUpdate = (payload = {}) => {
    console.log('evento_tablero_update',payload);
    this.ioSocket.emit('evento_tablero_update', payload)
  }

  emitEventTableroMeta = (payload = {}) => {
    console.log('evento_tablero_meta',payload);
    this.ioSocket.emit('evento_tablero_meta', payload)
  }
  
  emitEventTableroVotoMeta = (payload = {}) => {
    console.log('evento_tablero_voto_meta',payload);
    this.ioSocket.emit('evento_tablero_voto_meta', payload)
  }

  emitEventTableroSaveMeta = (payload = {}) => {
    console.log('evento_tablero_save_meta',payload);
    this.ioSocket.emit('evento_tablero_save_meta', payload)
  }

  emitEventTableroSaveVotoMeta = (payload = {}) => {
    console.log('evento_tablero_save_voto_meta',payload);
    this.ioSocket.emit('evento_tablero_save_voto_meta', payload)
  }

  emitEventTableroDeleteMeta = (payload = {}) => {
    console.log('evento_tablero_delete_meta',payload);
    this.ioSocket.emit('evento_tablero_delete_meta', payload)
  }

  emitEventTableroUpdateMeta = (payload = {}) => {
    console.log('evento_tablero_update_meta',payload);
    this.ioSocket.emit('evento_tablero_update_meta', payload)
  }

  emitEventTableroPreguntas = (payload = {}) => {
    console.log('evento_tablero_preguntas',payload);
    this.ioSocket.emit('evento_tablero_preguntas', payload)
  }

  emitEventTableroVotoPreguntas = (payload = {}) => {
    console.log('evento_tablero_voto_preguntas',payload);
    this.ioSocket.emit('evento_tablero_voto_preguntas', payload)
  }

  emitEventTableroSavePreguntas = (payload = {}) => {
    console.log('evento_tablero_save_preguntas',payload);
    this.ioSocket.emit('evento_tablero_save_preguntas', payload)
  }

  emitEventTableroSaveVotoPreguntas = (payload = {}) => {
    console.log('evento_tablero_save_voto_preguntas',payload);
    this.ioSocket.emit('evento_tablero_save_voto_preguntas', payload)
  }

  emitEventTableroDeletePreguntas = (payload = {}) => {
    console.log('evento_tablero_delete_preguntas',payload);
    this.ioSocket.emit('evento_tablero_delete_preguntas', payload)
  }

  emitEventTableroUpdatePreguntas = (payload = {}) => {
    console.log('evento_tablero_update_preguntas',payload);
    this.ioSocket.emit('evento_tablero_update_preguntas', payload)
  }

  emitEventTableroSaveMapa = (payload = {}) => {
    console.log('evento_tablero_save_mapa',payload);
    this.ioSocket.emit('evento_tablero_save_mapa', payload)
  }

  emitEventTableroSaveNecesidades = (payload = {}) => {
    console.log('evento_tablero_save_necesidades',payload);
    this.ioSocket.emit('evento_tablero_save_necesidades', payload)
  }

  emitEventTableroUpdateNecesidades = (payload = {}) => {
    console.log('evento_tablero_update_necesidades',payload);
    this.ioSocket.emit('evento_tablero_update_necesidades', payload)
  }

  emitEventTableroNecesidades = (payload = {}) => {
    console.log('evento_tablero_necesidades',payload);
    this.ioSocket.emit('evento_tablero_necesidades', payload)
  }

  emitEventTableroDeleteNecesidades = (payload = {}) => {
    console.log('evento_tablero_delete_necesidades',payload);
    this.ioSocket.emit('evento_tablero_delete_necesidades', payload)
  }

  emitEventTableroPropositos = (payload = {}) => {
    console.log('evento_tablero_propositos',payload);
    this.ioSocket.emit('evento_tablero_propositos', payload)
  }
  
  emitEventTableroVotoPropositos = (payload = {}) => {
    console.log('evento_tablero_voto_propositos',payload);
    this.ioSocket.emit('evento_tablero_voto_propositos', payload)
  }

  emitEventTableroSavePropositos = (payload = {}) => {
    console.log('evento_tablero_save_propositos',payload);
    this.ioSocket.emit('evento_tablero_save_propositos', payload)
  }

  emitEventTableroSaveVotoPropositos = (payload = {}) => {
    console.log('evento_tablero_save_voto_propositos',payload);
    this.ioSocket.emit('evento_tablero_save_voto_propositos', payload)
  }

  emitEventTableroDeletePropositos = (payload = {}) => {
    console.log('evento_tablero_delete_propositos',payload);
    this.ioSocket.emit('evento_tablero_delete_propositos', payload)
  }

  emitEventTableroUpdatePropositos = (payload = {}) => {
    console.log('evento_tablero_update_propositos',payload);
    this.ioSocket.emit('evento_tablero_update_propositos', payload)
  }

  emitEventTableroSaveObjetivos = (payload = {}) => {
    console.log('evento_tablero_save_objetivos',payload);
    this.ioSocket.emit('evento_tablero_save_objetivos', payload)
  }

  emitEventTableroUpdateObjetivos = (payload = {}) => {
    console.log('evento_tablero_update_objetivos',payload);
    this.ioSocket.emit('evento_tablero_update_objetivos', payload)
  }

  emitEventTableroObjetivos = (payload = {}) => {
    console.log('evento_tablero_objetivos',payload);
    this.ioSocket.emit('evento_tablero_objetivos', payload)
  }

  emitEventTableroDeleteObjetivos = (payload = {}) => {
    console.log('evento_tablero_delete_objetivos',payload);
    this.ioSocket.emit('evento_tablero_delete_objetivos', payload)
  }

  emitEventTableroSaveAcciones = (payload = {}) => {
    console.log('evento_tablero_save_acciones',payload);
    this.ioSocket.emit('evento_tablero_save_acciones', payload)
  }

  emitEventTableroUpdateAcciones = (payload = {}) => {
    console.log('evento_tablero_update_acciones',payload);
    this.ioSocket.emit('evento_tablero_update_acciones', payload)
  }

  emitEventTableroAcciones = (payload = {}) => {
    console.log('evento_tablero_acciones',payload);
    this.ioSocket.emit('evento_tablero_acciones', payload)
  }

  emitEventTableroDeleteAcciones = (payload = {}) => {
    console.log('evento_tablero_delete_acciones',payload);
    this.ioSocket.emit('evento_tablero_delete_acciones', payload)
  }

  emitEventTableroSaveMetricas = (payload = {}) => {
    console.log('evento_tablero_save_metricas',payload);
    this.ioSocket.emit('evento_tablero_save_metricas', payload)
  }

  emitEventTableroUpdateMetricas = (payload = {}) => {
    console.log('evento_tablero_update_metricas',payload);
    this.ioSocket.emit('evento_tablero_update_metricas', payload)
  }

  emitEventTableroMetricas = (payload = {}) => {
    console.log('evento_tablero_metricas',payload);
    this.ioSocket.emit('evento_tablero_metricas', payload)
  }

  emitEventTableroDeleteMetricas = (payload = {}) => {
    console.log('evento_tablero_delete_metricas',payload);
    this.ioSocket.emit('evento_tablero_delete_metricas', payload)
  }

  emitEventTableroSaveProblema = (payload = {}) => {
    console.log('evento_tablero_save_problema',payload);
    this.ioSocket.emit('evento_tablero_save_problema', payload)
  }

  emitEventTableroUpdateProblema = (payload = {}) => {
    console.log('evento_tablero_update_problema',payload);
    this.ioSocket.emit('evento_tablero_update_problema', payload)
  }

  emitEventTableroProblema = (payload = {}) => {
    console.log('evento_tablero_problema',payload);
    this.ioSocket.emit('evento_tablero_problema', payload)
  }

  emitEventTableroDeleteProblema = (payload = {}) => {
    console.log('evento_tablero_delete_problema',payload);
    this.ioSocket.emit('evento_tablero_delete_problema', payload)
  }
  
  emitEventTableroSaveClientes = (payload = {}) => {
    console.log('evento_tablero_save_clientes',payload);
    this.ioSocket.emit('evento_tablero_save_clientes', payload)
  }

  emitEventTableroUpdateClientes = (payload = {}) => {
    console.log('evento_tablero_update_clientes',payload);
    this.ioSocket.emit('evento_tablero_update_clientes', payload)
  }

  emitEventTableroClientes = (payload = {}) => {
    console.log('evento_tablero_clientes',payload);
    this.ioSocket.emit('evento_tablero_clientes', payload)
  }

  emitEventTableroDeleteClientes = (payload = {}) => {
    console.log('evento_tablero_delete_clientes',payload);
    this.ioSocket.emit('evento_tablero_delete_clientes', payload)
  }
  
  emitEventTableroSaveSolucion = (payload = {}) => {
    console.log('evento_tablero_save_solucion',payload);
    this.ioSocket.emit('evento_tablero_save_solucion', payload)
  }

  emitEventTableroUpdateSolucion = (payload = {}) => {
    console.log('evento_tablero_update_solucion',payload);
    this.ioSocket.emit('evento_tablero_update_solucion', payload)
  }

  emitEventTableroSolucion = (payload = {}) => {
    console.log('evento_tablero_solucion',payload);
    this.ioSocket.emit('evento_tablero_solucion', payload)
  }

  emitEventTableroDeleteSolucion = (payload = {}) => {
    console.log('evento_tablero_delete_solucion',payload);
    this.ioSocket.emit('evento_tablero_delete_solucion', payload)
  }

  emitEventTableroSaveMetricasClave = (payload = {}) => {
    console.log('evento_tablero_save_metricas_clave',payload);
    this.ioSocket.emit('evento_tablero_save_metricas_clave', payload)
  }

  emitEventTableroUpdateMetricasClave = (payload = {}) => {
    console.log('evento_tablero_update_metricas_clave',payload);
    this.ioSocket.emit('evento_tablero_update_metricas_clave', payload)
  }

  emitEventTableroMetricasClave = (payload = {}) => {
    console.log('evento_tablero_metricas_clave',payload);
    this.ioSocket.emit('evento_tablero_metricas_clave', payload)
  }

  emitEventTableroDeleteMetricasClave = (payload = {}) => {
    console.log('evento_tablero_delete_metricas_clave',payload);
    this.ioSocket.emit('evento_tablero_delete_metricas_clave', payload)
  }
  
  emitEventTableroSavePropuesta = (payload = {}) => {
    console.log('evento_tablero_save_propuesta',payload);
    this.ioSocket.emit('evento_tablero_save_propuesta', payload)
  }

  emitEventTableroUpdatePropuesta = (payload = {}) => {
    console.log('evento_tablero_update_propuesta',payload);
    this.ioSocket.emit('evento_tablero_update_propuesta', payload)
  }

  emitEventTableroPropuesta = (payload = {}) => {
    console.log('evento_tablero_propuesta',payload);
    this.ioSocket.emit('evento_tablero_propuesta', payload)
  }

  emitEventTableroDeletePropuesta = (payload = {}) => {
    console.log('evento_tablero_delete_propuesta',payload);
    this.ioSocket.emit('evento_tablero_delete_propuesta', payload)
  }

  
  emitEventTableroSaveVentajas = (payload = {}) => {
    console.log('evento_tablero_save_ventajas',payload);
    this.ioSocket.emit('evento_tablero_save_ventajas', payload)
  }

  emitEventTableroUpdateVentajas = (payload = {}) => {
    console.log('evento_tablero_update_ventajas',payload);
    this.ioSocket.emit('evento_tablero_update_ventajas', payload)
  }

  emitEventTableroVentajas = (payload = {}) => {
    console.log('evento_tablero_ventajas',payload);
    this.ioSocket.emit('evento_tablero_ventajas', payload)
  }

  emitEventTableroDeleteVentajas = (payload = {}) => {
    console.log('evento_tablero_delete_ventajas',payload);
    this.ioSocket.emit('evento_tablero_delete_ventajas', payload)
  }

  
  emitEventTableroSaveCanales = (payload = {}) => {
    console.log('evento_tablero_save_canales',payload);
    this.ioSocket.emit('evento_tablero_save_canales', payload)
  }

  emitEventTableroUpdateCanales = (payload = {}) => {
    console.log('evento_tablero_update_canales',payload);
    this.ioSocket.emit('evento_tablero_update_canales', payload)
  }

  emitEventTableroCanales = (payload = {}) => {
    console.log('evento_tablero_canales',payload);
    this.ioSocket.emit('evento_tablero_canales', payload)
  }

  emitEventTableroDeleteCanales = (payload = {}) => {
    console.log('evento_tablero_delete_canales',payload);
    this.ioSocket.emit('evento_tablero_delete_canales', payload)
  }

  
  emitEventTableroSaveEstructura = (payload = {}) => {
    console.log('evento_tablero_save_estructura',payload);
    this.ioSocket.emit('evento_tablero_save_estructura', payload)
  }

  emitEventTableroUpdateEstructura = (payload = {}) => {
    console.log('evento_tablero_update_estructura',payload);
    this.ioSocket.emit('evento_tablero_update_estructura', payload)
  }

  emitEventTableroEstructura = (payload = {}) => {
    console.log('evento_tablero_estructura',payload);
    this.ioSocket.emit('evento_tablero_estructura', payload)
  }

  emitEventTableroDeleteEstructura = (payload = {}) => {
    console.log('evento_tablero_delete_estructura',payload);
    this.ioSocket.emit('evento_tablero_delete_estructura', payload)
  }

  
  emitEventTableroSaveFlujo = (payload = {}) => {
    console.log('evento_tablero_save_flujo',payload);
    this.ioSocket.emit('evento_tablero_save_flujo', payload)
  }

  emitEventTableroUpdateFlujo = (payload = {}) => {
    console.log('evento_tablero_update_flujo',payload);
    this.ioSocket.emit('evento_tablero_update_flujo', payload)
  }

  emitEventTableroFlujo = (payload = {}) => {
    console.log('evento_tablero_flujo',payload);
    this.ioSocket.emit('evento_tablero_flujo', payload)
  }

  emitEventTableroDeleteFlujo = (payload = {}) => {
    console.log('evento_tablero_delete_flujo',payload);
    this.ioSocket.emit('evento_tablero_delete_flujo', payload)
  }

}
