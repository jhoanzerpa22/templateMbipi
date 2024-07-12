import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ScopePrintComponent } from './scope_canvas/scope_print.component';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { ProyectsService } from '../../config-project-wizzard/proyects.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-descargables',
  templateUrl: './descargables.component.html',
  styleUrls: ['./descargables.component.scss']
})
export class DescargablesComponent implements OnInit {

  public proyecto_id: number;
  public proyecto: any = {};
  fecha: Date = new Date();

  @ViewChild('scope') scope: ElementRef;
  @ViewChild('lean') lean: ElementRef;
  @ViewChild('canvas_scope') canvas_scope: ElementRef;
  @ViewChild('canvas_lean') canvas_lean: ElementRef;
  @ViewChild('downloadLinkScope') downloadLinkScope: ElementRef;
  @ViewChild('downloadLinkLean') downloadLinkLean: ElementRef;

  public showDownloadScope: boolean = false;
  public showDownloadLean: boolean = false;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private _proyectsService: ProyectsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.proyecto_id = params['id'];
      this.getProyect();
    });
  }

  getFechaFormateada() {
    const day = this.fecha.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = (this.fecha.getMonth() + 1).toString().padStart(2, '0'); // Get month (Note: Month is zero-based)
    const year = this.fecha.getFullYear().toString(); // Get full year

    return `${day}/${month}/${year}`;
  }
  
  getProyect(){

    this._proyectsService.get(this.proyecto_id)
      .subscribe(
          (response) => {
            this.proyecto = response;
          },
          (response) => {
              // Reset the form
              //this.signUpNgForm.resetForm();
          }
      );
  }

  printPage() {
    /*const dialogRef = this.dialog.open(ScopePrintComponent, {
      width: '1200px',
      data: {proyecto_id: this.proyecto_id},
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });*/
    //window.print();
  }

  downloadScope(){
    setTimeout(() => { 
    /*html2canvas(this.scope.nativeElement, { 
      width: 5000,
      height: 5000
      }).then((canvas: any) => {
        console.log('canvas_result',canvas.toDataURL());
      this.canvas_scope.nativeElement.src = canvas.toDataURL();
      this.downloadLinkScope.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLinkScope.nativeElement.download = 'scope.png';
      this.downloadLinkScope.nativeElement.click();
      this.showDownloadScope = true;
    });*/
    
    html2canvas(this.scope.nativeElement, {/*width: 3000, height: 3000, */allowTaint: false, logging: false, useCORS: false}).then((canvas: any) => {
          /*// Convert the canvas to blob
          canvas.toBlob((blob: any) =>{
          // To download directly on browser default 'downloads' location
          let link = document.createElement("a");
          link.download = "scope.webp";
          link.href = URL.createObjectURL(blob);
          link.click();

          // To save manually somewhere in file explorer
          //window.saveAs(blob, 'image.png');

      },'image/webp');*/

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth(); // Ancho de la página del PDF
      const height = pdf.internal.pageSize.getHeight(); // Alto de la página del PDF

      pdf.addImage(imgData, 'PNG', 0, 0, width, (height / 2)); // Ajusta las coordenadas y dimensiones según sea necesario
      pdf.save('scope.pdf');
    });
    
    }, 3000);
    
  }

  downloadLean(){
    
    setTimeout(() => {
    /*html2canvas(this.lean.nativeElement).then((canvas:any) => {
      this.canvas_lean.nativeElement.src = canvas.toDataURL();
      this.downloadLinkLean.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLinkLean.nativeElement.download = 'lean.png';
      this.downloadLinkLean.nativeElement.click();
      this.showDownloadLean = true;
    });*/
    
    html2canvas(this.lean.nativeElement, {/*width: 3000, height: 3000, */allowTaint: false, logging: false, useCORS: false}).then((canvas: any) => {
      // Convert the canvas to blob
      /*canvas.toBlob((blob: any) =>{
          // To download directly on browser default 'downloads' location
          let link = document.createElement("a");
          link.download = "lean.webp";
          link.href = URL.createObjectURL(blob);
          link.click();

          // To save manually somewhere in file explorer
          //window.saveAs(blob, 'image.png');

      },'image/webp');*/
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth(); // Ancho de la página del PDF
      const height = pdf.internal.pageSize.getHeight(); // Alto de la página del PDF

      pdf.addImage(imgData, 'PNG', 0, 0, width, (height / 2)); // Ajusta las coordenadas y dimensiones según sea necesario
      pdf.save('lean.pdf');

    });
    
    }, 3000);
  }

}
