import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';

const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
      email,
      password,
    });
  }

  signIn(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    return this.http.post(environment.API_G + 'auth/signin', { email: email, password: password }).pipe(
      map((result: any) => {
        if (result.length <= 0) {
          return notFoundError;
        }
        const user = result;
        /*const user = result.find((u: any) => {
          return (
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
          );
        });
        if (!user) {
          return notFoundError;
        }*/

        if(user.verify != true){
          localStorage.setItem('usuario_verify', JSON.stringify(user));
        }

          localStorage.setItem('usuario', JSON.stringify(user));

        const auth = new AuthModel();
        auth.authToken = user.accessToken;
        auth.refreshToken = user.accessToken;
        auth.verify = user.verify;
        auth.completada = user.completada;
        auth.proyectos = user.proyectos;
        auth.invitaciones = user.invitaciones;
        auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
        return auth;
      })
    );
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.put<boolean>(`${environment.API_G}auth/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${API_USERS_URL}/me`, {
      headers: httpHeaders,
    });
  }

  getUserByStorage(): Observable<UserModel | undefined> {
    const user: any = localStorage.getItem('usuario');

    if (!user) {
      return of(undefined);
    }

    return of(user);
  }

  //Envia correo con clave de recuperacion de contraseña
  sendMailConfirmPass(data: any,): Observable<any> {
    return this.http.post(environment.API_G + 'sendmail-confirm-pass', data);
  }

  verifyCode(data: any): Observable<boolean> {
    return this.http.put<boolean>(`${environment.API_G}auth/verify-code`, {
      data,
    });
  }

  changePassword(data:any):Observable<boolean>{
    return this.http.put<boolean>(`${environment.API_G}auth/change-password`,{
      data
    })
  }
}
