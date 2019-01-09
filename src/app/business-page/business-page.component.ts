import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { B4aService } from '../b4a.service';
import { Business,businessInit} from '../model';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.css']
})
export class BusinessPageComponent implements OnInit {

  business:Business=businessInit;
  businessOwner;
  currentUser;
  businessId;
  images:string[]=[];
  array:number[] =[1,2,3]
  
  pageName:string="business-page";

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private b4aService:B4aService,
    private router:Router
  ) { }

  ngOnInit() {
    this.businessId = this.route.snapshot.paramMap.get('id');
    //console.log("b id from b page: ", this.businessId);
    this.b4aService.fetchBusiness(this.businessId).then((b:any)=>{
      this.business = b.get('business');
      this.businessOwner = b.get('owner').id;
      this.images=b.get('pictures').map(image=>{
        return image._url;
      });
    }).catch(err=>{
      console.log(err)
      this.router.navigateByUrl('not-found'); 

    })
    let currrentUser = this.b4aService.currentUser;
    if(currrentUser){
      this.currentUser = this.b4aService.currentUser.id;
      //console.log('businessOwner: ',this.businessOwner,' currentUser: ',this.currentUser);
    }
    
  }

  goToEditBusiness(){
    this.router.navigateByUrl('edit-business/'+this.businessId); 
  }

  sendMessage(){
    this.router.navigateByUrl('chat-messages/'+this.businessOwner); 
  }

}
