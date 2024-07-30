import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectsService } from '../../config-project-wizzard/proyects.service';
import { ProyectService } from '../proyect.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  //public proyecto: any = {};
  public proyecto_id: number;
  public usuario: any = {};
  //public usuarios: any = [];
  public members: any = [];

  public formProyect: FormGroup;
  public formData: any;

  selectedFile: any;
  pdfURL: any;

  imageChangedEvent: any = '';
  imgView: any;
  //isLoading: boolean = true;
  
  @Input() proyecto: any = {};
  @Input() usuarios: any = [];

  constructor(
    private route: ActivatedRoute,
    private _proyectsService: ProyectsService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private proyectService: ProyectService
  ) {
    this.formProyect = this.fb.group({
      'nombre'          : [''],
      'descripcion'      : [''],
      'proyecto_tipo_id'   : [''],
      'aplicacion_tipo': [''],
      'logo': ['']
    });
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      //console.log(params)
      //this.getProyect();
      this.setValueEdit(this.proyecto);
      this.ref.detectChanges();
    });
    //console.log(this.route.params)
  }
  
  imgError(ev: any){

    let source = ev.srcElement;
    let imgSrc = 'assets/media/svg/brand-logos/volicity-9.svg';

    source.src = imgSrc;
  }

  updateData(){

    this.formData = {
      'nombre'            : this.formProyect.value.nombre,
      'descripcion'       : this.formProyect.value.descripcion,
      'proyecto_tipo_id'  : this.formProyect.value.proyecto_tipo_id,
      'aplicacion_tipo'   : this.formProyect.value.aplicacion_tipo
    }

    const formData = new FormData();
     
    formData.append("file", this.selectedFile);
    
    formData.append('data', JSON.stringify(this.formData));
    
    console.log(this.formData)
    this._proyectsService.update(this.proyecto_id, formData)
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
          
          this.proyectService.setChanges('active');
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

  /*getProyect(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.usuarios = this.proyecto.proyecto_equipo.equipo_usuarios;
            //console.log(this.proyecto)
            this.setValueEdit(this.proyecto);
            this.isLoading = false; 
            this.ref.detectChanges();
          },
          (response) => {
            this.isLoading = false; 
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }*/
 
onFileSelected(event: any){

  this.imageChangedEvent = event;
  this.selectedFile = <File>event.target.files[0];

  var reader = new FileReader();
  reader.readAsDataURL(this.selectedFile);
  reader.onload = (_event) => {
    console.log(reader.result);
    this.imgView = reader.result;
    this.ref.detectChanges();
    //this.pdfURL = this.selectedFile.name;
    //this.formUsuario.controls['img'].setValue(this.selectedFile);
    }
}

  setValueEdit(data:any)
    {
      this.formProyect.setValue({
      'nombre'          : data.nombre,
      'descripcion'      : data.descripcion,
      'proyecto_tipo_id'      : data.proyecto_tipo_id,
      'aplicacion_tipo'  : data.aplicacion_tipo,
      'logo': ''
    });

    if(data.logo_id > 0){
      this.imgView = data.cloud_user ? data.cloud_user.secure_url : '';
      this.ref.detectChanges();
    }
   }

}
