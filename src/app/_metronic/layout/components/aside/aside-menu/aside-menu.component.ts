import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { UsersService } from '../../../../../pages/users/users.service';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  public user: any = {};
  public permisos: any = {};
  public usuario: any = localStorage.getItem('usuario');
  public showProyect: boolean = false; 
  public rol: any = 'Usuario';
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  constructor(private ref: ChangeDetectorRef, private _usersService: UsersService) {
    this.user = JSON.parse(this.usuario);
    //this.ref.detectChanges();
    this.getMenu();
  }

  ngOnInit(): void {}

  getMenu(){
    this._usersService.getMenu(this.user.id, this.user.correo_login)
    .subscribe(
      data => {
        let invitaciones: any = data.invitaciones;
        let usuario: any = data.usuario;
        let aceptadas = invitaciones.filter(
          (option: any) => (
            option.participante == true)
          );
          
          if(aceptadas.length > 0){
            this.showProyect = true;
          }

        this.rol = usuario.roles[0].nombre;
        this.ref.detectChanges();
      },
      error => {
        console.log(error);
      });

  }
}
