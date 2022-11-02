import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-ventajas-accordion',
  templateUrl: './entender-ventajas-accordion.component.html',
  styleUrls: ['./entender-ventajas-accordion.component.scss']
})
export class EntenderVentajasAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
