$(document).ready(function(){

    $('#search').keypress(function(e){
        var data = $(this).serializeArray();

        if(e.which == 13){
            $.ajax({
                type: 'POST',
                url: '/search',
                data: data,
                success: function(data){

                }
            });
        }
    });

});