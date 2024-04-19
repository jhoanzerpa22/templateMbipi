import { NgModule } from '@angular/core';
import { TimerPassComponent} from './timer_pass.component';
@NgModule({
  declarations: [
    TimerPassComponent,
  ],
  exports: [
    TimerPassComponent,
  ]
})
export class TimerPassModule { }