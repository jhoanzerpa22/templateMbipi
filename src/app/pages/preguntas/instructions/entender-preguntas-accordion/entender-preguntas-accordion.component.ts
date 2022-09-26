import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-preguntas-accordion',
  templateUrl: './entender-preguntas-accordion.component.html',
  styleUrls: ['./entender-preguntas-accordion.component.scss']
})
export class EntenderPreguntasAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
