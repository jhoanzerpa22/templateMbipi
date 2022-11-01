import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-solucion-decision-accordion',
  templateUrl: './entender-solucion-decision-accordion.component.html',
  styleUrls: ['./entender-solucion-decision-accordion.component.scss']
})
export class EntenderSolucionDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
