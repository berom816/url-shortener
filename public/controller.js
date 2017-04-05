$('form').on('submit', function(){
    
    var enteredURL = {url: $('urlInput').val()};
    $.ajax({
        url:'/', 
        data:enteredURL,
        type:'POST',
        success:function(data){
            $('#shortLink').html(data);
        }
    });
})