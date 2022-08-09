import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { SocketWebService } from './boards.service';
import { ActivatedRoute } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

declare var $: any; 
declare var jQuery: any;

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsComponent implements OnInit, AfterViewInit {
  
  @ViewChild('canvasRef', { static: false }) canvasRef: ElementRef;
  @ViewChild('tableroRef', { static: false }) tableroRef: ElementRef;

  board: string;
  
  tablero: any = [];
  tablero2: any = [];
  votos: any = [];
  voto_tablero: any = [];
  voto_maximo: any = [];
  _user: any = {};
  equipo: any = [];

  public filteredTablero: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

    public width: number = 50;
    public height: number = 50;
  
    private cx: CanvasRenderingContext2D;
  
    private points: Array<any> = [];
  
    public isAvailabe: boolean = false;
  
    @HostListener('document:mousemove', ['$event'])
    onMouseMove = (e: any) => {
      //if (e.target.id === 'canvasId' && (this.isAvailabe)) {
        this.write(e);
      //}
    }
  
    @HostListener('click', ['$event'])
    onClick = (e: any) => {
      if (e.target.id === 'canvasId') {
        this.isAvailabe = !this.isAvailabe;
      }
    }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.writeBoard();
  }

  constructor(
    private route: ActivatedRoute,
    private socketWebService: SocketWebService
  ) {
    this.socketWebService.outEven.subscribe((res: any) => {
      //console.log('escucha_tablero',res);
      const { tablero } = res;
      this.readBoard(tablero, false);
    });

    this.socketWebService.outEven2.subscribe((res: any) => {
      //console.log('escucha_puntero',res);

      const { prevPost } = res;
      const index = this.equipo.findIndex((c: any) => c == prevPost.usuario);
      console.log('usuario',prevPost.usuario);
        if (index == -1) {
          this.equipo.push(prevPost.usuario);
        }
      //jQuery("#canvasId").css({"left" : prevPost.x, "top" : prevPost.y});
      jQuery("#puntero-"+prevPost.usuario).css({"left" : prevPost.x, "top" : prevPost.y, "display": "block"});
      jQuery("#equipo-"+prevPost.usuario).css({"left" : prevPost.x + 30, "top" : prevPost.y, "display": "block"});
      console.log('equipo',this.equipo);

      this.writeSingle(prevPost, false);
    })
   }

  ngOnInit(): void {
    
    this.tablero.push({'title': 'Tablero 1', "data": [{'label': 'Get to work', 'voto': 0, 'voto_maximo': false}, {'label': 'Pick up groceries', 'voto': 0, 'voto_maximo': false}, {'label': 'Go home', 'voto': 0, 'voto_maximo': false}, {'label': 'Fall asleep', 'voto': 0, 'voto_maximo': false}]});
    this.tablero.push({'title': 'Tablero 2', "data": [{'label': 'Get to work2', 'voto': 0, 'voto_maximo': false}, {'label': 'Pick up groceries2', 'voto': 0, 'voto_maximo': false}, {'label': 'Go home2', 'voto': 0, 'voto_maximo': false}, {'label': 'Fall asleep2', 'voto': 0, 'voto_maximo': false}]});
    this.tablero2 = JSON.stringify(this.tablero);
    this.filteredTablero.next(this.tablero.slice());
    
    const usuario: any = localStorage.getItem('usuario');
    this._user = JSON.parse(usuario);
    //this.board = this.route.snapshot.paramMap.get('board');
    //this.cookieService.set('board', this.board)
  }

  ngAfterViewInit() {
    this.setInitialValue();
    this.render();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private render() {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');/*
    var img = new Image();
    img.src = "https://w7.pngwing.com/pngs/547/1024/png-transparent-computer-mouse-pointer-arrow-mouse-cursor-white-arrow-on-black-background-miscellaneous-angle-text.png";*/
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';/*
    this.cx.drawImage(img, 0, 0);
    this.cx.save();*/
  }

  private write(res: any) {
    //const canvasEl = this.canvasRef.nativeElement;
    const canvasEl = this.tableroRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top,
      usuario: this._user.nombre
    }
    /*const prevPos = {
      x: res.clientX,
      y: res.clientY,
    }*/
    this.writeSingle(prevPos);
  }

  private writeSingle(prevPos: any, emit: boolean = true) {
    this.points.push(prevPos);
    //if (this.points.length > 3) {
      const prevPost = this.points[this.points.length - 1];
      const currentPost = this.points[this.points.length - 2];

      //this.drawOnCanvas(prevPost, currentPost);
      if (emit) {
        this.socketWebService.emitEvent2({ prevPost })
      }

    //}
  }

  private drawOnCanvas(prevPos: any, currentPost: any) {
    if (!this.cx) return;
    this.cx.beginPath();

    if (prevPos) {
      this.points = [];
      this.cx.clearRect(0, 0, this.width, this.height);
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPost.x, currentPost.y);
      this.cx.stroke();
    }
  }


  public clearZone = () => {
    this.points = [];
    this.cx.clearRect(0, 0, this.width, this.height);
  }

  private setInitialValue() {
    this.filteredTablero
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  private writeBoard(){
    //console.log('writeBoard');
    this.socketWebService.emitEvent({tablero: JSON.stringify(this.tablero)});
  }

  private readBoard(tablero: any, emit: boolean){
    const data = JSON.parse(tablero);
    //console.log('data',data);
    this.tablero = [];
    for(let c in data){
      this.tablero.push({'title': data[c].title, "data": data[c].data});
    }
    //console.log('tablero_all', this.tablero);
    this.tablero2 = JSON.stringify(this.tablero);
    
    this.filteredTablero.next(this.tablero.slice());
  }

  votar(i: any, j: any){
    //console.log('votar', i, j);
    //console.log(this.tablero[i].data[j].label);
    this.tablero[i].data[j].voto = this.tablero[i].data[j].voto + 1;
    this.votos.push(i+':'+j);
    this.voto_tablero.push(i);
    //console.log('votos', this.votos);
    this.writeBoard();
  }

  votarMaximo(i: any, j: any){
    //console.log('votar_maximo', i, j);
    //console.log(this.tablero[i].data[j].label);
    this.voto_maximo.push(i+':'+j);
    this.voto_tablero.push(i);
    this.tablero[i].data[j].voto_maximo = true;
    //console.log('votos', this.votos);
    this.writeBoard();
  }

  quitar(i: any, j: any){
    //console.log('quitar', i, j);
    //console.log(this.tablero[i].data[j].label);
    this.tablero[i].data[j].voto = this.tablero[i].data[j].voto - 1;
    
    const index = this.votos.findIndex((c: any) => c == i+':'+j);
    
    if (index != -1) {
      this.votos.splice(index, 1);
    }

    const index2 = this.voto_tablero.findIndex((c: any) => c == i);
    
    if (index2 != -1) {
      this.voto_tablero.splice(index2, 1);
    }

    //console.log('votos', this.votos);
    this.writeBoard();
  }

  
  quitarMaximo(i: any, j: any){
    //console.log('quitar_maximo', i, j);
    //console.log(this.tablero[i].data[j].label);
    
    const index = this.voto_maximo.findIndex((c: any) => c == i+':'+j);
    
    if (index != -1) {
      this.voto_maximo.splice(index, 1);
    }

    const index2 = this.voto_tablero.findIndex((c: any) => c == i);
    
    if (index2 != -1) {
      this.voto_tablero.splice(index2, 1);
    }

    this.tablero[i].data[j].voto_maximo = false;

    //console.log('votos', this.votos);
    this.writeBoard();
  }

  verifyVoto(i: any, j: any){
    const index = this.votos.findIndex((c: any) => c == i+':'+j);
    
    if (index != -1) {
      return true;
    }

    return false;
  
  }
  
  verifyVotoMaximo(i: any, j: any){
    /*const index = this.voto_maximo.findIndex((c) => c == i+':'+j);
    
    if (index != -1) {
      return true;
    }

    return false;*/

    if(this.tablero[i].data[j].voto_maximo == true){
      return true;
    }else{
      return false;
    }
  
  }

  
  verifyVotoTablero(i: any){
    //console.log('voto_tablero',this.voto_tablero);
    const index = this.voto_tablero.findIndex((c: any) => c == i);
    
    if (index != -1) {
      return true;
    }

    return false;
  
  }
}
