import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-loadmask',
	templateUrl: './loadMask.component.html',
  	styleUrls: ['./loadMask.component.css']
})

export class LoadMaskComponent implements OnInit {
	@Input() loader:boolean = false;
	
	constructor () {}
	ngOnInit () {}

}