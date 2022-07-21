import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from "../../../environments/environment";

const baseUrl = 'invitaciones';

@Injectable({
    providedIn: 'root'
})
export class InvitationsService
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

      getByEmail(email: any): Observable<any> {
        return this.http.get(environment.API_G +`${baseUrl}/byEmail/${email}`);
      }

      create(data: any): Observable<any> {
        return this.http.post(environment.API_G + baseUrl, data);
      }
    
      update(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/${id}`, data);
      }

      delete(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/${id}`);
      }
    
      deleteAll(): Observable<any> {
        return this.http.delete(environment.API_G + baseUrl);
      }
    
      findByEmail(email: any): Observable<[]> {
        return this.http.get<[]>(environment.API_G +`${baseUrl}?email=${email}`);
      }
}
