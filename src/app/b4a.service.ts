import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {Observable, from as ObservableFrom} from 'rxjs';
import {Parse} from 'parse';

@Injectable()
export class B4aService {

  Business;
  Chat;
  Message;
  client;
  currentUser;
  liveMessageSubscription;

  constructor() {
    Parse.initialize(environment.PARSE_APP_ID, environment.masterKey);
    Parse.serverURL = environment.serverURL;    
    Parse.liveQueryServerURL = environment.liveQueryServerURL;

    this.client = new Parse.LiveQueryClient({
      applicationId: environment.PARSE_APP_ID,
      serverURL: environment.liveQueryServerURL
    });

    this.client.open();
    this.currentUser = Parse.User.current();
    this.Business = new Parse.Object.extend('Business');
    this.Chat = new Parse.Object.extend('Chat');
    this.Message = new Parse.Object.extend('Message');
  }

  unsubscribeASubscription(subscription){
    if(subscription == 'liveMessageSubscription'){
      console.log('unsubscribing liveMessageSubscription...');
      this.liveMessageSubscription.unsubscribe();
    }

  }

  createMessage(myMessage){
    return  new Promise(async (resolve,reject)=>{
      //console.log('receiver: ', receiver);
      let message = new this.Message;
      //console.log('chat message: ',myChat);
      message.set('message',myMessage.message);
      message.set('sender',myMessage.sender);
      message.set('receiver',myMessage.receiver);
      message.set('unread',myMessage.unread);
      message.save();
    })
  }
  async fetchMessages(chat){
    let messageQuery = new Parse.Query(this.Message);
    let chatIds = chat.get("messages").map(message=>{
      return message.id;
    })
    messageQuery.containedIn("objectId",chatIds);
    messageQuery.include("sender");
    messageQuery.ascending("createdAt");
    const messages= await messageQuery.find()
    return ObservableFrom(messages);
  }
  fetchNewMessage(member){
    let currentUser = Parse.User.current();
    let senderQuery = new Parse.Query(this.Message);
    senderQuery.equalTo("sender",currentUser);
    senderQuery.equalTo("receiver",member);

    let receiverQuery = new Parse.Query(this.Message);
    receiverQuery.equalTo("receiver",currentUser);
    receiverQuery.equalTo("sender",member);

    let mainQuery = Parse.Query.or(senderQuery,receiverQuery);
    mainQuery.include("receiver");
    mainQuery.include("sender");
    mainQuery.find();

    const myObservable$ = new Observable((observer)=>{
      this.liveMessageSubscription = this.client.subscribe(mainQuery);
      this.liveMessageSubscription.on('open',()=>{
        console.log("subscription opened...");
      })
      this.liveMessageSubscription.on('close',()=>{
        console.log("subscription closed...");
      })
      this.liveMessageSubscription.on('create',(message)=>{
        //console.log("new message: ",message);
        observer.next(message);
      });
    });
    return myObservable$;      
  } 

  async updateMessageSeenStatus(message){
    message.set("unread",false);
    message.save();
  }

  fetchChats(user){
    console.log('finding chats...')
    return new Promise(async (resolve,reject)=>{
      let chatQuery = new Parse.Query(this.Chat)
      chatQuery.equalTo("members",user);
      chatQuery.include("members");
      resolve(chatQuery.find());
    })
  }

  fetctChat(member){
    return new Promise(async(resolve,reject)=>{
      let chatQuery = new Parse.Query(this.Chat);
      chatQuery.containedIn("members",[this.currentUser,member]);
      chatQuery.first().then(chat=>{
        //console.log("chat: ",chat)
        resolve(chat);
      })
    })
  }

  cloudCode(){
    Parse.Cloud.run("hello").then((res)=>{
      console.log(res);
    })
  }

  search(searchTerm){
    let queryBusinesses = new Parse.Query(this.Business);
    queryBusinesses.fullText('title',searchTerm)
    queryBusinesses.find().then((results)=>{
      console.log(results)
    })
  }  

  createBusiness(b){
    return new Promise((resolve,reject)=>{
      let user = Parse.User.current();
      let business = new this.Business;
      let point = new Parse.GeoPoint({latitude: b.contact.location.lat , longitude: b.contact.location.lng });
      business.set('location',point);
      business.set('business',b);
      business.set('owner',user);
      business.set('members',[user]);
      business.set('pictures',[]);
      business.set('allText','');
      business.save().then((b)=>{
        //console.log('business ' , b.get('business'))
        resolve(b);
      })
    })
  }

  fetchMyBusinesses(){
    return new Promise((resolve,reject)=>{
      let user = Parse.User.current();
      let query = new Parse.Query(this.Business);
      query.equalTo('owner',user);
      query.find().then(results=>{
        resolve(results);
      })
    })
  }

  fetchBusinesses(currentPosition,distance,searchTerm){
    return new Promise((resolve,reject)=>{
      let userGeoPoint = new Parse.GeoPoint({latitude:currentPosition.lat,longitude:currentPosition.lng})
      let query = new Parse.Query(this.Business);     
      query.withinKilometers('location',userGeoPoint,distance,false);
      if(searchTerm){
        query.fullText('allText',searchTerm);
      } 
      query.find().then(results=>{
        resolve(results);
      })
    })
  }

  fetchBusiness(id){
    return new Promise((resolve,reject)=>{
      let query = new Parse.Query(this.Business);
      query.include('pictures');
      query.get(id).then(results=>{
        resolve(results);
      }).catch(err=>{
        reject(err);
      })
    })
  }

  updateBusiness(id,business){
    return new Promise((resolve,reject)=>{
      let queryBusinesses = new Parse.Query(this.Business);
      queryBusinesses.get(id).then(b=>{
        let point = new Parse.GeoPoint({latitude: business.contact.location.lat , longitude: business.contact.location.lng });
        b.set('location',point);
        b.set('business',business);
        b.save().then((b)=>{
          resolve(b);
        })
      })
    })
  }

  removePictureFromBusiness(business,picture){
    return new Promise((resolve,reject)=>{
      business.remove('pictures',picture);
      business.save().then((r)=>{
        //console.log(r);
        resolve(r);
      });
    })
    
  }

  signUp(newUser){
    console.log("new user: ", newUser)
    return new Promise((resolve,reject)=>{
      let user = new Parse.User();
      user.set('username',newUser.email);
      user.set('email',newUser.email);
      user.set('password',newUser.pass);
      user.signUp(null).then(user=>{
        resolve(user);
      });
    });    
  }

  login(user){
    return new Promise((resolve,reject)=>{
      Parse.User.logIn(user.email,user.pass)
      .then((user)=>{
          resolve(user)
      });
    })
  }

  logout(){
    return Parse.User.logOut();
  }

  resetPass(email){
    return new Promise ((resolve,reject)=>{
      Parse.User.requestPasswordReset(email)
      .then(()=>{
          resolve();
      })
      .catch(error=>{
        reject(error);
      })
    })
  }


  findUser(id){
    return new Promise((resolve,reject)=>{
      let query = new Parse.Query(Parse.User);
      query.get(id);
      query.first().then(user=>{
        resolve(user);
      })
    })
  }

  saveFile(businessObject,file){
    return new Promise((res,rej)=>{
      let parseFile = new Parse.File(file.name,file);
      parseFile.save().then(()=>{
        console.log('File uploaded');
        businessObject.add('pictures',parseFile);
        businessObject.save().then((b)=>{
          console.log('file associated with Business: ', b.get('business').title);
          res(b);
        })        
      })
    })
  }

}
