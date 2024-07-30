import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardProjectComponent } from './dashboard-project.component';
import { RouterModule } from '@angular/router';
import { WidgetsModule } from '../../_metronic/partials/content/widgets/widgets.module';

import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { OverviewComponent } from './overview/overview.component';
import { DescargablesComponent } from './descargables/descargables.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { ScopePrintComponent } from './descargables/scope_canvas/scope_print.component';
import { LeanPrintComponent } from './descargables/lean_canvas/lean_print.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatDialogModule } from '@angular/material/dialog';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LoadMaskModule } from '../../_metronic/layout2/loadMask/loadMask.module';
import { ProyectService } from './proyect.service';
import {
  CardsModule,
  DropdownMenusModule
} from '../../_metronic/partials';
import { NgxDropzoneModule } from 'ngx-dropzone';

import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DashboardProjectComponent, SettingsComponent, OverviewComponent, DescargablesComponent, ScopePrintComponent, LeanPrintComponent, DocumentosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardProjectComponent,

      },
      {
        path: ':id',
        component: DashboardProjectComponent,
        children: [
          {
            path: 'overview',
            component: DashboardProjectComponent//OverviewComponent
          },
          {
            path: 'settings',
            component: DashboardProjectComponent//SettingsComponent
          },
          {
            path: 'descargables',
            component: DashboardProjectComponent//DescargablesComponent
          },
          {
            path: 'documentos',
            component: DashboardProjectComponent//DocumentosComponent
          },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: '**', redirectTo: 'overview', pathMatch: 'full' },
        ]
      },
    ]),
    WidgetsModule,
    InlineSVGModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgApexchartsModule,
    LoadMaskModule,
    DropdownMenusModule,
    CardsModule,
    NgxDropzoneModule
  ],
  exports: [MatDialogModule],
  entryComponents: [OverviewComponent, SettingsComponent, DescargablesComponent, DocumentosComponent],
  providers: [ProyectService]
})
export class DashboardProjectModule { }
