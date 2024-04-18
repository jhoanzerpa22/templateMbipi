import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit, 
  Input,
  Output
} from '@angular/core';
import { ProyectsService } from '../../../pages/config-project-wizzard/proyects.service';
import { ChangeDetectorRef } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-footer-lab',
  templateUrl: './footer-lab.component.html',
  styleUrls: ['./footer-lab.component.scss']
})
export class FooterLabComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() proyecto_id: any = '';
  @Input() paso: any = '';
  @Input() dia: any = '';
  @Input() rol: any = 'Decisor';
  @Input() video_url: any = 'http://res.cloudinary.com/tresideambipi/video/upload/v1659722491/videos/video_test_clgg4o.mp4';
  @Input() showVideo: boolean = true;
  
  @Output() activeNext: EventEmitter<any> = new EventEmitter<any>();

  showVideoFlag = true;
  //Clases para esconder o mostrar video.
  videoOn = "videoOn";
  videoOff = "videoOff";
  currentTime = 0;

  //Eventos sobre video
  primerEventoFlag = false;
  segundoEventoFlag = false;
  playing = false;

  constructor(private ref: ChangeDetectorRef, private _location: Location) { }

  ngOnInit(): void {
    if(this.showVideo){
      this.onPlayPause();
    }else{    
      this.showVideoFlag = false;
    }
  }
  
  ngAfterViewInit(): void {}
  
  ngOnDestroy(): void {
    //si salimos de la pantalla indicamos que usuario salio
    console.log('ngdestroy');
  }

  siguiente(){
    this.activeNext.emit();
  }

  onPlayPause(){
    //Revisa si el video esta pausado mediante su propiedad 'paused'(bool)
    this.playing= true;
    if($('#myVideo').prop('paused')){

      window.scrollTo(0, 0);
      window.addEventListener('scroll', this.disableScroll)

      console.log('Play');
      this.displayVideo();
      this.ref.detectChanges();
      $('#myVideo').trigger('play');
      if(this.primerEventoFlag){
        //Cuenta los segundos desde que se hace play en el video
        var id = setInterval(()=>{
          //Asigna el valor de la propiedad 'currentTime' a la variable cada 1 segundo
          this.currentTime = $('#myVideo').prop('this.currentTime');
          console.log(this.currentTime);
          //Gatilla eventos cada cierto valor de currentTime
          if(this.currentTime >= 3){
            this.hideVideo();
            $('#myVideo').trigger('pause');
            this.ref.detectChanges();
            clearInterval(id); //Detiene intervalo
          }
        }, 500)
      }
    }else{
      this.playing= false;
      console.log('Pause');
      this.hideVideo();
      this.ref.detectChanges();
      $('#myVideo').trigger('pause');
      window.removeEventListener('scroll', this.disableScroll);
    }

  }
  
  volver() {
    this._location.back();
  }

  disableScroll(){
    window.scrollTo(0, 0);
  }

  displayVideo(){
    this.showVideoFlag = true;
  }

  hideVideo(){
    this.showVideoFlag = false;
  }

}
