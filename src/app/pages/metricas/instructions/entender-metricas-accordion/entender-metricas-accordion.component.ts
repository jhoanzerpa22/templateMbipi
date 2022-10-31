import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-metricas-accordion',
  templateUrl: './entender-metricas-accordion.component.html',
  styleUrls: ['./entender-metricas-accordion.component.scss']
})
export class EntenderMetricasAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
