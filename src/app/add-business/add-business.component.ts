import { Component, OnInit } from '@angular/core';
import {User,Business} from '../model';
import{ B4aService} from '../b4a.service';
import {Router} from '@angular/router';
import { MouseEvent as AGMMouseEvent } from '@agm/core';


@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {

  business:Business;
  user:User;

  constructor(private b4aService:B4aService,private router:Router) { }

  ngOnInit() {
    let currrentUser = this.b4aService.currentUser();
    if(!currrentUser){
      this.router.navigateByUrl('login');    
    }
    this.business = {
      title:"",
      bio:"",
      contact:{
        location:{
          lat:35,
          lng:52
        }
      }
    };
    this.user = {
      email:"",
      pass:""
    }
  }

  addBusiness(){
    console.log(this.business)
    this.b4aService.createBusiness(this.business).then((b:Business)=>{
      console.log(b.title)
    })
  }

  mapClicked($event: AGMMouseEvent) {
    console.log({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
    this.business.contact.location = {
      lat:$event.coords.lat,
      lng:$event.coords.lng
    };

    console.log(this.business.contact.location)
  }

}
