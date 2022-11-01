import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-problema-accordion',
  templateUrl: './entender-problema-accordion.component.html',
  styleUrls: ['./entender-problema-accordion.component.scss']
})
export class EntenderProblemaAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
