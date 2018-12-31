import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';


import {Parse} from 'parse';

@Injectable()


export class B4aService {

  Business;
  Chat;
  Message;
  client;

  constructor() {
    Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY,environment.masterKey);
    Parse.serverURL = environment.serverURL;    
    Parse.liveQueryServerURL = environment.liveQueryServerURL;

    this.client = new Parse.LiveQueryClient({
      applicationId: environment.PARSE_APP_ID,
      serverURL: environment.liveQueryServerURL, // Example: 'wss://livequerytutorial.back4app.io'
      javascriptKey: environment.PARSE_JS_KEY
    });

    this.client.open();

    this.Business = new Parse.Object.extend('Business');
    this.Chat = new Parse.Object.extend('Chat');
    this.Message = new Parse.Object.extend('Message');
  }

  createMessage(myMessage){
    return  new Promise(async (resolve,reject)=>{
      let currentUser =  Parse.User.current();
      let receiverQuery = new Parse.Query(Parse.User);
      receiverQuery.get('ISs5p0BcUn');
      let receiver = await receiverQuery.first();
      console.log('receiver: ', receiver);
      let message = new this.Message;
      //console.log('chat message: ',myChat);
      message.set('message',myMessage.message);
      message.set('sender',currentUser);
      message.set('receiver',receiver);
      message.set('unread',myMessage.unread);
      message.save().then(c=>{
        // let newChat = new this.Chat;
        // newChat.set('owner',currentUser);
        // newChat.set('member',receiver);
        // newChat.set('total',1);
        // newChat.set('unread',0);
        // newChat.save();
        console.log('created message: ',c);
        resolve(c)
      })
    })
  }

  fetchMessages(){
    return new Promise(async (resolve,reject)=>{      
      let currentUser = await Parse.User.current();
      //console.log('current User: ', currentUser.id);

      let senderQuery = new Parse.Query(this.Message);
      senderQuery.equalTo("sender",currentUser);

      let receiverQuery = new Parse.Query(this.Message);
      receiverQuery.equalTo("receiver",currentUser);

      let mainQuery = Parse.Query.or(senderQuery,receiverQuery);
      mainQuery.include("receiver");
      mainQuery.include("sender");
      mainQuery.find().then(messages => {
        resolve(messages);
        console.log( 'fetched chats: ',messages)
      }).catch(error => {
        alert('Failed to retrieving objects, with error code: ' + error.message);
      });
    });    
  }
  fetchNewMessage = new Observable((observer)=>
  {
      const query = new Parse.Query(this.Message);
      query.ascending('createdAt').limit(20).find();
      const subscription = this.client.subscribe(query);
      subscription.on('create',message=>{
        observer.next(message);
      });   
  })

  fetchChats(user){
    console.log('finding chats...')
    return new Promise(async (resolve,reject)=>{
      let currentUser = await Parse.User.current();
      let chatQuery = new Parse.Query(this.Chat)
      chatQuery.equalTo("owner",user);
      chatQuery.find().then(chats=>{
        console.log(chats);
        resolve(chats);
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
      business.save().then((b)=>{
        console.log('business ' , b.get('business'))
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
    return new Promise((resolve,reject)=>{
      let user = new Parse.User();
      user.set('userbusiness',newUser.email);
      user.set('email',newUser.email);
      user.set('password',newUser.pass);
      user.set('phone',newUser.phone);
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

  currentUser(){
    return Parse.User.current();
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


  findUser(email){
    return new Promise((resolve,reject)=>{
      let query = new Parse.Query(Parse.User);
      query.equalTo('email',email);
      query.find().then(users=>{
        resolve(users);
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
