import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../model';

import {B4aService} from '../b4a.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user:User;

  constructor(private b4aService : B4aService,private router:Router) { }

  ngOnInit() {
    let currrentUser = this.b4aService.currentUser;
    if(currrentUser){
      this.router.navigateByUrl('/');
    }
    this.user={
      email:'',
      pass:''
      
    }
  }

  signUp(){
    this.b4aService.signUp(this.user)
    .then(
      (user:any)=>{
        console.log(`user ${user.get('username')} created`);
        let currentUser = this.b4aService.currentUser;
        if(currentUser){
          console.log('logged in');
        }
        this.router.navigateByUrl('/');
      }
    )
    .catch(
      (err)=>{
        console.log(`Error ${err.message}`);
      }
    )
  }
}

