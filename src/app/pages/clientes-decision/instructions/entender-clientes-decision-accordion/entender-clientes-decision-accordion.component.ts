import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-clientes-decision-accordion',
  templateUrl: './entender-clientes-decision-accordion.component.html',
  styleUrls: ['./entender-clientes-decision-accordion.component.scss']
})
export class EntenderClientesDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
