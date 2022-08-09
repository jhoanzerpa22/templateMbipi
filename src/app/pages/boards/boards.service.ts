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
  constructor(
    //public cookieService: CookieService,
  ) {
    super({
      url: environment.API,//'https://mbipi.tresidea.cl/',
      options: {
        query: {
          nameRoom: 'mbipi'//cookieService.get('room')
        },
      }
    })
    this.listen();
  }

  listen = () => {
    this.ioSocket.on('evento', (res: any) => this.outEven.emit(res));
    this.ioSocket.on('evento2', (res: any) => this.outEven2.emit(res));

  }
  emitEvent = (payload = {}) => {
    //console.log('evento',payload);
    this.ioSocket.emit('evento', payload)
  }

  emitEvent2 = (payload = {}) => {
    //console.log('evento2',payload);
    this.ioSocket.emit('evento2', payload)

  }
}
