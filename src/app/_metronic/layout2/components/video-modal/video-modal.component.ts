import { Component, Input, OnInit  } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss']
})
export class VideoModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {}


  ngOnInit(): void {
    $('#myVideo').trigger('play');
  }

}
