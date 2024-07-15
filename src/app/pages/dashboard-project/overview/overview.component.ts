import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectsService } from '../../config-project-wizzard/proyects.service';
import { getCSSVariableValue } from '../../../_metronic/kt/_utils';

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
  
  chartOptions: any = {};
  public miembros: any = [];
  public proyecto_recursos: any = [];

  isLoading: boolean = true;

  constructor(private ref: ChangeDetectorRef, private route: ActivatedRoute, private _proyectsService: ProyectsService) { 
    /*this.route.queryParams.subscribe(params => {
      const proyecto = params['proyecto'];
      console.log('proyecto',proyecto);
    });*/
  }

  ngOnInit(): void {
    
    this.getChartOptions([]);
    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      this.getProyect();
    });
  }

  getChartOptions(miembros?: any) {
    const labelColor = getCSSVariableValue('--bs-gray-500');
    const borderColor = getCSSVariableValue('--bs-gray-200');
    const baseColor = getCSSVariableValue('--bs-primary');
    const secondaryColor = getCSSVariableValue('--bs-gray-300');

    let labels: any = [];
    let values: any = [];

    for (let index = 0; index < miembros.length; index++) {
      labels.push(miembros[index].label);
      values.push(miembros[index].value);
    }

    this.chartOptions = {
      series: miembros.length > 0 ? values : [],
      chart: {
        type: "donut",
        width: 400,
        height: 400
      },
      labels: miembros.length > 0 ? labels : [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
              height: 400
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
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

          dias = dias - (completadas + curso);
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
            this.miembros = this.proyecto.proyecto_equipo.equipo_usuarios;
            this.proyecto_recursos = this.proyecto.proyecto_recursos;

            let miembros: any = [];

            for (let index = 0; index < this.miembros.length; index++) {

              let label: any = (this.miembros[index].correo ? this.miembros[index].correo : '');
              let value: number = 0; 
              
              if(this.miembros[index].eq_usu_plat != null){
                label = this.miembros[index].eq_usu_plat.nombre;

                const filter_recursos: any = this.proyecto_recursos.filter(
                  (re: any) => (
                    re.usuario_id == this.miembros[index].eq_usu_plat.id)
                  );

                  value = filter_recursos.length;

              }

              miembros.push({label: label, value: value}); 
            }

            this.getChartOptions(miembros);

            this.getDias(this.proyecto.etapa_activa);
            
            this.isLoading = false; 
            this.ref.detectChanges();
          },
          (response) => {
              this.isLoading = false;
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }

}
