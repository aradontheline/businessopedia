import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {B4aService } from '../b4a.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    email:'',
    pass:''
  }

  constructor(private router: Router,private b4aService:B4aService) { }

  ngOnInit() {
    console.log('Login page')
    let currrentUser = this.b4aService.currentUser;
    if(currrentUser){
      this.router.navigateByUrl('profile');
    }
  }

  login(){
    this.b4aService.login(this.user)
    .then((user:any)=>{
      console.log(`user ${user.get('username')} logged in`);
      this.router.navigateByUrl('profile');
    })
    .catch((error)=>{
      console.log(`Error ${error.message}`);
    })
  }

}