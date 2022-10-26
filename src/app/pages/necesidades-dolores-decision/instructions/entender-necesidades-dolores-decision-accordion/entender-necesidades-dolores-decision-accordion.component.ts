import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-necesidades-dolores-decision-accordion',
  templateUrl: './entender-necesidades-dolores-decision-accordion.component.html',
  styleUrls: ['./entender-necesidades-dolores-decision-accordion.component.scss']
})
export class EntenderNecesidadesDoloresDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
