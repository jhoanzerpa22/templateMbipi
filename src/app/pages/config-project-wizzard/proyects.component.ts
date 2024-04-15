import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy, CommonModule} from '@angular/common';
import { ProyectsService } from './proyects.service';
import { UsersService } from '../../pages/users/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
})
export class ProyectsComponent implements OnInit {
  location: Location;
  num_proyectos: number;
  max_proyects: boolean = false;

  newUser: any;
  usuario: any;
  
  constructor(
    private _proyectsService: ProyectsService,
    private _userService: UsersService,
    private router: Router,
    location: Location
  ) {
    this.location = location;
  }

  ngOnInit(): void {
    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;
  }

  createProyect(){

    this._userService.getInfo(this.usuario.id)
    .subscribe(
      (response) =>{
        this.newUser = response.tipo_plan;
        if(this.newUser){

          if(this.newUser == 'pago'){

            this.router.navigate(['/crafted/pages/wizards/config-project']);
            
          }else{
        
          this._proyectsService.dashboard(this.usuario.id, this.usuario.correo_login)
          .subscribe(
            (response)=>{
              this.num_proyectos = response.length;

              if(this.num_proyectos >= 2){
                this.max_proyects = true;
                Swal.fire({
                  text: "Ups, debes suscribirte a Plan-Pro para crear más de 2 proyectos.",
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Ok!",
                  customClass: {
                    confirmButton: "btn btn-primary"
                  }
                });
              }else{

                this.router.navigate(['/crafted/pages/wizards/config-project']);
              }

            }
          );
          
          }
        
        }
      
      }
    );

  }

}
