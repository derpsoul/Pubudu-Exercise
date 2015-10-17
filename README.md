#Pubudu Exercise 
##A Nasa flickr image fetcher

####Running the app:
Demo is available here: pubx.meteor.com  
(it may take awhile to start up based on last startup time)

Or download the files and navigate the project folder and type *meteor run*.

 
####Main design idea:
Use meteor http call to flickr to get the json array, then store this object
in a session variable. This way whenever the json array is modified through 
client action ( changing page, searching) it will update the DOM via the 
template helpers.



####Additional features:
- Pager: 
    Appears when mouse hovering near the bottom of the window or user when 
    user stops scrolling
- Search  
    Uses 'word' flickr api argument, works on pressing enter. This updates the
    pager to reflect the search results as well as updates a session variable to 
    indicate the user has searched so if the user clicks a page on the pager it
    will fetch pages based on the search.  
    
    Search causes the images to display image titles also.
- Image descriptions + various sizes available after clicking on an image
 
  
###Additional meteor packages:
- http (for http requests)
- iron router 

