import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-metricas-clave-decision-accordion',
  templateUrl: './entender-metricas-clave-decision-accordion.component.html',
  styleUrls: ['./entender-metricas-clave-decision-accordion.component.scss']
})
export class EntenderMetricasClaveDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
