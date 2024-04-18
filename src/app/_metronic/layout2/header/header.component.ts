import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit, 
  Input
} from '@angular/core';
import { ProyectsService } from '../../../pages/config-project-wizzard/proyects.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() proyecto_id: any = '';
  @Input() rol: any = 'Decisor';
  @Input() titulo: any = '';
  @Input() paso: any = '';
  @Input() dia: any = '';
  @Input() usuarios_active: any = [];
  @Input() showTimer: boolean = false;

  @Input() ms:any = '0' + 0;
  @Input() sec: any = '0' + 0;
  @Input() min: any = '0' + 0;
  @Input() hr: any = '0' + 0;

  constructor() { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {}
  
  ngOnDestroy(): void {
    //si salimos de la pantalla indicamos que usuario salio
    console.log('ngdestroy');
  }

}
