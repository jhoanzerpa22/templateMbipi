import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-propositos-decision-accordion',
  templateUrl: './entender-propositos-decision-accordion.component.html',
  styleUrls: ['./entender-propositos-decision-accordion.component.scss']
})
export class EntenderPropositosDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
