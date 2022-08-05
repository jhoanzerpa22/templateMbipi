import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';


export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always'
};

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: 'configuration',
    loadChildren: () =>
      import('./pages/config-wizzard/config-cta-wizard.module').then((m) => m.ConfigCtaWizardModule),
  },
  {
    path: 'proyect-init',
    loadChildren: () =>
      import('./_metronic/layout2/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routingConfiguration)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
