import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-canales-accordion',
  templateUrl: './entender-canales-accordion.component.html',
  styleUrls: ['./entender-canales-accordion.component.scss']
})
export class EntenderCanalesAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
