import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ProblemaComponent } from './problema.component';
import { WidgetsModule } from '../../_metronic/partials';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NoteProblemaComponent } from './notes-problema/notes-problema.component';

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
import { HeaderModule } from '../../_metronic/layout2/header/header.module';
import { FooterLabModule } from '../../_metronic/layout2/footer-lab/footer-lab.module';
import { EntenderProblemaAccordionComponent } from './instructions/entender-problema-accordion/entender-problema-accordion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../environments/environment";

import { LoadMaskModule } from '../../_metronic/layout2/loadMask/loadMask.module';

const config: SocketIoConfig = { url: environment.API_SOCKET/*'http://localhost:4000'*/, options: { transports: ['websocket'], jsonp:false } };

@NgModule({
  declarations: [
    ProblemaComponent,
    NoteProblemaComponent,
    //TimerComponent,
    EntenderProblemaAccordionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProblemaComponent,
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
    HeaderModule,
    FooterLabModule,
    LoadMaskModule,
    SocketIoModule.forRoot(config)
  ]
})
export class ProblemaModule {}
