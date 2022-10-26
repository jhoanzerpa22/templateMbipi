import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-propositos-accordion',
  templateUrl: './entender-propositos-accordion.component.html',
  styleUrls: ['./entender-propositos-accordion.component.scss']
})
export class EntenderPropositosAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
