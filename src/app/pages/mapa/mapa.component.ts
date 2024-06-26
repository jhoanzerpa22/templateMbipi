import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import * as $ from 'jquery';
import { SocketWebService } from '../boards-default/boards.service';
import { ProyectsService } from '../config-project-wizzard/proyects.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Drawflow, {
  ConnectionEvent,
  ConnectionStartEvent,
  DrawFlowEditorMode,
  DrawflowConnection,
  DrawflowConnectionDetail,
  DrawflowNode,
  MousePositionEvent,
} from 'drawflow';
import { NodeElement } from './node.model';
import { ReplaySubject, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import {Location} from '@angular/common';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapaComponent implements OnInit, AfterViewInit, OnDestroy {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  toolbarDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  asideDisplay: boolean;

  showTimer: boolean = false;

  currentTime = 0;

  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  //Lista de Usuarios
  usuarios: any = []; //usuarios
  usuarios_active: any = []; //usuarios activos
  usuario: any = {}; //usuario logueado

  //Lista de notas
  notes: any = []; // lista de notas del tablero
  recognition:any;
  notes_all: any = []; // lista de notas de todos los participantes
  notes_cache: any = [];
  public proyecto: any = {};
  public proyecto_id: number;
  public rol: any = '';

  ms:any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  ms_paso:any = '0' + 0;
  sec_paso: any = '0' + 0;
  min_paso: any = '0' + 0;
  hr_paso: any = '0' + 0;
  dia_paso: any = 'dia1_paso4';
  tiempo_paso: any = '';

  showTimerPass: boolean = false;

  board: string;
  tablero: any = [];
  tablero2: any = [];
  public filteredTablero: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  dataNode:any =[];
  
  nodes: NodeElement[] = [];
  nodesHTML!: NodeListOf<Element>;
  nodesDrawn: any[] = [];
  selectedItem!: NodeElement;
  editor!: any;
  locked: boolean = false;
  lastMousePositionEv: any;
  drawFlowHtmlElement!: HTMLElement;
  idNode:any = 0;
  nodeHeight: any;
  nodeWidth: any;

  isLoading:boolean = true;
  video_url: any = 'http://res.cloudinary.com/tresideambipi/video/upload/v1659722491/videos/video_test_clgg4o.mp4'; 

  constructor(/*
  private initService: LayoutInitService,
  private layout: LayoutService*/
  private el:ElementRef,
  private socketWebService: SocketWebService,
  private _proyectsService: ProyectsService,
  private ref: ChangeDetectorRef,
  private modalService: NgbModal,
  private _router: Router,
  private route: ActivatedRoute, 
  private _location: Location
  ) {
    /*this.initService.init();*/

    //escuchamos el evento de usuarios activos
    this.socketWebService.outEvenUsersActive.subscribe((res: any) => {
      const { usuarios_active } = res;
      this.readUsersActive(usuarios_active, false);
    });

    //escuchamos el evento de las notas de los usuarios
    this.socketWebService.outEven.subscribe((res: any) => {
      const { tablero } = res;
      this.readBoard(tablero, false);
    });

    //escuchamos el evento para continuar
    this.socketWebService.outEvenContinue.subscribe((res: any) => {
      this.continue();
    });

    //escuchamos el evento activo
    this.socketWebService.outEvenEtapaActive.subscribe((res: any) => {
      this.etapa_active(res);
    });

    //leemos usuario logueado
    const usuario: any = localStorage.getItem('usuario');
    let user: any = JSON.parse(usuario);
    //lo asignamos a variable
    this.usuario = user;
    this.usuario.active = true; // indicamos que esta activo

    //leemos nota en cache
    const notes: any = localStorage.getItem('notes_preguntas');
    this.notes_cache = JSON.parse(notes) || [/*{ id: 0+'-'+this.usuario.nombre, content:'' }*/];

    //si existen notas en cache las enviamos al socket
    //if(this.notes.length > 0){
      //this.socketWebService.emitEventTablero({tablero: JSON.stringify(this.notes)});
      //this.sendNotes(this.notes);
    //}

    const {webkitSpeechRecognition} : IWindow = <any>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onresult = (event: any)=> {
      console.log(this.el.nativeElement.querySelectorAll(".content")[0]);
      this.el.nativeElement.querySelectorAll(".content")[0].innerText = event.results[0][0].transcript

    };
  }

  ngOnInit(): void {

    //Buscar etapa activa
    //this.socketWebService.emitEventGetEtapa();
    this.initializeList(1);
      
    this.route.params.subscribe(params => {
      //console.log('params',params);
      this.proyecto_id = params['id'];
      this.getProyect();
    });

    this.socketWebService.ioSocket.connect();
    this.socketWebService.emitLogin(this.proyecto_id);

  }

  ngAfterViewInit(): void {
    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[key] =
            this.headerHTMLAttributes[key];
        }
      }
    }

    this.drawFlowHtmlElement = <HTMLElement>document.getElementById('drawflow');
      this.initDrawFlow(this.drawFlowHtmlElement);
  
      // Events!
      //this.editor.on('keydown', function(event: any){
  
        // this.writeBoard()
      //})

      this.editor.on('keydown', (event: any) => {
        //console.log("Keydown" + event);
        
        //this.writeBoard();
      })
  
      this.editor.on('nodeDataChanged', (id: any)=>{
        console.log("Node Data Changed" + id)
        console.log("!!!!!!!!!!!!!!!!!!!!!!")
        this.writeBoard()
        // var height = $(this).prop("scrollHeight")+2+"px";
        // $(this).css({"height":height});
  
      })
  
      this.editor.on('nodeCreated', (id: any) => {
        console.log(
          'Editor Event :>> Node created ' + id,
          this.editor.getNodeFromId(id)
        );
        // this.idNode = id;
        // console.log("ID ", id);
        this.writeBoard()
      });
  
      this.editor.on('nodeRemoved', (id: any) => {
        console.log('Editor Event :>> Node removed ' + id);
        this.writeBoard()
      });
  
      this.editor.on('nodeSelected', (id: any) => {
        console.log(
          'Editor Event :>> Node selected ' + id,
          this.editor.getNodeFromId(id)
          
        );
    
        this.writeBoard();
  
        this.getNodeHeight();
  
        // this.dataNode= this.editor.getNodeFromId(id)
        // const dataNode2 = this.editor.getNodeFromId(id)
        // this.socketWebService.emitEvent({dataNode2});
  
      });
  
      this.editor.on('nodeUnselected', (id: any) => {
        console.log(
          'Editor Event :>> Node unselected '
        );
        this.writeBoard();
        this.getNodeHeight();
  
      });
  
      this.editor.on('moduleCreated', (name: any) => {
        console.log('Editor Event :>> Module Created ' + name);
        this.writeBoard()
      });
  
      this.editor.on('moduleChanged', (name: any) => {
        console.log('Editor Event :>> Module Changed ' + name);
        this.writeBoard()
      });
  
      this.editor.on('connectionCreated', (connection: any) => {
        console.log('Editor Event :>> Connection created ', connection);
        this.writeBoard()
      });
  
      this.editor.on('connectionRemoved', (connection: any) => {
        console.log('Editor Event :>> Connection removed ', connection);
        this.writeBoard()
      });
  
      // this.editor.on('mouseMove', (position: any) => {
      //   console.log('Editor Event :>> Position mouse x:' + position.x + ' y:' + position.y);
      // });
  
      this.editor.on('nodeMoved', (id: any) => {
        console.log('Editor Event :>> Node moved ' + id);
        this.writeBoard()
      });
  
      this.editor.on('zoom', (zoom: any) => {
        console.log('Editor Event :>> Zoom level ' + zoom);
        this.writeBoard()
      });
  
      // this.editor.on('translate', (position: any) => {
      //   console.log(
      //     'Editor Event :>> Translate x:' + position.x + ' y:' + position.y
      //   );
      // });
  
      this.editor.on('addReroute', (id: any) => {
        console.log('Editor Event :>> Reroute added ' + id);
        this.writeBoard()
      });
  
      this.editor.on('removeReroute', (id: any) => {
        console.log('Editor Event :>> Reroute removed ' + id);
        this.writeBoard()
      });
  
      console.log(this.editor.drawflow)

    //verificamos si el usuario logueado ya existe en el listado
    const index2 = this.usuarios_active.findIndex((c: any) => c.id == this.usuario.id);

    //si existe lo eliminamos y volvemos a agregarlo para evitar datos obsoletos
    if (index2 != -1) {
      this.usuarios_active.splice(index2, 1);
    }
    this.usuarios_active.push({'id': this.usuario.id, 'nombre': this.usuario.nombre, 'active': true});

    console.log('enviando_usuario',this.usuario);

    //this.socketWebService.emitEventUsers({usuarios: JSON.stringify(this.usuarios)});
    //enviamos al socket el usuario logueado
    this.socketWebService.emitEventUsersActive(this.usuario);

    //Inicia video y cancela scroll
    //this.onPlayPause();

    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    //si salimos de la pantalla indicamos que usuario salio
    console.log('ngdestroy');
    this.socketWebService.emitEventUsersInactive(this.usuario);
    this.socketWebService.ioSocket.disconnect();
    window.removeEventListener('scroll', this.disableScroll);
  }

  initializeList(length: number) {
    for (let i = 0; i < length; i++) {
      this.nodes.push({
        id: i + 1,
        name: 'Nuevo\nArrastre para agregar',// + (i + 1),
        inputs: 1,
        outputs: 1,
      });
    }
  }

  initDrawFlow(htmlElement: HTMLElement): void {
    this.editor = new Drawflow(htmlElement);
    this.editor.reroute = false;
    this.editor.reroute_fix_curvature = true;
    this.editor.force_first_input = false;
    this.editor.curvature = 0.5;
    this.editor.reroute_width = 1;
    this.editor.line_path = 1;
    this.editor.editor_mode = 'edit';
    this.editor.draggable_inputs = false;

    this.editor.start();

    const dataToImport = {
      drawflow: {
        "Home": {
            "data": {
                "1": {
                    "id": 1,
                    "name": "node 1",
                    "data": {"template":""},
                    "class": "template",
                    "html": "\n        <div>\n          <div class=\"box\">\n <span class=\"txtAreaStyle\" df-template id=\"textarea-1\" contenteditable></span>\n          </div>\n        </div>\n          ",
                    "typenode": false,
                    "inputs": {
                        "input_1": {
                            "connections": []
                        }
                    },
                    "outputs": {
                        "output_1": {
                            "connections": []
                        }
                    },
                    "pos_x": 299,
                    "pos_y": 84
                }
            }
        }
      }
    };

    this.editor.import(dataToImport);
    // console.log(this.tablero)
  }

  getNodeHeight(){
    const id= "node-1";
    this.nodeHeight = document.getElementById(id);
    //console.log('Height: ', this.nodeHeight.clientHeight);
  }

  // Drag Events
  onDragStart(e: any) {
    if (e.type === 'dragstart') {
      console.log('onDragStart :>> e :>> ', e);
      this.selectedItem = <NodeElement>(
        this.nodes.find((node: NodeElement) => node.name === e.target.outerText)
      );
    }

  }

  onDragEnter(e: any) {
    console.log('onDragEnter :>> e :>> ', e);

  }

  onDragLeave(e: any) {
    console.log('onDragLeave :>> e :>> ', e);

  }

  onDragOver(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.lastMousePositionEv = e;
    // console.log('onDragOver :>> e :>> ', e);

  }

  onDragEnd(e: any) {
    console.log('onDragend :>> e :>> ', e);

  }

  onDrop(e: any) {
    // After dropping the element, create a node
    if (e.type === 'drop') {
      console.log('onDrop :>> e :>> ', e);
      e.preventDefault();
      this.addNodeToDrawBoard(e.clientX, e.clientY);
      this.resetAllInputsOutputs();
    }

  }

  resetAllInputsOutputs() {
    this.nodes.forEach((node) => {
      node.inputs = 1;
      node.outputs = 1;
    });
  }

  // Drawflow Editor Operations
  addNodeToDrawBoard(pos_x: number, pos_y: number) {
    if (this.editor.editor_mode === 'edit') {
      pos_x =
        pos_x *
          (this.editor.precanvas.clientWidth /
            (this.editor.precanvas.clientWidth * this.editor.zoom)) -
        this.editor.precanvas.getBoundingClientRect().x *
          (this.editor.precanvas.clientWidth /
            (this.editor.precanvas.clientWidth * this.editor.zoom));

      pos_y =
        pos_y *
          (this.editor.precanvas.clientHeight /
            (this.editor.precanvas.clientHeight * this.editor.zoom)) -
        this.editor.precanvas.getBoundingClientRect().y *
          (this.editor.precanvas.clientHeight /
            (this.editor.precanvas.clientHeight * this.editor.zoom));


      // <textarea class="txtAreaStyle" id="textarea-`+ this.idNode +`" df-template> </textarea>
      this.idNode += 1;
      const htmlTemplate = `
        <div>
          <div class="box">
            <span class="txtAreaStyle" df-template id="textarea-`+ this.idNode +`" contenteditable></span>
          </div>
        </div>
          `;

      const nodeName = this.selectedItem.name;
      const nodeId = this.editor.addNode(
        this.selectedItem.name,
        this.selectedItem.inputs,
        this.selectedItem.outputs,
        pos_x,
        pos_y,
        'template', 
        { "template": ''},
        htmlTemplate,
        false
      );

      this.nodesDrawn.push({
        nodeId,
        nodeName,
      });

      // const newNode = <DrawflowNode>this.editor.getNodeFromId(nodeId);
    }
  }

  onClear() {
    this.editor.clear();
  }

  changeMode() {
    this.locked = !this.locked;
    this.editor.editor_mode = this.locked ? 'fixed' : 'edit';
  }

  onZoomOut() {
    this.editor.zoom_out();
  }

  onZoomIn() {
    this.editor.zoom_in();
  }

  onZoomReset() {
    this.editor.zoom_reset();
  }

  onSubmit() {
    const dataExport = this.editor.export();
    console.log('dataExport :>> ', dataExport);
  }

  private writeBoard(){
    //console.log('writeBoard');
    const dataToImport = this.editor.export()
    console.log('dataToImport', dataToImport);

    this.socketWebService.emitEvent({tablero: JSON.stringify(dataToImport)});
    this._proyectsService.updateMapaux(this.proyecto_id, {contenido: dataToImport})
    .subscribe(
        data => {
        },
        (response) => {
        }
    );

  }

  private readBoard(tablero: any, emit: boolean){
    const data = JSON.parse(tablero);
    console.log('data',data);
    this.editor.import(data);
    // this.tablero = [];
    // for(let c in data){
    //   this.tablero.push({'title': data[c].title, "data": data[c].data});
    // }
    // console.log('tablero_all', this.tablero);
    // this.tablero2 = JSON.stringify(this.tablero);

    // this.filteredTablero.next(this.tablero.slice());
  }

  getProyect(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
            this.usuarios = this.proyecto.proyecto_equipo.equipo_usuarios;
            let usuario_proyecto = this.usuarios.filter(
              (op: any) => (
                op.usuario_id == this.usuario.id)
              );
            this.rol = usuario_proyecto[0].rol;

            if(this.proyecto.tiempo != '' && this.proyecto.tiempo != undefined){
              let tiempo = this.proyecto.tiempo.split(':');
              this.hr = tiempo[0];
              this.min = tiempo[1];
            }
            this.showTimer = true;

            if(this.proyecto.tiempo_paso != '' && this.proyecto.tiempo_paso != undefined){
              this.tiempo_paso = this.proyecto.tiempo_paso;
              
              const time_proyect = JSON.parse(this.tiempo_paso);

              if (time_proyect.hasOwnProperty(this.dia_paso)) {
                
                let tiempo_paso_dia = time_proyect[this.dia_paso].split(':');
                this.hr_paso = tiempo_paso_dia[0];
                this.min_paso = tiempo_paso_dia[1];
              }
            }
            this.showTimerPass = true;
              
              this.isLoading = false;

              for(let c in this.proyecto.proyecto_recursos){
                if(this.proyecto.proyecto_recursos[c].mapaux != null){      
                  this.readBoard(this.proyecto.proyecto_recursos[c].mapaux.contenido, false);
                }
            }
            
              //this.onPlayPause();

            this.ref.detectChanges();
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }

  //actualizamos lista de usuarios activos
  private readUsersActive(data: any, emit: boolean){
    const usuarios = JSON.parse(data);
    console.log('recibe_usuarios', usuarios);
    
    this.usuarios_active = usuarios;

    this.ref.detectChanges();
  }
  
  saveNoteAll() {
    const data_etapa = {etapa_activa: '/proyect-init/'+this.proyecto_id+'/fase9'};

    const dataToImport = this.editor.export();

    this._proyectsService.updateEtapaMapa(this.proyecto_id, data_etapa)
    .subscribe(
        data => {

          this.socketWebService.emitEventSetEtapa('/proyect-init/'+this.proyecto_id+'/fase9');

          this.socketWebService.emitEventTableroSaveMapa({tablero: JSON.stringify(dataToImport)});

        },
        (response) => {
        }
    );

    //this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase2']);
  }

  continue() {
    //this._router.navigate(['/proyect-init/'+this.proyecto_id+'/fase9']);
    /*Swal.fire({
      text: "Felicitaciones! Has finalizado el día 1 – Entender, ahora puedes continuar con el siguiente día",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Ok!",
      customClass: {
        confirmButton: "btn btn-primary"
      }
    });*/
    
    this._router.navigate(['/proyect-init/'+this.proyecto_id]);
  }

  etapa_active(etapa_active: any) {
    if(etapa_active != ''){
      this._router.navigate([etapa_active]);
    }
  }
  
  disableScroll(){
    window.scrollTo(0, 0);
  }

}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
