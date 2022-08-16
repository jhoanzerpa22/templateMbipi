import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  title= 'cronometro'

  ms:any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  startTimer: any;
  running = false;


  constructor(private ref:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.start();
  }

  start(){
    if(!this.running){
      this.running = true;
      this.startTimer = setInterval(()=>{
        this.ms++;
        this.ms = this.ms < 10 ? '0' + this.ms : this.ms;
        this.ref.detectChanges();
        if(this.ms === 100){
          this.sec++;
          this.sec = this.sec < 10 ? '0' + this.sec : this.sec;
          this.ms = '0' + 0;

        }
        this.ref.detectChanges();
        if(this.sec === 60){
          this.min++;
          this.min = this.min < 10 ? '0' + this.min : this.min;
          this.sec = '0' + 0;
        }
        this.ref.detectChanges();
        if(this.min === 60){
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
