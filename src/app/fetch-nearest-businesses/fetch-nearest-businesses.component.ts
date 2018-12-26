import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { B4aService } from '../b4a.service';
import {Business} from '../model';
import { Router } from '@angular/router';
import { DataTransferService } from '../data-transfer.service';

@Component({
  selector: 'app-fetch-nearest-businesses',
  templateUrl: './fetch-nearest-businesses.component.html',
  styleUrls: ['./fetch-nearest-businesses.component.css']
})
export class FetchNearestBusinessesComponent implements OnInit, OnDestroy{

  private subscription:Subscription;
  businesses:Business[];
  currentPosition ={
    lat:0,
    lng:0
  };
  distance:number=50;
  myLocationIconUrl:string="assets/myLocation.png";
  searchTerm:string=undefined;

  constructor(private b4aService:B4aService,private router:Router,private dataTransferService:DataTransferService) { }

  ngOnInit() {    
    navigator.geolocation.getCurrentPosition((pos)=>{
      this.currentPosition = {
        lat:pos.coords.latitude,
        lng:pos.coords.longitude
      }
      console.log('location : ',this.currentPosition);
      this.fetchBusinesses();
    })

    this.subscription = this.dataTransferService.notifyObservable$.subscribe((res)=>{
      if (res.hasOwnProperty('option')) {
        console.log(res.searchTerm);
        // perform your other action from here
        this.searchTerm = res.searchTerm;
        this.fetchBusinesses();
      }
    })
  } 

  markerDragEnded($event){
    console.log('Marker Drag Ended.\n',$event.coords);
    this.currentPosition = $event.coords;
    this.fetchBusinesses();
  }

  randomColor(){
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    let nr = (255 - r).toString(16);
    let ng = (255 - g).toString(16);
    let nb = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + this.padZero(nr) + this.padZero(ng) + this.padZero(nb);
  }
  padZero(str) {
    let len = 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  colors(){
    let myColor = this.randomColor();

    return [myColor,this.invertColor(myColor,true)]
  }

  goToBusiness(id){
    this.router.navigateByUrl('business-page/'+id);
  }

  distanceChanged(){
    console.log('Distance updated: ', this.distance);
    this.fetchBusinesses();
  }

  fetchBusinesses(){
    this.b4aService.fetchBusinesses(this.currentPosition,this.distance/10,this.searchTerm).then((r:any)=>{
      this.businesses= r.map(item=>{
        return {
          id:item.id,
          business:item.get('business')
        }
      })
      //console.log(this.businesses);
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
