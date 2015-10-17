
  
var curPage = 0; /*keep track of the current page*/
var scrollTimer = null; /*timer used in scroll event listener function*/

Meteor.startup(function(){
    /*initialize with empty array or blaze's #each will throw errors*/
    var x= [];
    Session.set('http_pics', x); 
    
    $(document).on('keyup', function (event) {
    
        if(event.keyCode ==  27){ //if escape
           Session.set('clickedImage', false); //close popup
           $('body').css('overflow', 'scroll');
        }
    }); 
    $(document).on('click', function (event) {
        if(event.target.className == "image-details" || event.target.className == "opened-container" ){
            Session.set('clickedImage', false); //close popup
            $('body').css('overflow', 'scroll');
        }
 
    });
    

    Session.set('searching', false);
    Session.set('clickedImage', false);

});


Template.mainpage.onRendered(function () {
    loadImages(1); //on initial load the first page, change this if taking page as url parameter
 
}); 

 
Template.mainpage.helpers({

    pic: function(){
        return Session.get('http_pics');
    },
    getDefaultImage: function(imgObj){ 
        if(imgObj){
            var urlDefault = 'https://farm' + imgObj.farm + '.staticflickr.com/' + imgObj.server + '/' + imgObj.id + '_' + imgObj.secret + '.jpg';
            return urlDefault;
        }
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
    },
    searchOn: function(){
        if(Session.get('searching') != false){
            return true;
        }
        
        return false;
    },
    clickedImage: function(){
        var obj = Session.get('clickedImage');
        if(obj != false){
 
            var urlDefault = 'https://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.id + '_' + obj.secret + '.jpg';
            obj.url = urlDefault;
            return obj;
 
        }
    }
});

 
Template.mainpage.events({
    "keypress #keyword-search": function(key, template){
       
        if(key.which == 13){ //if pressed return key
            Session.set('searching', $('#keyword-search').val());
            searchImages($('#keyword-search').val());
        }
    },
    "keypress #pager-jump": function(key, template){
        if(key.which == 13){ //if pressed return key
            var num = parseInt($('#pager-jump').val());
            if(!isNaN(num) && num >0 && num <= Session.get('totalPages'))
                loadImages(num);
        }
    },
    "click .pager-normal": function(){
        var num = parseInt(this)
        if(!isNaN(num) && num >0 && num <= Session.get('totalPages'))
            loadImages(num)

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
        //clear the search box
         $('#keyword-search').val("");
        
    },
    "mouseenter .img-container": function(event, template){
        $(event.currentTarget.firstElementChild.firstElementChild).addClass("show");
    },
    "mouseleave .img-container": function(event, template){
        if(event.currentTarget){
            $(event.currentTarget.firstElementChild.firstElementChild).removeClass("show")
        }
 
     },
    "mouseenter #footer": function(){
        $("#footer").css('opacity',1.00);
    },
    "click .img-container": function(){
        var img =this;
        if (img.id != null){
            Meteor.call('getDetails',img.id,img.secret, function(err, results){
            
                img.photo = results.data.photo;
                Session.set('clickedImage',img);
                $('body').css('overflow', 'hidden');
            });
            
            Meteor.call('getSizes',img.id,img.secret, function(err, results){
                var sizeArr = results.data.sizes.size
                if(sizeArr[sizeArr.length-1].label == "Original"){
                    img.original = sizeArr[sizeArr.length-1].source;
                }
                
                if(sizeArr[sizeArr.length-4].label == "Large"){
                    img.large = sizeArr[sizeArr.length-4].source;
                }
 
                Session.set('clickedImage',img);
                $('body').css('overflow', 'hidden');
            });
        }
  
   
    },
    "click .close-img": function(){
        Session.set('clickedImage', false); //close popup
        $('body').css('overflow', 'scroll');
    },
    "click .larger-img": function(){
        window.open(Session.get('clickedImage').large, Session.get('clickedImage').title)
    },
    "click .original-img": function(){
        window.open(Session.get('clickedImage').original, Session.get('clickedImage').title)
    },
    

});



/*loads all images belonging to nasa, (defined in server) */
function loadImages(page){
 
    if(Session.get('searching') != false){
        
        searchImages(Session.get('searching'), page);
    }else{
        //fetches json results from server in non-blocking manner with meteor call
        Meteor.call('fetchPics',page,Session.get('displayCount'), function(err, results){
            Session.set('totalPages', results.data.photos.pages);
            Session.set('http_pics', results.data.photos.photo);
            curPage=page;
            Session.set('currentPage',curPage);
     
        
        });
    }
    
    //move to the top of the page after loading new set of images
    $(window).scrollTop(0);
 
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
    if(scrollTimer != null){
        clearTimeout(scrollTimer);
    }
    $('#footer').css('opacity',0.00);


    var threshold, target = $("#showMorePages");
    if (!target.length) return;
 
    threshold = $(window).scrollTop() + $(window).height() ;

    if (target.offset().top-10 < threshold) { //gone below the showmorepages div
       
            $('#footer').css('opacity',1.00);
      
    } else {
        var time = 3000;
        if(!Meteor.Device.isDesktop()){
            time = 400; //show the pager sooner for mobile since they don't have
                        //hover over option so they always have to scroll to the 
                        //bottom or wait until the pager shows
        }
        scrollTimer = setTimeout(function(){
        
            $('#footer').css('opacity',1.00);
 
        }, time);
   
    }

 
}
 
//check whenever users scrolls if they have reached the bottom of the page
$(window).scroll(showMoreVisible);

 