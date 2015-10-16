
var curPage = 0;

Meteor.startup(function(){
    /*initialize with empty array or blaze's #each will throw errors*/
    var x= [];
    Session.set('http_pics', x); 

});


Template.mainpage.onRendered(function () {
    Session.set('isLoaded',true);
    Session.set('searching', false);
    loadImages(1);


}); 

 
Template.mainpage.helpers({

    loaded: function(){
        return Session.get('isLoaded');
    },
    pic: function(){
        return Session.get('http_pics');
    },
    getDefaultImage: function(imgObj){ 
        var urlDefault = 'https://farm' + imgObj.farm + '.staticflickr.com/' + imgObj.server + '/' + imgObj.id + '_' + imgObj.secret + '.jpg';
        return urlDefault;
    },
    morePages: function(){
        if(curPage < Session.get('totalPages')){
            return true
        }
        
        return false
    },
    removedPages: function(){
        return Session.get('removedPages');
    },
    currentPage: function(){
        console.log(this.value);
        return Session.get('currentPage');
    },
    firstPage: function(){
        if(Session.get('currentPage') != 1){
            return true;
        }
        return false;
    },
    lastPage: function(){
        if(Session.get('currentPage') != Session.get('totalPages')){
            return true;
        }
        return false;
    },
    pager: function(){
        var current = Session.get('currentPage');
        var pagerArr =[];
        if(current<5){
            current = 1;
        }else{
            current -= 3
        }
        //TODO lower the number of pages for mobile/smaller widths
        for(i=current; i<current+7; i++){ //display 10 pages in pager
        
            if(i>Session.get('totalPages')){
                break;
            }
            pagerArr.push(i);
            
        }
        return pagerArr;
    },
    isCurrPage: function(){
        if(this == Session.get('currentPage'))
            return true;
    }
 
});

Template.mainpage.events({

    "keypress #keyword-search": function(key, template){
       
        if(key.which == 13){ //if pressed return key
            Session.set('searching', $('#keyword-search').val());
            searchImages($('#keyword-search').val());
        }
    },
    "click .pager-normal": function(){
        console.log(this);
  
            loadImages(parseInt(this));
     
    },
    "click .pager-first": function(){
        loadImages(1);
    },  
    "click .pager-last": function(){
        loadImages(parseInt(Session.get('totalPages')));
    },
    "click #load-images": function(){
        if(Session.get('searching') != false){
            Session.set('searching', false);
            loadImages(1);
        }
    }

});

/*when scrolling up restore any pages that were removed from the buffer*/
function restoreImages(){
    if(Session.get('removedPages')){
        
        Meteor.call('fetchPics',removedPages, function(err, results){
            if(Session.get('http_pics').length > 0){
                Session.set('http_pics', (results.data.photos.photo).concat(Session.get('http_pics')));
                pagesInBuffer++;
                removedPages--;
 
                if(removedPages <=0){
                    Session.set('removedPages', false);
                    removedPages=0;
                }
                
                if(pagesInBuffer >= MAX_PAGES_LOADED){
                    var imgArr = Session.get('http_pics');
                    
                    //remove half the pages from end of buffer
                    //not necessary to keep track of items removed from end
                    //since they will be loaded as user scrolls down anyway
                    for(i=0; i<(PER_PAGE*REMOVE_COUNT)-1; i++){
                        imgArr.pop();
                    }
                    Session.set('http_pics', imgArr);
                }
                
                
            }          
            
            
          
                $(window).scrollTop( 50 ); //leave small gap so user can keep scrolling up
        });
        
     
    
    }

}


/*loads all images belonging to nasa, (defined in server) */
function loadImages(page){
    if(Session.get('searching') != false){
        
        searchImages(Session.get('searching'), page);
    }else{
        //fetches json results from server in non-blocking manner with meteor call
        Meteor.call('fetchPics',page,Session.get('displayCount'), function(err, results){
            //console.log(results.data.photos);
            Session.set('totalPages', results.data.photos.pages);
            Session.set('http_pics', results.data.photos.photo);
            curPage=page;
            Session.set('currentPage',curPage);
     
        
        });
    }
}

/*searches images based on keyword*/
function searchImages(keyword,page){
    if(!page){
        page =1;
    }
    
    Meteor.call('searchPics',keyword,page, function(err, results){
        Session.set('totalPages', results.data.photos.pages);
        Session.set('http_pics', results.data.photos.photo);
        curPage=page;
        Session.set('currentPage',curPage);
    });
}



// whenever #showMorePages becomes visible, show the footer
function showMoreVisible() {
    var threshold, target = $("#showMorePages");
    if (!target.length) return;
 
    threshold = $(window).scrollTop() + $(window).height() ;

    if (target.offset().top-10 < threshold) { //gone below the showmorepages div
       
            $('#footer').css('opacity',1.00);
      
    } else {
           
            $('#footer').css('opacity',0.00);
    }
 
}
 
//check whenever users scrolls if they have reached the bottom of the page
$(window).scroll(showMoreVisible);


 