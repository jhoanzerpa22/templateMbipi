import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-canales-decision-accordion',
  templateUrl: './entender-canales-decision-accordion.component.html',
  styleUrls: ['./entender-canales-decision-accordion.component.scss']
})
export class EntenderCanalesDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
