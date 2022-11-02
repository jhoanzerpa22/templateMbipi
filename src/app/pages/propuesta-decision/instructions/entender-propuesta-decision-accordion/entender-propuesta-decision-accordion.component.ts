import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-propuesta-decision-accordion',
  templateUrl: './entender-propuesta-decision-accordion.component.html',
  styleUrls: ['./entender-propuesta-decision-accordion.component.scss']
})
export class EntenderPropuestaDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
