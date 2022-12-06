import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-crazy-accordion',
  templateUrl: './entender-crazy-accordion.component.html',
  styleUrls: ['./entender-crazy-accordion.component.scss']
})
export class EntenderCrazyAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
