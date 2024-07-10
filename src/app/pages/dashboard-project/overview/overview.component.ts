import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectsService } from '../../config-project-wizzard/proyects.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  
  public proyecto: any = {};
  public proyecto_id: any;

  dias: number = 0;
  completadas: number = 0;
  curso: number = 0;

  constructor(private ref: ChangeDetectorRef, private route: ActivatedRoute, private _proyectsService: ProyectsService) { 
    /*this.route.queryParams.subscribe(params => {
      const proyecto = params['proyecto'];
      console.log('proyecto',proyecto);
    });*/
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      this.getProyect();
    });
  }

  getDias(etapa_activa: any){
    let dias: number = 6;
    let curso: number = 0;
    let completadas: number = 0;
    let fase_final: any = '';

    if(etapa_activa){
      const numerosFinales = etapa_activa.match(/\d+$/);
      const partes = etapa_activa.split("/");
      const ultimaFase = partes[partes.length - 1];
    
      if (numerosFinales || (ultimaFase == 'scope' || ultimaFase == 'lean' ||ultimaFase == 'uploadFileProyect')) {

        switch (ultimaFase) {
          case 'scope':
            fase_final = 23;
            break;
            case 'lean':
              fase_final = 41;
              break;
              case 'uploadFileProyect':
                fase_final = 45;
                break;
        
          default:
            fase_final = numerosFinales[0];
            break;
        }

        console.log('etapa',);

          if(fase_final > 0){

            curso = 1;
     
            if(fase_final > 8){

              completadas ++;
            
            }

            if(fase_final > 22){

              completadas ++;
            
            }

            if(fase_final > 40){

              completadas ++;
            
            }

            if(fase_final > 46){

              completadas ++;
            
            }
            
            if(fase_final > 48){

              completadas ++;
            
            }

          }

          dias = dias - completadas;
      }
    }

    this.dias = dias;
    this.completadas = completadas;
    this.curso = curso;
  }
  
  getProyect(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.getDias(this.proyecto.etapa_activa);
            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }

}
