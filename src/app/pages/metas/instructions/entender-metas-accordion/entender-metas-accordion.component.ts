import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-metas-accordion',
  templateUrl: './entender-metas-accordion.component.html',
  styleUrls: ['./entender-metas-accordion.component.scss']
})
export class EntenderMetasAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
