import { Component, OnInit } from '@angular/core';
import { B4aService } from '../b4a.service';
import {Business} from '../model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-businesses',
  templateUrl: './my-businesses.component.html',
  styleUrls: ['./my-businesses.component.css']
})
export class MyBusinessesComponent implements OnInit {

  businesses:Business[];

  constructor(private b4aService:B4aService,private router:Router) { }

  ngOnInit() {
    let currrentUser = this.b4aService.currentUser();
    if(!currrentUser){
      this.router.navigateByUrl('login');    
    }
    this.b4aService.fetchBusinesses().then((r:any)=>{
      this.businesses= r.map(item=>{
        return {
          business:item.get('business')
        }
      })
      console.log(this.businesses);
    })
  }

}
