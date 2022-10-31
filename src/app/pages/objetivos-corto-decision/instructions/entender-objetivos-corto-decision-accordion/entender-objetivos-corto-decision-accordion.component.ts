import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-objetivos-corto-decision-accordion',
  templateUrl: './entender-objetivos-corto-decision-accordion.component.html',
  styleUrls: ['./entender-objetivos-corto-decision-accordion.component.scss']
})
export class EntenderObjetivosCortoDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
