import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-problema-decision-accordion',
  templateUrl: './entender-problema-decision-accordion.component.html',
  styleUrls: ['./entender-problema-decision-accordion.component.scss']
})
export class EntenderProblemaDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
