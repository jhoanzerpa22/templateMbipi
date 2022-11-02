import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-propuesta-accordion',
  templateUrl: './entender-propuesta-accordion.component.html',
  styleUrls: ['./entender-propuesta-accordion.component.scss']
})
export class EntenderPropuestaAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
