import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { B4aService } from '../b4a.service';
import { Business,businessInit } from '../model';
import { MouseEvent as AGMMouseEvent } from '@agm/core';


@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.css']
})
export class EditBusinessComponent implements OnInit {

  business:Business=businessInit;
  businessOwner;
  currentUser; 
  businessId;
  uploading:boolean=false;
  pageName:string="edit-business";
  businessObject:any;
  updatePictureGallery:boolean=false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private b4aService:B4aService,
    private router:Router
  ) { }

  ngOnInit() {
    this.businessId = this.route.snapshot.paramMap.get('id');
    this.b4aService.fetchBusiness(this.businessId).then((b:any)=>{
      this.businessObject = b;
      this.business = b.get('business');
      this.businessOwner = b.get('owner').id;
    }).then(()=>{
      this.currentUser = this.b4aService.currentUser.id;
      //console.log('current user: '+this.currentUser);
      //console.log('owner: '+this.businessOwner);
      if(this.currentUser != this.businessOwner){
        this.router.navigateByUrl('business-page/'+this.businessId);
      }
    }).catch(err=>{
      console.log(err)
      this.router.navigateByUrl('not-found'); 

    });
    
  }
  saveBusiness(){
    this.b4aService.updateBusiness(this.businessId,this.business).then(b=>{
      console.log('Business saved ');
      this.router.navigateByUrl('business-page/'+this.businessId);
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

  onFilesAdded($event){
    console.log('File added: ');

    if($event.target.files && $event.target.files.length > 0) {
      let file = $event.target.files[0];
      this.uploading = true;
      this.b4aService.saveFile(this.businessObject,file).then((b:any)=>{
        this.businessObject = b;
        this.updatePictureGallery = !this.updatePictureGallery;
        this.uploading = false;
      })
    }
  }

}
