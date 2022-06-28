import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { SocketWebService } from './boards.service';
import { ActivatedRoute } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsComponent implements OnInit {
  board: string;
  
  tablero: any = [];
  tablero2: any = [];
  votos: any = [];
  voto_tablero: any = [];
  voto_maximo: any = [];

  public filteredTablero: ReplaySubject<any> = new ReplaySubject<[]>(1);

  private _onDestroy = new Subject<void>();

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
      console.log('escucha',res);
      const { tablero } = res;
      this.readBoard(tablero, false);
    });
   }

  ngOnInit(): void {
    
    this.tablero.push({'title': 'Tablero 1', "data": [{'label': 'Get to work', 'voto': 0, 'voto_maximo': false}, {'label': 'Pick up groceries', 'voto': 0, 'voto_maximo': false}, {'label': 'Go home', 'voto': 0, 'voto_maximo': false}, {'label': 'Fall asleep', 'voto': 0, 'voto_maximo': false}]});
    this.tablero.push({'title': 'Tablero 2', "data": [{'label': 'Get to work2', 'voto': 0, 'voto_maximo': false}, {'label': 'Pick up groceries2', 'voto': 0, 'voto_maximo': false}, {'label': 'Go home2', 'voto': 0, 'voto_maximo': false}, {'label': 'Fall asleep2', 'voto': 0, 'voto_maximo': false}]});
    this.tablero2 = JSON.stringify(this.tablero);
    this.filteredTablero.next(this.tablero.slice());
    //this.board = this.route.snapshot.paramMap.get('board');
    //this.cookieService.set('board', this.board)
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private setInitialValue() {
    this.filteredTablero
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  private writeBoard(){
    console.log('writeBoard');
    this.socketWebService.emitEvent({tablero: JSON.stringify(this.tablero)});
  }

  private readBoard(tablero: any, emit: boolean){
    const data = JSON.parse(tablero);
    console.log('data',data);
    this.tablero = [];
    for(let c in data){
      this.tablero.push({'title': data[c].title, "data": data[c].data});
    }
    console.log('tablero_all', this.tablero);
    this.tablero2 = JSON.stringify(this.tablero);
    
    this.filteredTablero.next(this.tablero.slice());
  }

  votar(i: any, j: any){
    console.log('votar', i, j);
    console.log(this.tablero[i].data[j].label);
    this.tablero[i].data[j].voto = this.tablero[i].data[j].voto + 1;
    this.votos.push(i+':'+j);
    this.voto_tablero.push(i);
    console.log('votos', this.votos);
    this.writeBoard();
  }

  votarMaximo(i: any, j: any){
    console.log('votar_maximo', i, j);
    console.log(this.tablero[i].data[j].label);
    this.voto_maximo.push(i+':'+j);
    this.voto_tablero.push(i);
    this.tablero[i].data[j].voto_maximo = true;
    console.log('votos', this.votos);
    this.writeBoard();
  }

  quitar(i: any, j: any){
    console.log('quitar', i, j);
    console.log(this.tablero[i].data[j].label);
    this.tablero[i].data[j].voto = this.tablero[i].data[j].voto - 1;
    
    const index = this.votos.findIndex((c: any) => c == i+':'+j);
    
    if (index != -1) {
      this.votos.splice(index, 1);
    }

    const index2 = this.voto_tablero.findIndex((c: any) => c == i);
    
    if (index2 != -1) {
      this.voto_tablero.splice(index2, 1);
    }

    console.log('votos', this.votos);
    this.writeBoard();
  }

  
  quitarMaximo(i: any, j: any){
    console.log('quitar_maximo', i, j);
    console.log(this.tablero[i].data[j].label);
    
    const index = this.voto_maximo.findIndex((c: any) => c == i+':'+j);
    
    if (index != -1) {
      this.voto_maximo.splice(index, 1);
    }

    const index2 = this.voto_tablero.findIndex((c: any) => c == i);
    
    if (index2 != -1) {
      this.voto_tablero.splice(index2, 1);
    }

    this.tablero[i].data[j].voto_maximo = false;

    console.log('votos', this.votos);
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
    console.log('voto_tablero',this.voto_tablero);
    const index = this.voto_tablero.findIndex((c: any) => c == i);
    
    if (index != -1) {
      return true;
    }

    return false;
  
  }
}
