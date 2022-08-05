import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";

const baseUrl = 'roles';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  /*public _GB: globalConfig;*/

  constructor(private http: HttpClient,
    /*public GB: globalConfig*/) {/* this._GB = GB;*/ }

  getAll(): Observable<[]> {
    return this.http.get<[]>(environment.API_G + baseUrl);
  }

  get(id: any): Observable<any> {
    return this.http.get(environment.API_G +`${baseUrl}/${id}`);
  }

  findByNombre(nombre: any): Observable<[]> {
    return this.http.get<[]>(environment.API_G +`${baseUrl}?nombre=${nombre}`);
  }
}

