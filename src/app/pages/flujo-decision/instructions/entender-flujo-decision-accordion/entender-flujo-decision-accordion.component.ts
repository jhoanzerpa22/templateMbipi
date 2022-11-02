import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-flujo-decision-accordion',
  templateUrl: './entender-flujo-decision-accordion.component.html',
  styleUrls: ['./entender-flujo-decision-accordion.component.scss']
})
export class EntenderFlujoDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
