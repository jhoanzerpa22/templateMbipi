import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categorizacion-notas-accordion',
  templateUrl: './categorizacion-notas-accordion.component.html',
  styleUrls: ['./categorizacion-notas-accordion.component.scss']
})
export class CategorizacionNotasAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
