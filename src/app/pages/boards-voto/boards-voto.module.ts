import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardsVotoComponent } from './boards-voto.component';
import { WidgetsModule } from '../../_metronic/partials';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
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
const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [BoardsVotoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BoardsVotoComponent,
      },
    ]),
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
    // SocketIoModule
    SocketIoModule.forRoot(config)
  ],
})
export class BoardsVotoModule {}
