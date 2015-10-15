
Meteor.startup(function(){
    //do stuff on client startup if needed
});


Template.mainpage.onRendered(function () {
    //todo
}); 


Template.mainpage.events({

    "keypress #keyword-search": function(key, template){
        if(key.which == 13){ //if pressed return key
            searchImages($('#keyword-search').val());
        }
    },
    "click #load-images":function(){
        loadImages();
    }

});


/*loads all images belonging to nasa, (defined in server) */
function loadImages(){
    //fetches json results from server in non-blocking manner with meteor call
    Meteor.call('fetchPics', function(err, results){
        console.log(results.data.photos);
    
    });
}

/*searches images based on keyword*/
function searchImages(keyword){
    Meteor.call('searchPics',keyword, function(err, results){
        console.log(results);
    
    });
}