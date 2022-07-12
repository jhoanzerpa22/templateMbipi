import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardProjectComponent } from './dashboard-project.component';
import { RouterModule } from '@angular/router';
import { WidgetsModule } from '../../_metronic/partials/content/widgets/widgets.module';



@NgModule({
  declarations: [DashboardProjectComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardProjectComponent
      },
      {
        path: ':id',
        component: DashboardProjectComponent
      }
    ]),
    WidgetsModule
  ]
})
export class DashboardProjectModule { }
