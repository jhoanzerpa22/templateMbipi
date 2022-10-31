import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-objetivos-corto-accordion',
  templateUrl: './entender-objetivos-corto-accordion.component.html',
  styleUrls: ['./entender-objetivos-corto-accordion.component.scss']
})
export class EntenderObjetivosCortoAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
