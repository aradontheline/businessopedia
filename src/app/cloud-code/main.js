var _ = require("underscore");

Parse.Cloud.define("hello", function(request, response){
    response.success("Hello world!");
});


Parse.Cloud.beforeSave("Business", function(request, response) {
  var business = request.object;
  var toLowerCase = function(w) { return w.toLowerCase(); };
  var bioWords = business.get("business").bio.split(/\s/);
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