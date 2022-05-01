const socket = io();

socket.on('second', (second) => {
    console.log('second', second);
    $('#second').text(second.second);
})