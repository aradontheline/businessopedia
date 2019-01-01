import { Component, OnInit } from '@angular/core';
import { B4aService } from '../b4a.service';
import { Message,Chat ,chatInit } from '../model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-chats',
  templateUrl: './my-chats.component.html',
  styleUrls: ['./my-chats.component.css']
})
export class MyChatsComponent implements OnInit {

  chats:object[]=[];
  messages:Message[]=[];
  currentUser;

  constructor(private router:Router,private b4aService:B4aService) { }

  ngOnInit() {
    this.currentUser = this.b4aService.currentUser;
    if(!this.currentUser){
      this.router.navigateByUrl('login');    
    }
    this.fetchChats();

  }

  fetchChats(){
    this.b4aService.fetchChats(this.currentUser).then((chats:any)=>{
      this.chats = chats.map((chat:any)=>{
        //console.log("number of unread: ", chat.get("unread"));
        return {
          member:chat.get("member"),
          chatId:chat.id,
          unread:chat.get("unread"),
          total:chat.get("total")
        }
      });
      console.log(this.chats)
    })
  }

  goToChatMessages(id,index){
    //console.log(id);
    this.router.navigateByUrl('chat-messages/'+id+'?cid='+this.chats[index].chatId);
  }



}
