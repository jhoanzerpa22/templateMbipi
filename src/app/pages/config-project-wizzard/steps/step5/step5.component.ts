import { Component, Input, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import { ProyectsService } from '../../proyects.service';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
})
export class Step5Component implements OnInit  {

  @Input() defaultValues: Partial<ICreateAccount>;
  proyecto: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _proyectsService: ProyectsService) {
    }

    ngOnInit() {

      console.log('currentAccount',this.defaultValues);
      console.log(this.defaultValues);
      const usuario: any = localStorage.getItem('usuario');
      let user: any = JSON.parse(usuario);

      this._proyectsService.create({'usuario_id': user.id,'correo': user.correo_login, 'data': this.defaultValues})
      .subscribe(
          (response) => {
            this.proyecto = response.data;
            console.log(this.proyecto);
            const datos = { nombre_usuario: user.nombre, nombre: response.data.nombre, code: response.data.code, emails: this.defaultValues.members};

            this._proyectsService.invitations(datos)
            .subscribe(
                (response) => {
                });
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
    }

  nuevo(){
    this.router.navigate(['/crafted/pages/wizards/project']);
  }

}
