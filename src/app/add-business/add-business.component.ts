import { Component, OnInit } from '@angular/core';
import {User,Business,businessInit} from '../model';
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
  currentPosition;

  constructor(private b4aService:B4aService,private router:Router) { }

  ngOnInit() {
    let currrentUser = this.b4aService.currentUser;
    if(!currrentUser){
      this.router.navigateByUrl('login');    
    }
    this.business = businessInit;
    navigator.geolocation.getCurrentPosition((pos)=>{
      this.currentPosition = {
        lat:pos.coords.latitude,
        lng:pos.coords.longitude
      }
      //console.log('location : ',this.currentPosition);      
      this.business.contact.location.lat = this.currentPosition.lat;
      this.business.contact.location.lng = this.currentPosition.lng;
    });

  }

  addBusiness(){
    console.log('adding business: ')
    this.b4aService.createBusiness(this.business).then((b:any)=>{
      //console.log("b id: ", b.id);
      this.router.navigateByUrl('business-page/'+b.id); 
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
