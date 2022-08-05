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
