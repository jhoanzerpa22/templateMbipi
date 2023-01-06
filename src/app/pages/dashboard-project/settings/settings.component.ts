import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectsService } from '../../config-project-wizzard/proyects.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public proyecto: any = {};
  public proyecto_id: number;
  public usuario: any = {};
  public usuarios: any = [];
  public members: any = [];

  public formProyect: FormGroup;
  public formData: any;

  constructor(
    private route: ActivatedRoute,
    private _proyectsService: ProyectsService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,

  ) {
    this.formProyect = this.fb.group({
      'nombre'          : [''],
      'descripcion'      : [''],
      'proyecto_tipo_id'   : [''],
      'aplicacion_tipo': ['']
    });
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      console.log(params)
      this.getProyect();
    });
    console.log(this.route.params)
  }

  updateData(){

    this.formData = {
      'nombre'            : this.formProyect.value.nombre,
      'descripcion'       : this.formProyect.value.descripcion,
      'proyecto_tipo_id'  : this.formProyect.value.proyecto_tipo_id,
      'aplicacion_tipo'   : this.formProyect.value.aplicacion_tipo
    }
    console.log(this.formData)
    this._proyectsService.update(this.proyecto_id, this.formData)
      .subscribe(
        (response) =>{
          console.log(response);
          Swal.fire({
            text: "Datos de proyecto actualizados exitosamente!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok!",
            customClass: {
              confirmButton: "btn btn-primary"
            }
          });
        }, (err) =>{
          console.log(err)
          Swal.fire({
            text: "Ups, ha ocurrido un error con la actualización de datos.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok!",
            customClass: {
              confirmButton: "btn btn-primary"
            }
          });
        }
      )
  }

  getProyect(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.usuarios = this.proyecto.proyecto_equipo.equipo_usuarios;
            this.ref.detectChanges();
            console.log(this.proyecto)
            this.setValueEdit(this.proyecto);
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }


  setValueEdit(data:any)
    {
      this.formProyect.setValue({
      'nombre'          : data.nombre,
      'descripcion'      : data.descripcion,
      'proyecto_tipo_id'      : data.proyecto_tipo_id,
      'aplicacion_tipo'  : data.aplicacion_tipo
    });
   }

}
