var _ = require("underscore");


Parse.Cloud.afterSave("Message",async (request,response)=>{ 
  if (request.user === undefined ){

    response.error('no user defined');

    return;

  } 
  let message = request.object;
  let user = request.user;
  console.log("user: ",user);
  let sender = message.get("sender");
  let receiver = message.get("receiver");
  
  const queryChat1 = new Parse.Query("Chat");
  queryChat1.equalTo('chatId',sender.id+receiver.id);
  const queryChat2 = new Parse.Query("Chat");
  queryChat2.equalTo("chatId",receiver.id+sender.id);
  let queryChat = Parse.Query.or(queryChat1,queryChat2);
  queryChat.include("messages");
  let chat = await queryChat.first();
  if(chat){
    chat.addUnique("messages",message)
    chat = await chat.save();    
    chat.set("total",chat.get("messages").length);
    let messages =  chat.get("messages");
    let noOfUnreadMessages = {
      member1:0,
      member2:0
    };
    for(message of messages){
      let messageQuery = new Parse.Query("Message");
      messageQuery.get(message.id);
      let foundMessage = await messageQuery.first();
      if(foundMessage.get("unread")){
        if(foundMessage.get("receiver").id == chat.get("members")[0].id){
          noOfUnreadMessages.member1++;
        } else {
          noOfUnreadMessages.member2++;
        }
      }
    }
    console.log("unread: " , noOfUnreadMessages);

    chat.set("noOfUnreadMember1",noOfUnreadMessages.member1);
    chat.set("noOfUnreadMember2",noOfUnreadMessages.member2);
    chat.save();
  }else{
    let Chat = Parse.Object.extend("Chat");
    let newChat = new Chat;
    newChat.set("members",[sender,receiver]);
    newChat.set("chatId",(sender.id+receiver.id))
    newChat.set("messages",[message]);
    newChat.set("noOfUnreadMember2",1);
    newChat.save().then((chat)=>{       
      chat.set("total",chat.get("messages").length);
      chat.save();
    });
  } 
});

Parse.Cloud.beforeSave("Business", function(request, response) {
  if (request.user === undefined ){

    response.error('no user defined');

    return;

  }
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
  request.object.set("bioWords", bioWords);
  request.object.set("titleWords",titleWords);
  request.object.set("title",title);
  request.object.set("bio",bio);
  request.object.set("allText",allText);
});