import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from "../../../environments/environment";

const baseUrl = 'proyectos';

@Injectable({
    providedIn: 'root'
})
export class ProyectsService
{

    /**
     * Constructor
     */
    constructor(private http: HttpClient)
    {}

      getAll(): Observable<[]> {
        return this.http.get<[]>(environment.API_G + baseUrl);
      }

      get(id: any): Observable<any> {
        return this.http.get(environment.API_G +`${baseUrl}/${id}`);
      }

      dashboard(id: any, correo: any): Observable<any> {
        return this.http.get(environment.API_G +`${baseUrl}/byUsuario/${id}/${correo}`);
      }

      create(data: any): Observable<any> {
        return this.http.post(environment.API_G + baseUrl, data);
      }

      update(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/${id}`, data);
      }

      updateMembers(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateMembers/${id}`, data);
      }

      updateStatus(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateStatus/${id}`, data);
      }

      updateEtapa(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapa/${id}`, data);
      }

      updateEtapaMeta(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaMeta/${id}`, data);
      }

      updateEtapaPreguntas(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaPreguntas/${id}`, data);
      }

      updateTime(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateTime/${id}`, data);
      }

      updateNotaCp(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateNotaCp/${id}`, data);
      }

      updateMetaLp(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateMetaLp/${id}`, data);
      }

      updatePreguntaSprint(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updatePreguntaSprint/${id}`, data);
      }

      delete(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/${id}`);
      }

      deleteNotaCp(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteNotaCp/${id}`);
      }

      deleteMetaLp(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteNotaCp/${id}`);
      }

      deletePreguntaSprint(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteNotaCp/${id}`);
      }

      deleteMember(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteMember/${id}`);
      }

      deleteAll(): Observable<any> {
        return this.http.delete(environment.API_G + baseUrl);
      }

      findByNombre(nombre: any): Observable<[]> {
        return this.http.get<[]>(environment.API_G +`${baseUrl}?nombre=${nombre}`);
      }

      invitations(data: any): Observable<any> {
        return this.http.post(environment.API_G + 'invitacions', data);
      }
}
