import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-repaso-accordion',
  templateUrl: './entender-repaso-accordion.component.html',
  styleUrls: ['./entender-repaso-accordion.component.scss']
})
export class EntenderRepasoAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
