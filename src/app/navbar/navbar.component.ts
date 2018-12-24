import { Component, OnInit } from '@angular/core';
import {B4aService} from '../b4a.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user:any;
  username:string;

  constructor(private b4aService : B4aService) { }

  ngOnInit() {
    let currrentUser = this.b4aService.currentUser();
    if(currrentUser){
      this.user = currrentUser;
      this.username = this.user.get('email');
    }
  }

  logout(){
    console.log('logging out');
    this.b4aService.logout();
  }

}
