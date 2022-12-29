import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ProyectsService } from '../../../pages/config-project-wizzard/proyects.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  title= 'cronometro'
  @Input() ms:any = '0' + 0;
  @Input() sec: any = '0' + 0;
  @Input() min: any = '0' + 0;
  @Input() hr: any = '0' + 0;
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
          let data_time = {tiempo: this.hr+':'+this.min};
            this._proyectsService.updateTime(this.proyecto_id, data_time)
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
