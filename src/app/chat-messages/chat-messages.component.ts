import { Component, OnInit, OnDestroy,AfterViewChecked, ElementRef, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, from as ObservableFrom, concat,of, Subscription} from 'rxjs';
import { tap } from 'rxjs/operators';
import { B4aService } from '../b4a.service';
import { Message } from '../model';


@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css']
})
export class ChatMessagesComponent implements OnInit,AfterViewChecked,OnDestroy {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  memberId:string="";
  member;
  messages:object[]=[];
  currentUser;  
  newMessage:string="";
  message:Message;
  chat:object;
  messages$:Observable<any>;
  newMessage$:Observable<any>;
  allMessages$:Observable<any>;
  allMessagesSubscription:Subscription;
  noOfNewMessages=0;

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
    this.member = await this.b4aService.findUser(this.memberId)
    //console.log("member: ",this.member)
    if(!this.member){
      this.router.navigateByUrl('not-found');
    }
    this.currentUser = this.b4aService.currentUser;
    if(!this.currentUser){
      this.router.navigateByUrl('login');    
    }
    this.scrollToBottom();
    this.chat = await this.fetchChat();
    this.fetchMessages(); 
      
  }

  async fetchMessages(){
    this.messages$ = await this.b4aService.fetchMessages(this.chat);
    if(this.messages$){
      let newMessage$ = this.b4aService.fetchNewMessage(this.member);
      newMessage$.pipe(
        tap(()=>{          
          this.noOfNewMessages++;
        })
      ).subscribe();
      this.allMessages$ = concat(this.messages$,newMessage$);
      this.allMessagesSubscription = this.allMessages$.subscribe({
        next:(message)=>{
          let owner = (this.currentUser.id === message.get("sender").id)?true:false;
          let myMessage = {
            id:message.id,
            owner:owner,
            message:message.get("message"),
            sender:message.get("sender"),
            receiver:message.get("receiver"),
            createdAt:message.createdAt
          }
          this.messages.push(myMessage);
          if(message.get("unread") && message.get("receiver").id == this.currentUser.id){
            console.log("updating message seen status: ", message.id);
            this.b4aService.updateMessageSeenStatus(message);
          }
        },
        error:error=>{
          console.log('Error')
        }
      })
    }
  }  
  fetchChat(){
    return this.b4aService.fetctChat(this.member);
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

  ngOnDestroy(){
    //console.log('exiting ...')
    if(this.member){
      this.b4aService.unsubscribeASubscription('liveMessageSubscription');
      this.allMessagesSubscription.unsubscribe();
    }    
  }


}
