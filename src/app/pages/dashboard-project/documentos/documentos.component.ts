import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subject,BehaviorSubject, Observable, Subscription } from 'rxjs';
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
  public proyecto_documents: any = {};
  fecha: Date = new Date();
  _user: any = {};
  usuario: any = {};
  files: File[] = [];
  isLoading2: boolean;

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

constructor(private route: ActivatedRoute, private _proyectsService: ProyectsService,
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
      this.getDocumentsProyect();
    });
  }

  getFechaFormateada() {
    const day = this.fecha.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = (this.fecha.getMonth() + 1).toString().padStart(2, '0'); // Get month (Note: Month is zero-based)
    const year = this.fecha.getFullYear().toString(); // Get full year

    return `${day}/${month}/${year}`;
  }
  
  getDocumentsProyect(){

    this._proyectsService.getDocuments(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto_documents = response;
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }
  
  enviar(){
    
    this.isLoading$.next(true);
    //for(let f in this.files){
      console.log('files:',this.files);
    /*const data: any = {
      'files': JSON.stringify(this.files),
      'usuario_id': this.usuario.id,
      'proyecto_id': this.proyecto_id
    };*/
    this._proyectsService.uploadDocument(this.files, this.proyecto_id, this.usuario.id)
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
