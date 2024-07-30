import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from '../users.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  constructor(
    private _usersService: UsersService,
    private _router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef, 
    private userService: UserService) {}
    user: any = [];
    id: any = '';

  ngOnInit(): void {
    
    this.searchOnchangeActive();

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id > 0){
        this.getUser(params['id']);
      }
    });
  }
  
  imgError(ev: any){

    let source = ev.srcElement;
    let imgSrc = 'assets/media/svg/avatars/blank-dark.svg';

    source.src = imgSrc;
  }
  
  searchOnchangeActive() {
    this.userService._changes$.subscribe((resp:any) => {
  
        if (resp && resp == 'active') {
          this.getUser(this.id);
        } 
      });
  }

  getUser(id: any): void {
    this._usersService.get(id)
      .subscribe(
        data => {
          this.user = data;
          this.ref.detectChanges();
        },
        error => {
          console.log(error);
        });
  }
}
