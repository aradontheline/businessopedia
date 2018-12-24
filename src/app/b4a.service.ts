import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';



import {Parse} from 'parse';

@Injectable()

export class B4aService {

  Business;

  constructor() {
    Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY,environment.masterKey);
    Parse.serverURL = environment.serverURL;
    this.Business = new Parse.Object.extend('Business')
   }

  createBusiness(b){
    return new Promise((resolve,reject)=>{
      let user = Parse.User.current();
      let business = new this.Business;
      
      business.set('business',b);
      business.set('owner',user);
      business.set('members',[user]);

      business.save().then((b)=>{
        console.log('business ' , b.get('business'))
        resolve(b);
      })
    })
  }

  fetchBusinesses(){
    return new Promise((resolve,reject)=>{
      let user = Parse.User.current();
      let query = new Parse.Query(this.Business);
      query.equalTo('owner',user);
      query.find().then(results=>{
        resolve(results);
      })
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

  saveFile(file){
    return new Promise((res,rej)=>{
      let parseFile = new Parse.File(file.business,file);
      parseFile.save().then(()=>{
        console.log('File uploaded');
        let user = Parse.User.current();
        user.set('pic',parseFile);
        user.save().then((user)=>{
          console.log('file associated with user: ', user.get('userbusiness'));
          let imgSource = user.get('pic').url();
          res(imgSource);
        })
      })
    })
  }

}