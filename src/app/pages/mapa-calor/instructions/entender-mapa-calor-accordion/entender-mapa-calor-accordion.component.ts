import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-mapa-calor-accordion',
  templateUrl: './entender-mapa-calor-accordion.component.html',
  styleUrls: ['./entender-mapa-calor-accordion.component.scss']
})
export class EntenderMapaCalorAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
