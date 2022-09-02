import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from "../../../environments/environment";

const baseUrl = 'usuarios';

@Injectable({
    providedIn: 'root'
})
export class UsersService
{

    /**
     * Constructor
     */
    constructor(private http: HttpClient)
    {
    }

      getAll(): Observable<[]> {
        return this.http.get<[]>(environment.API_G + baseUrl);
      }
    
      get(id: any): Observable<any> {
        return this.http.get(environment.API_G +`${baseUrl}/${id}`);
      }

      getMenu(id: any, correo: any): Observable<any> {
        return this.http.get(environment.API_G +`${baseUrl}/getMenu/${id}/${correo}`);
      }
    
      create(data: any): Observable<any> {
        return this.http.post(environment.API_G + baseUrl, data);
      }
    
      update(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/${id}`, data);
      }
    
      updatePassword(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +'auth/update-password/'+id, data);
      }
    
      delete(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/${id}`);
      }
    
      deleteAll(): Observable<any> {
        return this.http.delete(environment.API_G + baseUrl);
      }
    
      findByNombre(nombre: any): Observable<[]> {
        return this.http.get<[]>(environment.API_G +`${baseUrl}?nombre=${nombre}`);
      }

      sendMail(data: any): Observable<any> {
        return this.http.post(environment.API_G + 'sendmail', data);
      }

      sendResume(user_id: any, correo: any, data:any): Observable<any> {
        return this.http.put(environment.API_G + 'sendresume/'+user_id+'/'+correo, data);
      }

      verifyLogin(data: any): Observable<any> {
        return this.http.post(environment.API_G + 'usuarios/verify', data);
      }

      updateAccount(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/account/${id}`, data);
      }

      savePayment(data: any): Observable<any> {
        return this.http.post(environment.API_G + 'usuarios/payment', data);
      }
}
