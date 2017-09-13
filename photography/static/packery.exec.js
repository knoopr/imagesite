//have to exec twice for some bug not sure why
imagesLoaded('.grid',function(){
    var pckry = new Packery('.grid', {
        // options
        itemSelector: '.grid-item',
        gutter:0,
        transitionDuration: 0,
        initLayout: true
    });

});