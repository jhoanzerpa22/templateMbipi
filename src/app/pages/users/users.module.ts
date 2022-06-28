import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';

import { UsersComponent } from './users.component';

import { ProfileDetailsComponent } from './account/settings/forms/profile-details/profile-details.component';
import { ConnectedAccountsComponent } from './account/settings/forms/connected-accounts/connected-accounts.component';
import { DeactivateAccountComponent } from './account/settings/forms/deactivate-account/deactivate-account.component';
import { EmailPreferencesComponent } from './account/settings/forms/email-preferences/email-preferences.component';
import { NotificationsComponent } from './account/settings/forms/notifications/notifications.component';
import { SignInMethodComponent } from './account/settings/forms/sign-in-method/sign-in-method.component';

import { MatMenuModule } from '@angular/material/menu';
import { DropdownMenusModule, WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { OverviewComponent } from './account/overview/overview.component';
import { AccountComponent } from './account/account.component';
import { SettingsComponent } from './account/settings/settings.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        UsersComponent, OverviewComponent, AccountComponent, SettingsComponent, 
        ProfileDetailsComponent,
        ConnectedAccountsComponent,
        DeactivateAccountComponent,
        EmailPreferencesComponent,
        NotificationsComponent,
        SignInMethodComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild([
          {
            path: '',
            component: UsersComponent,
          },
          {
            path: 'edit/:id',
            component: AccountComponent,
            children: [
              {
                path: 'overview',
                component: OverviewComponent,
              },
              {
                path: 'settings',
                component: SettingsComponent,
              },
              { path: '', redirectTo: 'overview', pathMatch: 'full' },
              { path: '**', redirectTo: 'overview', pathMatch: 'full' },
            ],
          },
          {
            path: 'create',
            component: SettingsComponent
          }
        ]),
        FormsModule, 
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatTabsModule,
        MatDividerModule,
        MatMenuModule,
        DropdownMenusModule,
        WidgetsModule,
        InlineSVGModule
    ]
})
export class UsersModule
{
}
