import {Component, HostBinding, EventEmitter, Output, ElementRef} from '@angular/core'
//declare var webkitSpeechRecognition:any;
//declare var SpeechRecognition:any;
@Component({
  selector:'app-note-acciones-decision',
  templateUrl:'./notes-acciones-decision.component.html',
  styleUrls:['./notes-acciones-decision.component.css']
})

export class NoteAccionesDecisionComponent {
  //SpeechRecognition:any =webkitSpeechRecognition;
  
  recognition:any;

  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();
  constructor(private el:ElementRef) {
   const {webkitSpeechRecognition} : IWindow = <any>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onresult = (event: any)=> {
      this.el.nativeElement.querySelector(".content").innerText += event.results[0][0].transcript
      console.log(event.results[0][0].transcript) 
      document.getElementById('toolbar')?.focus();
    };
  }
  
  onDismiss(event: any){
    this.dismiss.emit(event);
  }
  
  onFocusOut(event: any){
    this.focusout.emit(event)
  }

  record(event: any) {
    this.recognition.start();
  }

}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}