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
      
      updateEtapaMapa(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaMapa/${id}`, data);
      }

      updateEtapaNecesidades(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaNecesidades/${id}`, data);
      }

      updateEtapaPropositos(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaPropositos/${id}`, data);
      }

      updateEtapaObjetivos(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaObjetivos/${id}`, data);
      }

      updateEtapaAcciones(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaAcciones/${id}`, data);
      }

      updateEtapaMetricas(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaMetricas/${id}`, data);
      }

      updateEtapaProblema(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaProblema/${id}`, data);
      }

      updateEtapaClientes(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaClientes/${id}`, data);
      }

      updateEtapaSolucion(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaSolucion/${id}`, data);
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

      updateMapaux(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateMapaux/${id}`, data);
      }

      updatePropositos(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updatePropositos/${id}`, data);
      }

      updateNecesidades(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateNecesidades/${id}`, data);
      }

      updateObjetivos(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateObjetivos/${id}`, data);
      }

      updateAcciones(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateAcciones/${id}`, data);
      }

      updateMetricas(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateMetricas/${id}`, data);
      }

      updateProblema(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateProblema/${id}`, data);
      }

      updateClientes(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateClientes/${id}`, data);
      }

      updateSolucion(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateSolucion/${id}`, data);
      }
      
      createPropositos(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createPropositos`, data);
      }

      createNecesidades(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createNecesidades`, data);
      }

      createObjetivos(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createObjetivos`, data);
      }

      createAcciones(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createAcciones`, data);
      }

      createMetricas(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createMetricas`, data);
      }

      createProblema(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createProblema`, data);
      }

      createClientes(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createClientes`, data);
      }

      createSolucion(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createSolucion`, data);
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

      deleteNecesidades(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteNecesidades/${id}`);
      }

      deletePropositos(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deletePropositos/${id}`);
      }

      deleteObjetivos(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteObjetivos/${id}`);
      }

      deleteAcciones(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteAcciones/${id}`);
      }

      deleteMetricas(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteMetricas/${id}`);
      }

      deleteProblema(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteProblema/${id}`);
      }

      deleteClientes(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteClientes/${id}`);
      }

      deleteSolucion(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteSolucion/${id}`);
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
