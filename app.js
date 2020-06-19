// simple example using kef.js

const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const KEF = require('kef-wireless-js');
let kef = new KEF({
    ip: '192.168.1.60',
    checkStateInterval:0
  });

app.listen(3000);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

//example of how to communicate with speakers. 
io.on('connection', function (socket) {
    kef.checkState();
    socket.emit('state', kef.toJSON())

    socket.on('power:on', function(data){
        kef.turnOnOrSwitchSource('AUX')
    })
    
    socket.on('power:off', function(data){
        kef.turnOff();
    })
    
    socket.on('volume:up', function(data){
        kef.changeVolume(1)
    })
    
    socket.on('volume:down', function(data){
        kef.changeVolume(-1)
    })
    
    socket.on('mute:toggle', function(data){
        kef.muteToggle();
    })

    socket.on('source', function(data){
        kef.turnOnOrSwitchSource(data)
    })

    socket.on('debug', function(){
        kef.checkState();
    });

});

kef.on('state', (data)=>{
    io.emit('state', data);
});