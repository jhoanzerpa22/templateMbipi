import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-decidir-accordion',
  templateUrl: './entender-decidir-accordion.component.html',
  styleUrls: ['./entender-decidir-accordion.component.scss']
})
export class EntenderDecidirAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
