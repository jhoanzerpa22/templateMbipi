import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-exhibicion-accordion',
  templateUrl: './entender-exhibicion-accordion.component.html',
  styleUrls: ['./entender-exhibicion-accordion.component.scss']
})
export class EntenderExhibicionAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
