import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-necesidades-decision-accordion',
  templateUrl: './entender-necesidades-decision-accordion.component.html',
  styleUrls: ['./entender-necesidades-decision-accordion.component.scss']
})
export class EntenderNecesidadesDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
