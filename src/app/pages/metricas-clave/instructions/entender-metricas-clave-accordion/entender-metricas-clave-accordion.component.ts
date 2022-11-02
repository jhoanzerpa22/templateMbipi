import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-metricas-clave-accordion',
  templateUrl: './entender-metricas-clave-accordion.component.html',
  styleUrls: ['./entender-metricas-clave-accordion.component.scss']
})
export class EntenderMetricasClaveAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
