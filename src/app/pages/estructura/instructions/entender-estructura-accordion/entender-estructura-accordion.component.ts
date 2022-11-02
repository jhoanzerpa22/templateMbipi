import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-estructura-accordion',
  templateUrl: './entender-estructura-accordion.component.html',
  styleUrls: ['./entender-estructura-accordion.component.scss']
})
export class EntenderEstructuraAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
