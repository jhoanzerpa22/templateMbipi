import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  public user: any = {};
  public usuario: any = localStorage.getItem('usuario');
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  constructor(private ref: ChangeDetectorRef) {
    this.user = JSON.parse(this.usuario);
    //this.ref.detectChanges();
  }

  ngOnInit(): void {}
}
