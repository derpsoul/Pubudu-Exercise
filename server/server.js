var API_KEY="a5e95177da353f58113fd60296e1d250"; 
var USER_ID="24662369@N07"; 


Meteor.startup(function () {
    //initialization stuff if needed
});

Meteor.methods({
    
    fetchPics: function(){
        var url ="https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key="+API_KEY+"&user_id="+USER_ID+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
    },
    searchPics: function(word){
        var additional = "&text="+word
        var url ="https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+API_KEY+"&user_id="+USER_ID+additional+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
        
    }

 
  
})