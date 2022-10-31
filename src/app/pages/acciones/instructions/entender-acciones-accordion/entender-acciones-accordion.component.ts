import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-acciones-accordion',
  templateUrl: './entender-acciones-accordion.component.html',
  styleUrls: ['./entender-acciones-accordion.component.scss']
})
export class EntenderAccionesAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
