import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  _user: any;

  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
    const usuario: any = localStorage.getItem('usuario');
    this._user = JSON.parse(usuario);
  }
  
  imgError(ev: any){

    let source = ev.srcElement;
    let imgSrc = 'assets/media/avatars/300-1.jpg';

    source.src = imgSrc;
  }
}
