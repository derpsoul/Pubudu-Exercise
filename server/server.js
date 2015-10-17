var API_KEY="a5e95177da353f58113fd60296e1d250";  //flickr api key
var USER_ID="24662369@N07";  //flickr user id of photos
var PER_PAGE= 50;   //images to load per page


Meteor.startup(function () {
    //initialization stuff if needed
});

Meteor.methods({
    
    /*fetches flicker images  given  the page and number of images per page*/
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
    /*request flickr to search image based on word and image count per page*/
    searchPics: function(word,count){ 
        var additional = "&text="+word+"&per_page="+PER_PAGE+"&page="+count;
        var url ="https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+API_KEY+"&user_id="+USER_ID+additional+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
        
    },
    /*request flickr to get details of an image given image id and secret*/
    getDetails: function(id,secret){
        var additional= "&photo_id="+id+"&secret="+secret;
        var url ="https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+API_KEY+"&user_id="+USER_ID+additional+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
    },
    /*request flickr to get image sizes for an image given image id*/
    getSizes: function(id){
        var additional= "&photo_id="+id;
        var url ="https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+API_KEY+"&user_id="+USER_ID+additional+"&format=json&nojsoncallback=1";
        return  Meteor.http.call('GET', url);
    }

 
  
})