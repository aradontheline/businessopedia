import { Component, OnInit } from '@angular/core';
import { B4aService } from '../b4a.service';
import { Router } from '@angular/router';
import { User } from '../model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user:User;
  username:string;

  constructor(private b4aService:B4aService, private router:Router) { }

  ngOnInit() {
    let currrentUser = this.b4aService.currentUser;
    if(!currrentUser){
      this.router.navigateByUrl('login');    
    }else{
      this.username = currrentUser.get("email")
      
    }

  }

  goToAddBusiness(){
    this.router.navigateByUrl('add-business');
  }

  goToMyBusinesses(){
    this.router.navigateByUrl('my-businesses');
  }

  goToMyChats(){
    this.router.navigateByUrl('my-chats');
  }

}
