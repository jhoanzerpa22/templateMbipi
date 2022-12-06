import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-ideas-accordion',
  templateUrl: './entender-ideas-accordion.component.html',
  styleUrls: ['./entender-ideas-accordion.component.scss']
})
export class EntenderIdeasAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
