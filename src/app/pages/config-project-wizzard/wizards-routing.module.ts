import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WizardsComponent } from './wizards.component';
import { ConfigProjectWizzardComponent } from './config-project-wizzard/config-project-wizzard.component';

const routes: Routes = [
  {
    path: '',
    component: WizardsComponent,
    children: [
      {
        path: 'config-project',
        component: ConfigProjectWizzardComponent,
      },
      { path: '', redirectTo: 'horizontal', pathMatch: 'full' },
      { path: '**', redirectTo: 'horizontal', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WizardsRoutingModule {}
