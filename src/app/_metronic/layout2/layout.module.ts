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
import { MetasComponent } from '../../pages/metas/metas.component';
import { MetasVotoComponent } from '../../pages/metas-voto/metas-voto.component';
import { PreguntasComponent } from '../../pages/preguntas/preguntas.component';
import { PreguntasVotoComponent } from '../../pages/preguntas-voto/preguntas-voto.component';
import { MapaComponent } from '../../pages/mapa/mapa.component';
import { NecesidadesComponent } from '../../pages/necesidades/necesidades.component';
import { NecesidadesDecisionComponent } from '../../pages/necesidades-decision/necesidades-decision.component';
import { NecesidadesDoloresComponent } from '../../pages/necesidades-dolores/necesidades-dolores.component';
import { NecesidadesDoloresDecisionComponent } from '../../pages/necesidades-dolores-decision/necesidades-dolores-decision.component';
import { ObjetivosCortoComponent } from '../../pages/objetivos-corto/objetivos-corto.component';
import { ObjetivosCortoDecisionComponent } from '../../pages/objetivos-corto-decision/objetivos-corto-decision.component';
import { ObjetivosLargoComponent } from '../../pages/objetivos-largo/objetivos-largo.component';
import { ObjetivosLargoDecisionComponent } from '../../pages/objetivos-largo-decision/objetivos-largo-decision.component';
import { PropositosComponent } from '../../pages/propositos/propositos.component';
import { PropositosVotoComponent } from '../../pages/propositos-voto/propositos-voto.component';
import { AccionesComponent } from '../../pages/acciones/acciones.component';
import { AccionesDecisionComponent } from '../../pages/acciones-decision/acciones-decision.component';
import { MetricasComponent } from '../../pages/metricas/metricas.component';
import { MetricasDecisionComponent } from '../../pages/metricas-decision/metricas-decision.component';
import { ProblemaComponent } from '../../pages/problema/problema.component';
import { ProblemaDecisionComponent } from '../../pages/problema-decision/problema-decision.component';
import { ClientesComponent } from '../../pages/clientes/clientes.component';
import { ClientesDecisionComponent } from '../../pages/clientes-decision/clientes-decision.component';
import { SolucionComponent } from '../../pages/solucion/solucion.component';
import { SolucionDecisionComponent } from '../../pages/solucion-decision/solucion-decision.component';
import { MetricasClaveComponent } from '../../pages/metricas-clave/metricas-clave.component';
import { MetricasClaveDecisionComponent } from '../../pages/metricas-clave-decision/metricas-clave-decision.component';
import { PropuestaComponent } from '../../pages/propuesta/propuesta.component';
import { PropuestaDecisionComponent } from '../../pages/propuesta-decision/propuesta-decision.component';
import { VentajasComponent } from '../../pages/ventajas/ventajas.component';
import { VentajasDecisionComponent } from '../../pages/ventajas-decision/ventajas-decision.component';
import { CanalesComponent } from '../../pages/canales/canales.component';
import { CanalesDecisionComponent } from '../../pages/canales-decision/canales-decision.component';
import { EstructuraComponent } from '../../pages/estructura/estructura.component';
import { EstructuraDecisionComponent } from '../../pages/estructura-decision/estructura-decision.component';
import { FlujoComponent } from '../../pages/flujo/flujo.component';
import { FlujoDecisionComponent } from '../../pages/flujo-decision/flujo-decision.component';
import { BoardsModule } from '../../pages/boards/boards.module';
import { BoardsVotoModule } from '../../pages/boards-voto/boards-voto.module';
import { MetasModule } from '../../pages/metas/metas.module';
import { MetasVotoModule } from '../../pages/metas-voto/metas-voto.module';
import { PreguntasModule } from '../../pages/preguntas/preguntas.module';
import { PreguntasVotoModule } from '../../pages/preguntas-voto/preguntas-voto.module';
import { MapaModule } from '../../pages/mapa/mapa.module';
import { NecesidadesModule } from '../../pages/necesidades/necesidades.module';
import { NecesidadesDecisionModule } from '../../pages/necesidades-decision/necesidades-decision.module';
import { NecesidadesDoloresModule } from '../../pages/necesidades-dolores/necesidades-dolores.module';
import { NecesidadesDoloresDecisionModule } from '../../pages/necesidades-dolores-decision/necesidades-dolores-decision.module';
import { PropositosModule } from '../../pages/propositos/propositos.module';
import { PropositosVotoModule } from '../../pages/propositos-voto/propositos-voto.module';
import { ObjetivosCortoModule } from '../../pages/objetivos-corto/objetivos-corto.module';
import { ObjetivosCortoDecisionModule } from '../../pages/objetivos-corto-decision/objetivos-corto-decision.module';
import { ObjetivosLargoModule } from '../../pages/objetivos-largo/objetivos-largo.module';
import { ObjetivosLargoDecisionModule } from '../../pages/objetivos-largo-decision/objetivos-largo-decision.module';
import { AccionesModule } from '../../pages/acciones/acciones.module';
import { AccionesDecisionModule } from '../../pages/acciones-decision/acciones-decision.module';
import { MetricasModule } from '../../pages/metricas/metricas.module';
import { MetricasDecisionModule } from '../../pages/metricas-decision/metricas-decision.module';
import { ProblemaModule } from '../../pages/problema/problema.module';
import { ProblemaDecisionModule } from '../../pages/problema-decision/problema-decision.module';
import { ClientesModule } from '../../pages/clientes/clientes.module';
import { ClientesDecisionModule } from '../../pages/clientes-decision/clientes-decision.module';
import { SolucionModule } from '../../pages/solucion/solucion.module';
import { SolucionDecisionModule } from '../../pages/solucion-decision/solucion-decision.module';
import { MetricasClaveModule } from '../../pages/metricas-clave/metricas-clave.module';
import { MetricasClaveDecisionModule } from '../../pages/metricas-clave-decision/metricas-clave-decision.module';
import { PropuestaModule } from '../../pages/propuesta/propuesta.module';
import { PropuestaDecisionModule } from '../../pages/propuesta-decision/propuesta-decision.module';
import { VentajasModule } from '../../pages/ventajas/ventajas.module';
import { VentajasDecisionModule } from '../../pages/ventajas-decision/ventajas-decision.module';
import { CanalesModule } from '../../pages/canales/canales.module';
import { CanalesDecisionModule } from '../../pages/canales-decision/canales-decision.module';
import { EstructuraModule } from '../../pages/estructura/estructura.module';
import { EstructuraDecisionModule } from '../../pages/estructura-decision/estructura-decision.module';
import { FlujoModule } from '../../pages/flujo/flujo.module';
import { FlujoDecisionModule } from '../../pages/flujo-decision/flujo-decision.module';
import { TimerModule/*TimerComponent*/ } from './timer/timer.module';
import { EntenderAccordionComponent } from './instructions/entender-accordion/entender-accordion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../environments/environment";
import { LoadMaskModule } from './loadMask/loadMask.module';

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
  },
  {
    path: 'fase4',
    component: MetasComponent
  },
  {
    path: 'fase5',
    component: MetasVotoComponent
  },
  {
    path: 'fase6',
    component: PreguntasComponent
  },
  {
    path: 'fase7',
    component: PreguntasVotoComponent
  },
  {
    path: 'fase8',
    component: MapaComponent
  },
  {
    path: 'fase9',
    component: NecesidadesComponent
  },
  {
    path: 'fase10',
    component: NecesidadesDecisionComponent
  },
  {
    path: 'fase11',
    component: NecesidadesDoloresComponent
  },
  {
    path: 'fase12',
    component: NecesidadesDoloresDecisionComponent
  },
  {
    path: 'fase13',
    component: PropositosComponent
  },
  {
    path: 'fase14',
    component: PropositosVotoComponent
  },
  {
    path: 'fase15',
    component: ObjetivosCortoComponent
  },
  {
    path: 'fase16',
    component: ObjetivosCortoDecisionComponent
  },
  {
    path: 'fase17',
    component: ObjetivosLargoComponent
  },
  {
    path: 'fase18',
    component: ObjetivosLargoDecisionComponent
  },
  {
    path: 'fase19',
    component: AccionesComponent
  },
  {
    path: 'fase20',
    component: AccionesDecisionComponent
  },
  {
    path: 'fase21',
    component: MetricasComponent
  },
  {
    path: 'fase22',
    component: MetricasDecisionComponent
  },
  {
    path: 'fase23',
    component: ClientesComponent
  },
  {
    path: 'fase24',
    component: ClientesDecisionComponent
  },
  {
    path: 'fase25',
    component: ProblemaComponent
  },
  {
    path: 'fase26',
    component: ProblemaDecisionComponent
  },
  {
    path: 'fase27',
    component: SolucionComponent
  },
  {
    path: 'fase28',
    component: SolucionDecisionComponent
  },
  {
    path: 'fase29',
    component: MetricasClaveComponent
  },
  {
    path: 'fase30',
    component: MetricasClaveDecisionComponent
  },
  {
    path: 'fase31',
    component: PropuestaComponent
  },
  {
    path: 'fase32',
    component: PropuestaDecisionComponent
  },
  {
    path: 'fase33',
    component: VentajasComponent
  },
  {
    path: 'fase34',
    component: VentajasDecisionComponent
  },
  {
    path: 'fase35',
    component: CanalesComponent
  },
  {
    path: 'fase36',
    component: CanalesDecisionComponent
  },
  {
    path: 'fase37',
    component: EstructuraComponent
  },
  {
    path: 'fase38',
    component: EstructuraDecisionComponent
  },
  {
    path: 'fase39',
    component: FlujoComponent
  },
  {
    path: 'fase40',
    component: FlujoDecisionComponent
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
    LoadMaskModule,
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
