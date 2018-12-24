import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {B4aService } from '../b4a.service'

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

  email:string = '';
  emailNotFound=false;
  emailsent=false;

  constructor(private b4aService: B4aService) { }

  ngOnInit() {
  }

  sendEmail(){    
    this.b4aService.resetPass(this.email)
      .then(()=>{
        console.log('Reset email was send');
        this.emailNotFound = false;
        this.emailsent = true;
      })
      .catch((error)=>{
        console.log('Error '+ error.message);
        this.emailNotFound = true;
      })
  }

}
