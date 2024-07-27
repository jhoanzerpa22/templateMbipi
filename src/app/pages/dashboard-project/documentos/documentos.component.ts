import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subject,BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProyectsService } from '../../config-project-wizzard/proyects.service';
import Swal from 'sweetalert2';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  public proyecto_id: number;
  public proyecto_documents: any = [];
  
  public proyecto: any = {};
  public miembros: any = [];
  public rol: any = '';

  fecha: Date = new Date();
  _user: any = {};
  usuario: any = {};
  files: File[] = [];
  isLoading2: boolean;
  
  uploadForm: FormGroup;

  private unsubscribe: Subscription[] = [];
  //isLoading$: Observable<boolean>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
onSelect(event: any) {
  console.log(event);
  this.files.push(...event.addedFiles);
  
  this.ref.detectChanges();
}

onRemove(event: any) {
  console.log(event);
  this.files.splice(this.files.indexOf(event), 1);
}

constructor(private route: ActivatedRoute,  
  private _formBuilder: FormBuilder, private _proyectsService: ProyectsService,
    private ref: ChangeDetectorRef) { 
   
    const loadingSubscr = this.isLoading$
    .asObservable()
    .subscribe((res) => (this.isLoading2 = res));
    this.unsubscribe.push(loadingSubscr);

    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    this.usuario = user;
}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.proyecto_id = params['id'];
      this.getProyect();
      this.getDocumentsProyect();
    });

    this.uploadForm = this._formBuilder.group({
      nombre      : ['', Validators.required]
    });
  }

  getFechaFormateada() {
    const day = this.fecha.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = (this.fecha.getMonth() + 1).toString().padStart(2, '0'); // Get month (Note: Month is zero-based)
    const year = this.fecha.getFullYear().toString(); // Get full year

    return `${day}/${month}/${year}`;
  }

  getProyect(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.miembros = this.proyecto.proyecto_equipo.equipo_usuarios;
            let usuario_proyecto = this.miembros.filter(
              (op: any) => (
                op.usuario_id == this.usuario.id)
              );
            this.rol = usuario_proyecto[0].rol;
            this.ref.detectChanges(); 
          },
          (response) => { 
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }  
  
  getDocumentsProyect(){

    this._proyectsService.getDocuments(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto_documents = response;
            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }
  
  deleteDocument(id: any, cloudinary_id: any){

    this.isLoading$.next(true);

    this._proyectsService.deleteDocument(id,cloudinary_id)
      .subscribe(
          (response) => {
            this.isLoading$.next(false);
            this.getDocumentsProyect();
          },
          (response) => {    
            this.isLoading$.next(false);
          }
      );
  }
  
  enviar(){
    
    if ( this.uploadForm.invalid )
      {
          return;
      }
    
    this.isLoading$.next(true);
    //for(let f in this.files){
      console.log('files:',this.files);
    /*const data: any = {
      'files': JSON.stringify(this.files),
      'usuario_id': this.usuario.id,
      'proyecto_id': this.proyecto_id
    };*/
    
    const val = this.uploadForm.value;

    this._proyectsService.uploadDocument(this.files, val.nombre, this.proyecto_id, this.usuario.id)
      .subscribe(
          data => {
            Swal.fire({
              text: "Archivos subidos exitosamente!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok!",
              customClass: {
                confirmButton: "btn btn-primary"
              }
            });
            this.files = [];
            this.isLoading$.next(false);
            this.getDocumentsProyect();
          },
          (response) => {
            this.isLoading$.next(false);
            console.log('error_resp',response);
          }
      );
    //}
  }


}
