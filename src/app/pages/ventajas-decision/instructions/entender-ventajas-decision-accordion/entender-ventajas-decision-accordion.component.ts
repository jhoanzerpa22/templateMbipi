import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-ventajas-decision-accordion',
  templateUrl: './entender-ventajas-decision-accordion.component.html',
  styleUrls: ['./entender-ventajas-decision-accordion.component.scss']
})
export class EntenderVentajasDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
