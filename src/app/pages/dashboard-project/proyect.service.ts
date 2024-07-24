import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProyectService {

  private _changes = new BehaviorSubject<any[]>([]);

  _changes$ = this._changes.asObservable();

	setChanges(changes: any) {
        console.log('Cambio===>',changes);
    	this._changes.next(changes);
  	}

}
