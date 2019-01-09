var _ = require("underscore");

Parse.Cloud.define("hello", function(request, response){
    response.success("Hello world!");
});

Parse.Cloud.define("changeUnreadMessages",async (request,response)=>{
  let Log = new Parse.Object.extend("Log");
  let log = new Log;
  let userId = request.params.user;
  let memberId=request.params.member;
  //let Business = new Parse.Object.extend('Business');
  //let Chat = new Parse.Object.extend('Chat');
  let Message = new Parse.Object.extend('Message');

  let userQuery = new Parse.Query(Parse.User);
  userQuery.get(userId);
  let currentUser = await userQuery.first();
  
  let memberQuery = new Parse.Query(Parse.User);
  memberQuery.get(memberId);
  let member = await memberQuery.first();
  //console.log('member: ', member);

  let senderQuery = new Parse.Query(Message);
  senderQuery.equalTo("sender",currentUser);
  senderQuery.equalTo("receiver",member);

  let receiverQuery = new Parse.Query(Message);
  receiverQuery.equalTo("receiver",currentUser);
  receiverQuery.equalTo("sender",member);

  let mainQuery = Parse.Query.or(senderQuery,receiverQuery);
  mainQuery.include("receiver");
  mainQuery.include("sender");
  mainQuery.find().then(messages => {
    let counter = 0;    
    messages.map((message)=>{      
      if(message.get("receiver").id === currentUser.id){
        if(message.get("unread")==true){
          message.set("unread",false);
          message.save()
        } 
      }           
    })    
    //log.save();
  })
  response.success("how you doin?");
})

Parse.Cloud.afterSave("Message",async (request,response)=>{
  let Log = new Parse.Object.extend("Log");
  let message = request.object;
  let sender = message.get("sender");
  let receiver = message.get("receiver");
  let status = message.get("creatingOperation");
  let chats = message.get("chats");
  let log0 = new Log;
  log0.set("content3",chats.length);
  log0.save();
  if(chats.length>0){
    let log1 = new Log;
    log1.set("content4",chats.length);
    log.save();
    message.get("chats").map((chat)=>{
      let counter = 0;
      let messages = chat.get("messages")
      messages.map((message)=>{
        if(message.get("unread")){
          counter+=1;
        }
      })
      chat.set("unread",counter);
      chat.save();
    })
  }else{
    const queryChatWhereOwnerIsSender = new Parse.Query("Chat");
    queryChatWhereOwnerIsSender.equalTo('owner',sender);
    queryChatWhereOwnerIsSender.equalTo('member',receiver);
    let chat1 = await queryChatWhereOwnerIsSender.first();
    if(chat1){
      chat1.addUnique("messages",message)
      chat1.save().then((chat)=>{
        message.addUnique("chats",chat);
        message.save();        
        chat.set("total",chat.get("messages").length);
        chat.save();
      });
    }else{
      let Chat = new Parse.Object.extend("Chat");
      let newChat = new Chat;
      newChat.set("owner",sender);
      newChat.set("member",receiver);
      newChat.set("messages",[message]);
      newChat.set("total",1);
      newChat.set("unread",0);
      newChat.save().then((chat)=>{
        message.addUnique("chats",chat);
        message.save();
      });
    }
  
    const queryChatWhereOwnerIsReceiver = new Parse.Query("Chat");
    queryChatWhereOwnerIsReceiver.equalTo('owner',receiver);
    queryChatWhereOwnerIsReceiver.equalTo('member',sender);
    let chat2 = await queryChatWhereOwnerIsReceiver.first();
    if(chat2){
      chat2.addUnique("messages",message)
      chat2.increment('unread');
      chat2.save().then((chat)=>{
        message.addUnique("chats",chat);
        message.save();
        chat.set("total",chat.get("messages").length);
        chat.save();
      });
    }else{
      let Chat = new Parse.Object.extend("Chat");
      let newChat = new Chat;
      newChat.set("owner",receiver);
      newChat.set("member",sender);
      newChat.set("messages",[message]);
      newChat.set("total",1);
      newChat.set("unread",1);
      newChat.save().then((chat)=>{
        message.addUnique("chats",chat);
        message.save();
      });
    }
    if(message.get("creatingOperation")){
      message.set("creatingOperation",false);
      message.save();
    }    
  }  
});

Parse.Cloud.afterDelete("Message",async (request,response)=>{
  let Log = new Parse.Object.extend("Log");
  let log = new Log;

  let message = request.object;
  let sender = message.get("sender");
  let receiver = message.get("receiver");

  const queryChatWhereOwnerIsSender = new Parse.Query("Chat");
  queryChatWhereOwnerIsSender.equalTo('owner',sender);
  queryChatWhereOwnerIsSender.equalTo('member',receiver);
  let chat1 = await queryChatWhereOwnerIsSender.first();
  chat1.increment("total",-1);
  chat1.save();

  const queryChatWhereOwnerIsReceiver = new Parse.Query("Chat");
  queryChatWhereOwnerIsReceiver.equalTo('owner',receiver);
  queryChatWhereOwnerIsReceiver.equalTo('member',sender);
  let chat2 = await queryChatWhereOwnerIsReceiver.first();
  chat2.increment("total",-1);
  if(message.get("unread")){
    chat2.increment("unread",-1);
  }
  chat2.save();

  let content = {
    content: "Deleting message with id",
    value:sender.id
  }
  log .set("log",content);
  log.save();
})


Parse.Cloud.beforeSave("Business", function(request, response) {
  let business = request.object;
  let toLowerCase = function(w) { return w.toLowerCase(); };
  let bioWords = business.get("business").bio.split(/\s/);
  bioWords = _.map(bioWords, toLowerCase);
  let titleWords = business.get("business").title.split(/\s/);
  titleWords = _.map(titleWords,toLowerCase);

  let bio = business.get("business").bio;
  let title = business.get("business").title;
  let allText = title+" "+bio;
//var stopWords = ["the", "in", "and"]
//   words = _.filter(words, function(w) {
//     return w.match(/^\w+$/) && !   _.contains(stopWords, w);
//   });
//var hashtags = business.get("business").bio.match(/#.+?\b/g);
//hashtags = _.map(hashtags, toLowerCase);
  business.set("bioWords", bioWords);
  business.set("titleWords",titleWords);
  business.set("title",title);
  business.set("bio",bio);
  business.set("allText",allText);
//business.set("hashtags", hashtags);
  response.success();
});