var _ = require("underscore");

Parse.Cloud.define("hello", function(request, response){
    response.success("Hello world!");
});

Parse.Cloud.afterSave("Message",async (request,response)=>{
  let message = request.object;
  let sender = message.get("sender");
  let receiver = message.get("receiver");
 
  const queryChatWhereOwnerIsSender = new Parse.Query("Chat");
  queryChatWhereOwnerIsSender.equalTo('owner',sender);
  queryChatWhereOwnerIsSender.equalTo('member',receiver);
  let chat1 = await queryChatWhereOwnerIsSender.first();
  if(chat1){
    request.log.info('chat id ', chat1.id)
    chat1.increment('total');
    chat1.save();
  }else{
    let Chat = new Parse.Object.extend("Chat");
    let newChat = new Chat;
    newChat.set("owner",sender);
    newChat.set("member",receiver);
    newChat.set("total",1);
    newChat.set("unread",0);
    newChat.save();
  }

  const queryChatWhereOwnerIsReceiver = new Parse.Query("Chat");
  queryChatWhereOwnerIsReceiver.equalTo('owner',receiver);
  queryChatWhereOwnerIsReceiver.equalTo('member',sender);
  let chat2 = await queryChatWhereOwnerIsReceiver.first();
  if(chat2){
    let Log = new Parse.Object.extend("Log");
    let log = new Log;
    log .set("content",chat2.id );
    log.save();
    request.log.info('chat id ', chat2.id)
    chat2.increment('total');
    chat2.increment('unread');
    chat2.save();
  }else{
    let Chat = new Parse.Object.extend("Chat");
    let newChat = new Chat;
    newChat.set("owner",receiver);
    newChat.set("member",sender);
    newChat.set("total",1);
    newChat.set("unread",1);
    newChat.save();
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