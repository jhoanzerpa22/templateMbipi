import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardProjectComponent } from './dashboard-project.component';
import { RouterModule } from '@angular/router';
import { WidgetsModule } from '../../_metronic/partials/content/widgets/widgets.module';

import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [DashboardProjectComponent, SettingsComponent, OverviewComponent],
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
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: '**', redirectTo: 'overview', pathMatch: 'full' },
        ]
      },

    ]),
    WidgetsModule,
    ReactiveFormsModule
  ]
})
export class DashboardProjectModule { }
