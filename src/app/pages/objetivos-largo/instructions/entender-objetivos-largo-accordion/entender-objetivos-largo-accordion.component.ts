import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entender-objetivos-largo-accordion',
  templateUrl: './entender-objetivos-largo-accordion.component.html',
  styleUrls: ['./entender-objetivos-largo-accordion.component.scss']
})
export class EntenderObjetivosLargoAccordionComponent implements OnInit {

  @ViewChild('acc') accordion: any;//NgbAccordion;

  constructor() { }

  ngOnInit(): void {
  }

}
