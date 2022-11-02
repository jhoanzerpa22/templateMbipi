import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-flujo-accordion',
  templateUrl: './entender-flujo-accordion.component.html',
  styleUrls: ['./entender-flujo-accordion.component.scss']
})
export class EntenderFlujoAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
