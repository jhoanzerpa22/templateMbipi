import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardProjectComponent } from './dashboard-project.component';
import { RouterModule } from '@angular/router';
import { WidgetsModule } from '../../_metronic/partials/content/widgets/widgets.module';

import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { OverviewComponent } from './overview/overview.component';
import { DescargablesComponent } from './descargables/descargables.component';
import { ScopePrintComponent } from './descargables/scope_canvas/scope_print.component';
import { LeanPrintComponent } from './descargables/lean_canvas/lean_print.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import {MatDialogModule} from '@angular/material/dialog';

import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DashboardProjectComponent, SettingsComponent, OverviewComponent, DescargablesComponent, ScopePrintComponent, LeanPrintComponent],
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
            component: OverviewComponent
          },
          {
            path: 'settings',
            component: SettingsComponent
          },
          {
            path: 'descargables',
            component: DescargablesComponent
          },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: '**', redirectTo: 'overview', pathMatch: 'full' },
        ]
      },
    ]),
    WidgetsModule,
    InlineSVGModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [MatDialogModule]
})
export class DashboardProjectModule { }
