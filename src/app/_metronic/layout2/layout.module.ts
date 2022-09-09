import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '../../modules/i18n';
import { LayoutComponent } from './layout.component';
import { ExtrasModule } from '../partials/layout/extras/extras.module';
import { Routing } from '../../pages/routing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NoteComponent } from './notes/notes.component';
/*import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScriptsInitComponent } from './components/scripts-init/scripts-init.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AsideMenuComponent } from './components/aside/aside-menu/aside-menu.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { PageTitleComponent } from './components/header/page-title/page-title.component';
import { HeaderMenuComponent } from './components/header/header-menu/header-menu.component';
import { DrawersModule, DropdownMenusModule, ModalsModule, EngagesModule} from '../partials';
import {EngagesComponent} from "../partials/layout/engages/engages.component";
import { ThemeModeModule } from '../partials/layout/theme-mode-switcher/theme-mode.module';
*/
import { BoardsComponent } from '../../pages/boards/boards.component';
import { BoardsVotoComponent } from '../../pages/boards-voto/boards-voto.component';
import { BoardsModule } from '../../pages/boards/boards.module';
import { BoardsVotoModule } from '../../pages/boards-voto/boards-voto.module';
import { TimerModule/*TimerComponent*/ } from './timer/timer.module';
import { EntenderAccordionComponent } from './instructions/entender-accordion/entender-accordion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../environments/environment";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent
    /*children: Routing,*/
    /*children: [
      {
        path: 'fase2',
        component: BoardsComponent,*//*
          loadChildren: () =>
            import('../../pages/boards/boards.module').then((m) => m.BoardsModule),*/
      /*}*//*,
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },*/
    /*],*/
  },
  {
    path: 'fase2',
    component: BoardsComponent
  },
  {
    path: 'fase3',
    component: BoardsVotoComponent
  }
];

const config: SocketIoConfig = { url: environment.API/*'http://localhost:4000'*/, options: { transports: ['websocket'], jsonp:false } };

@NgModule({
  declarations: [
    LayoutComponent,
    NoteComponent,
    //TimerComponent,
    EntenderAccordionComponent,
    /*,
    BoardsComponent,
    BoardsVotoComponent*/
    /*AsideComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    ScriptsInitComponent,
    ToolbarComponent,
    AsideMenuComponent,
    TopbarComponent,
    PageTitleComponent,
    HeaderMenuComponent,
    EngagesComponent,*/
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslationModule,
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    ExtrasModule,
    NgbModule,
    TimerModule,
    /*
    BoardsModule,*/
    SocketIoModule.forRoot(config)
    /*ModalsModule,
    DrawersModule,
    EngagesModule,
    DropdownMenusModule,
    NgbTooltipModule,
    TranslateModule,
    ThemeModeModule*/
  ],
  exports: [RouterModule],
})
export class LayoutModule {}
