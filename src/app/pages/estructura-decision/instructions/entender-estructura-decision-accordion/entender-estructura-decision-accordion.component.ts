import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-estructura-decision-accordion',
  templateUrl: './entender-estructura-decision-accordion.component.html',
  styleUrls: ['./entender-estructura-decision-accordion.component.scss']
})
export class EntenderEstructuraDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
