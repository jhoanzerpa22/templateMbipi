import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  constructor(
    private _usersService: UsersService,
    private _router: Router,
    private route: ActivatedRoute) {}
    user: any = [];
    id: any = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id > 0){
        this.getUser(params['id']);
      }
    });
  }
  
  imgError(ev: any){

    let source = ev.srcElement;
    let imgSrc = 'assets/media/avatars/300-1.jpg';

    source.src = imgSrc;
  }

  getUser(id: any): void {
    this._usersService.get(id)
      .subscribe(
        data => {
          this.user = data;
        },
        error => {
          console.log(error);
        });
  }
}
