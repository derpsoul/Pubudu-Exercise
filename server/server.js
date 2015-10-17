var API_KEY="a5e95177da353f58113fd60296e1d250"; 
var USER_ID="24662369@N07"; 
var PER_PAGE= 30; /*TODO: change this to be based on the initial window  area of client*/


Meteor.startup(function () {
    //initialization stuff if needed
});

Meteor.methods({
    
    fetchPics: function(page,count){
        if(!page){
            page = 0;
        }
        if(!count){
            count = PER_PAGE;
        }
        
        var additional ="&per_page="+count+"&page="+page;

        var url ="https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key="+API_KEY+"&user_id="+USER_ID+additional+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
    },
    searchPics: function(word,page){
        var additional = "&text="+word+"&per_page="+PER_PAGE+"&page="+page;
        var url ="https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+API_KEY+"&user_id="+USER_ID+additional+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
        
    },
    getDetails: function(id,secret){
        var additional= "&photo_id="+id+"&secret="+secret;
        var url ="https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+API_KEY+"&user_id="+USER_ID+additional+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
    },
    getSizes: function(id){
        var additional= "&photo_id="+id;
        var url ="https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+API_KEY+"&user_id="+USER_ID+additional+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
    }

 
  
})