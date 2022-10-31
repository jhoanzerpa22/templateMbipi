import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-acciones-decision-accordion',
  templateUrl: './entender-acciones-decision-accordion.component.html',
  styleUrls: ['./entender-acciones-decision-accordion.component.scss']
})
export class EntenderAccionesDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
