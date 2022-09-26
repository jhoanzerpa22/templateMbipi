import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preguntas-accordion',
  templateUrl: './preguntas-accordion.component.html',
  styleUrls: ['./preguntas-accordion.component.scss']
})
export class PreguntasAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
