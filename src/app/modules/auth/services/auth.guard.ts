import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser: any = this.authService.currentUserValue;
    if (currentUser) {
      
      const usuario: any = JSON.parse(currentUser);
      if(usuario.verify != true){
        return false;
      }else{
        // logged in so return true
        return true;
      }
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
