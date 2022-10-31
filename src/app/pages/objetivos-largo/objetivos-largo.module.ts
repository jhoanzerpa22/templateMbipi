import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ObjetivosLargoComponent } from './objetivos-largo.component';
import { WidgetsModule } from '../../_metronic/partials';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NoteObjetivosLargoComponent } from './notes-objetivos-largo/notes-objetivos-largo.component';

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
import { TimerModule/*TimerComponent*/ } from '../../_metronic/layout2/timer/timer.module';
import { EntenderObjetivosLargoAccordionComponent } from './instructions/entender-objetivos-largo-accordion/entender-objetivos-largo-accordion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../environments/environment";

import { LoadMaskModule } from '../../_metronic/layout2/loadMask/loadMask.module';

const config: SocketIoConfig = { url: environment.API/*'http://localhost:4000'*/, options: { transports: ['websocket'], jsonp:false } };

@NgModule({
  declarations: [
    ObjetivosLargoComponent,
    NoteObjetivosLargoComponent,
    //TimerComponent,
    EntenderObjetivosLargoAccordionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ObjetivosLargoComponent,
      },
    ]),
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbModule,
    WidgetsModule,
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
    LoadMaskModule,
    SocketIoModule.forRoot(config)
  ]
})
export class ObjetivosLargoModule {}
