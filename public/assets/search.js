$(document).ready(function(){

    $('#search').keypress(function(e){
        var data = $(this).serializeArray();
        console.log(data);
        if(e.which == 13){
            $.ajax({
                type: 'POST',
                url: '/search',
                data: data,
                success: function(data){
              
                },
                error: function(error){
                    e.preventDefault();
                    var element =$('#notFound');
                    alert(error);
                    e.preventDefault();
                    function AlertSave() {
                        
                      element.addClass('notFound');
                        setTimeout(function () {
                            element.removeClass('notFound');
                            location.reload();
                    }
                    , 1500);
                    }
                    AlertSave();
                }
            });
        }
    });

});