import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-metricas-decision-accordion',
  templateUrl: './entender-metricas-decision-accordion.component.html',
  styleUrls: ['./entender-metricas-decision-accordion.component.scss']
})
export class EntenderMetricasDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
