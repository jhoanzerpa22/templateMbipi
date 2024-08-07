import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

      /*update(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/${id}`, data);
      }*/
      
      update(id: any, data: any): Observable<any> {
          
        const httpOptions4 = {
            headers: new HttpHeaders({ "Accept": 'application/json', 'enctype': 'multipart/form-data', }),
          };

        return this.http.put(environment.API_G +`${baseUrl}/${id}`, data, httpOptions4);
    
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

      updateEtapaMetricasClave(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaMetricasClave/${id}`, data);
      }

      updateEtapaPropuesta(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaPropuesta/${id}`, data);
      }

      updateEtapaVentajas(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaVentajas/${id}`, data);
      }

      updateEtapaCanales(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaCanales/${id}`, data);
      }

      updateEtapaEstructura(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaEstructura/${id}`, data);
      }

      updateEtapaFlujo(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaFlujo/${id}`, data);
      }
      
      updateEtapaMapaCalor(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaMapaCalor/${id}`, data);
      }

      updateEtapaBosquejarVoto(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaBosquejarVoto/${id}`, data);
      }

      updateEtapaBosquejar(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEtapaBosquejar/${id}`, data);
      }

      updateTime(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateTime/${id}`, data);
      }

      updateTimePass(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateTimePass/${id}`, data);
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

      updateMetricasClave(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateMetricasClave/${id}`, data);
      }

      updatePropuesta(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updatePropuesta/${id}`, data);
      }

      updateVentajas(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateVentajas/${id}`, data);
      }

      updateCanales(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateCanales/${id}`, data);
      }

      updateEstructura(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateEstructura/${id}`, data);
      }

      updateFlujo(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateFlujo/${id}`, data);
      }
      
      updateMapaCalor(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateMapaCalor/${id}`, data);
      }

      updateBosquejarVoto(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/updateBosquejarVoto/${id}`, data);
      }

      createNotaCp(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createNotaCp`, data);
      }

      createMetaLp(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createMetaLp`, data);
      }
      
      createPreguntaSprint(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createPreguntaSprint`, data);
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

      createMetricasClave(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createMetricasClave`, data);
      }

      createPropuesta(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createPropuesta`, data);
      }

      createVentajas(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createVentajas`, data);
      }

      createCanales(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createCanales`, data);
      }

      createEstructura(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createEstructura`, data);
      }

      createFlujo(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createFlujo`, data);
      }

      createMapaCalor(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createMapaCalor`, data);
      }

      createBosquejarVoto(data: any): Observable<any> {
        return this.http.post(environment.API_G +`${baseUrl}/createBosquejarVoto`, data);
      }

      saveFiles(data: any): Observable<any> {
        return this.http.post(environment.API_G +'cloud_user/saveFiles', data);
      }

      upload(file: File[], proyecto_id: any, usuario_id: any):Observable<any> {
        // Create form data
        const formData = new FormData(); 
          
        // Store form name as "file" with file data
        formData.append("file", file[0], file[0].name);
          
        // Make http post request over api
        // with formData as req
        return this.http.post(environment.API_G +'cloud_user/saveFiles/'+proyecto_id+'/'+usuario_id, formData);
    }
    
    uploadMulti(files: File[], proyecto_id: any, usuario_id: any):Observable<any> {
      // Create form data
      const formData = new FormData(); 
        
      formData.append("proyecto_id", proyecto_id);
      formData.append("usuario_id", usuario_id);

      // Store form name as "file" with file data
      for (let index = 0; index < files.length; index++) {
        formData.append("files[]", files[index], files[index].name);
      }
        
      // Make http post request over api
      // with formData as req
      return this.http.post(environment.API_G +'cloud_user/saveFilesMulti', formData);
      }
  
      uploadDocument(file: File[], nombre: any, proyecto_id: any, usuario_id: any):Observable<any> {
        // Create form data
        const formData = new FormData(); 
          
        // Store form name as "file" with file data
        formData.append("file", file[0], file[0].name);
          
        // Make http post request over api
        // with formData as req
        return this.http.post(environment.API_G +'cloud_user/saveFilesProyect/'+nombre+proyecto_id+'/'+usuario_id, formData);
      }

      deleteDocument(id: any, cloudinary_id: any): Observable<any> {
        return this.http.delete(environment.API_G +'cloud_user/deleteImgProyect/'+ id +'/'+cloudinary_id);
      }

      deleteImg(id: any, cloudinary_id: any): Observable<any> {
        return this.http.delete(environment.API_G +'cloud_user/deleteImg/'+ id +'/'+cloudinary_id);
      }

      delete(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/${id}`);
      }

      deleteNotaCp(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteNotaCp/${id}`);
      }

      deleteMetaLp(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteMetaLp/${id}`);
      }

      deletePreguntaSprint(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deletePreguntaSprint/${id}`);
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

      deletePropuesta(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deletePropuesta/${id}`);
      }

      deleteVentajas(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteVentajas/${id}`);
      }

      deleteCanales(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteCanales/${id}`);
      }

      deleteEstructura(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteEstructura/${id}`);
      }

      deleteFlujo(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteFlujo/${id}`);
      }

      deleteMapaCalor(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteMapaCalor/${id}`);
      }

      deleteBosquejarVoto(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteBosquejarVoto/${id}`);
      }

      deleteMetricasClave(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/deleteMetricasClave/${id}`);
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
      
      getDocuments(id: any): Observable<any> {
        return this.http.get(environment.API_G +`${baseUrl}/documentsProyect/${id}`);
      }
}
