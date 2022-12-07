import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-demos-accordion',
  templateUrl: './entender-demos-accordion.component.html',
  styleUrls: ['./entender-demos-accordion.component.scss']
})
export class EntenderDemosAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
