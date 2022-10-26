import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-necesidades-accordion',
  templateUrl: './entender-necesidades-accordion.component.html',
  styleUrls: ['./entender-necesidades-accordion.component.scss']
})
export class EntenderNecesidadesAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
