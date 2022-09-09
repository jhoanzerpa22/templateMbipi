import { NgModule } from '@angular/core';
import { TimerComponent} from './timer.component';
@NgModule({
  declarations: [
    TimerComponent,
  ],
  exports: [
    TimerComponent,
  ]
})
export class TimerModule { }