//on submit, send post request through ajax
$('form').on('submit', function(){
    //hold the url user entered in input
    var enteredURL = {url: $('urlInput').val()};
    $.ajax({
        url:'/', 
        data:enteredURL,
        type:'POST',
        success:function(data){
            
        }
    });
})