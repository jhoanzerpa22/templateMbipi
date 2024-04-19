import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ProyectsService } from '../../../pages/config-project-wizzard/proyects.service';

@Component({
  selector: 'app-timer-pass',
  templateUrl: './timer_pass.component.html',
  styleUrls: ['./timer_pass.component.scss']
})
export class TimerPassComponent implements OnInit {

  title= 'cronometro'
  @Input() ms:any = '0' + 0;
  @Input() sec: any = '0' + 0;
  @Input() min: any = '0' + 0;
  @Input() hr: any = '0' + 0;
  @Input() tiempo_paso: any = '';
  @Input() dia_paso: any = '';
  @Input() proyecto_id: any = '';
  @Input() rol: any = 'Decisor';

  startTimer: any;
  running = false;

  constructor(private ref:ChangeDetectorRef,
    private _proyectsService: ProyectsService) { }

  ngOnInit(): void {
    this.start();
  }

  start(){
    if(!this.running){
      this.running = true;
      this.startTimer = setInterval(()=>{
        this.ms++;
        this.ms = this.ms < 10 ? '0' + this.ms : this.ms;
        if(this.ms >= 100){
          this.sec++;
          this.sec = this.sec < 10 ? '0' + this.sec : this.sec;
          this.ms = '0' + 0;

        }
        if(this.sec >= 60){
          this.min++;
          this.min = this.min < 10 ? '0' + this.min : this.min;
          this.sec = '0' + 0;
          
          if(this.rol == 'Decisor'){
            const time_proyect = this.tiempo_paso && this.tiempo_paso != undefined ? JSON.parse(this.tiempo_paso) : {};

            if (time_proyect.hasOwnProperty(this.dia_paso)) {
              time_proyect[this.dia_paso] = this.hr+':'+this.min;
            }else{
              time_proyect[this.dia_paso] = this.hr+':'+this.min;
            }
            
            let data_time = {tiempo_paso: time_proyect};
            console.log(data_time);
            this._proyectsService.updateTimePass(this.proyecto_id, data_time)
            .subscribe(
                data => {
                  //console.log('tiempo_guardado',data_time);
                },
                (response) => {
                }
            );
          }
        }
        if(this.min >= 60){
          this.hr++;
          this.hr = this.hr < 10 ? '0' + this.hr : this.hr;
          this.min = '0' + 0;
        }
        this.ref.detectChanges();
      }, 10)
    } else {
      this.stop();
      this.ref.detectChanges();
    }
  }

  stop(){
    clearInterval(this.startTimer);
    this.running = false;
    this.ref.detectChanges();
  }


}
