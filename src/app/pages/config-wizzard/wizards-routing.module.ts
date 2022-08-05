import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WizardsComponent } from './wizards.component';
import { ConfigCtaWizardComponent } from './config-cta-wizzard/config-cta-wizzard';

const routes: Routes = [
  {
    path: '',
    component: WizardsComponent,
    children: [
      {
        path: 'config-cta',
        component: ConfigCtaWizardComponent,
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
