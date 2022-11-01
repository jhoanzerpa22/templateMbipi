import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-solucion-accordion',
  templateUrl: './entender-solucion-accordion.component.html',
  styleUrls: ['./entender-solucion-accordion.component.scss']
})
export class EntenderSolucionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
