import { Component, OnInit,OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs'

import { B4aService } from '../b4a.service';
import {DataTransferService} from '../data-transfer.service';


@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit, OnDestroy {

  searchTerm:string="";

  constructor(private b4aService:B4aService,private dataTransferService:DataTransferService) { }

  ngOnInit() {
  }

  search(){
    console.log('searching for: ',this.searchTerm);
    this.dataTransferService.notifyOther({option:'call_fetchBusinessesPage',searchTerm:this.searchTerm});
  }

  ngOnDestroy(){
  }

}
