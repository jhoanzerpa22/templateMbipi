import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-necesidades-dolores-accordion',
  templateUrl: './entender-necesidades-dolores-accordion.component.html',
  styleUrls: ['./entender-necesidades-dolores-accordion.component.scss']
})
export class EntenderNecesidadesDoloresAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
