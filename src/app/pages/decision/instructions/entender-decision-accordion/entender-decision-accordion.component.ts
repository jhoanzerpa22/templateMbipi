import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-decision-accordion',
  templateUrl: './entender-decision-accordion.component.html',
  styleUrls: ['./entender-decision-accordion.component.scss']
})
export class EntenderDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
