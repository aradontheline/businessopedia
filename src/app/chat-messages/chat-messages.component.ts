import { Component, OnInit,AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { B4aService } from '../b4a.service';
import { Message } from '../model';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css']
})
export class ChatMessagesComponent implements OnInit,AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  memberId:string="";
  member;
  messages:object[]=[];
  currentUser;  
  newMessage:string="";
  message:Message;
  chat:object;

  constructor(private route:ActivatedRoute, private b4aService:B4aService,private router:Router) { }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }                 
  }

  async ngOnInit() {
    this.memberId = this.route.snapshot.paramMap.get('id');
    this.member = await this.b4aService.findUser(this.memberId);
    this.currentUser = this.b4aService.currentUser;
    if(!this.currentUser){
      this.router.navigateByUrl('login');    
    }
    this.scrollToBottom();
    this.fetchChat();
    this.fetchMessages();
    this.b4aService.fetchNewMessage(this.member).subscribe((message:any)=>{
      let owner = (this.currentUser.id === message.get("sender").id)?true:false;
      let newMessage = {
        id:message.id,
        owner:owner,
        message:message.get("message"),
        sender:message.get("sender"),
        receiver:message.get("receiver"),
        createdAt:message.createdAt
      }
      this.messages.push(newMessage);
    });
    
  }

  fetchMessages(){
    this.b4aService.fetchMessages(this.memberId).then(async (messages:any)=>{
      this.messages = await messages.map((message:any)=>{
        let owner = (this.currentUser.id === message.get("sender").id)?true:false;
        return {
          id:message.id,
          owner:owner,
          message:message.get("message"),
          sender:message.get("sender"),
          receiver:message.get("receiver"),
          createdAt:message.createdAt
        }
      });
    });    
  }  
  fetchChat(){
    this.b4aService.fetctChat(this.member).then(chat=>{
      this.chat = chat;
    })
  }

  createMessage(){
    this.b4aService.createMessage(this.message);
  }

  sendMessage(){
    this.message = {
      message:this.newMessage,
      unread:true,
      sender:this.currentUser,
      receiver:this.member
    };
    this.createMessage();
    this.newMessage = '';
  }


}
