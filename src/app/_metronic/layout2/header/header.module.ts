import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent} from './header.component';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule} from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';

import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimerModule/*TimerComponent*/ } from '../../../_metronic/layout2/timer/timer.module';
import { TimerPassModule/*TimerComponent*/ } from '../../../_metronic/layout2/timer_pass/timer_pass.module';

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatMenuModule,
    MatRadioModule,
    DragDropModule,
    TimerModule,
    TimerPassModule
  ]
})
export class HeaderModule { }