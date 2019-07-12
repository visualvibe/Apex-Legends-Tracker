//Make connection
var socket = io.connect('http://localhost:3000');
window.onload=function(){
    //Query DOM
    var playerName = document.getElementById('playerName');

    //Emit event
    playerName.addEventListener('keypress', (e)=>{
        if(e.which === 13){
            socket.emit('Data', {
                message: playerName.value
            });
        }
    });

    //Listen for events
    socket.on('Data', (data)=>{
        document.getElementsByClassName('stats')[0].style.visibility = 'visible';
        console.log("hello "  + data.data.metadata.platformUserId);
    });
}