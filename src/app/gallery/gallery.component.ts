import { Component, OnInit,Input,OnChanges, SimpleChanges } from '@angular/core';
import { B4aService } from '../b4a.service';
import { Business, businessInit } from '../model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  @Input() businessId:string;
  @Input() parent:string;
  @Input() updatePictureGallery:boolean;

  business:Business=businessInit;  
  businessOwner;
  currentUser;  
  images:string[]=[];
  edit:boolean=false;
  imageObjects:any[];
  businessObject:any;

  constructor(
    private b4aService:B4aService,
    ) { }

  ngOnInit() {
    this.updateGalleryPictures();
    let currrentUser = this.b4aService.currentUser;
    if(currrentUser){
      this.currentUser = this.b4aService.currentUser.id;   
    };
    if(this.parent == "edit-business"){
      this.edit = true;
    }
  }
  removePicture(i){
    console.log('removing picture... ');
    this.b4aService.removePictureFromBusiness(this.businessObject,this.imageObjects[i]).then(()=>{
      this.updateGalleryPictures();
    })
  }

  updateGalleryPictures(){
    this.b4aService.fetchBusiness(this.businessId).then((b:any)=>{
      this.businessObject = b;
      this.business = b.get('business');
      this.businessOwner = b.get('owner').id;
      this.imageObjects = this.businessObject.get('pictures');
      this.images = this.businessObject.get('pictures').map(image=>{
        return image._url;
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['updatePictureGallery']) {
      console.log('change detected!')
      this.updateGalleryPictures()
    }
}

}
