import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-objetivos-largo-decision-accordion',
  templateUrl: './entender-objetivos-largo-decision-accordion.component.html',
  styleUrls: ['./entender-objetivos-largo-decision-accordion.component.scss']
})
export class EntenderObjetivosLargoDecisionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
