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

  message:Message;
  chats:object[]=[];
  messages:Message[]=[];
  newMessage:string="";
  currentUser;

  constructor(private router:Router,private b4aService:B4aService) { }

  ngOnInit() {
    this.currentUser = this.b4aService.currentUser();
    if(!this.currentUser){
      this.router.navigateByUrl('login');    
    }
    this.fetchChats();
    this.b4aService.fetchNewMessage.subscribe((message:any)=>{
      //console.log('new chat ',chat);
      //let newMessage = message.get('message');
      //this.chats.push(newMessage);
    });

  }

  fetchChats(){
    this.b4aService.fetchChats(this.currentUser);
  }

  createMessage(){
    this.b4aService.createMessage(this.message);
  }

  sendMessage(){
    this.message = {
      message:this.newMessage,
      unread:true,
      sender:undefined,
      receiver:undefined
    };
    this.createMessage();
    this.newMessage = '';
  }

  goToChatMessages(i){
    console.log(this.chats[i]);
    //this.router.navigateByUrl('chat-messages');
  }



}
