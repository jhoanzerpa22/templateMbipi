import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-clientes-accordion',
  templateUrl: './entender-clientes-accordion.component.html',
  styleUrls: ['./entender-clientes-accordion.component.scss']
})
export class EntenderClientesAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
