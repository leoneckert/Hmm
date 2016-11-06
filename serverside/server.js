// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(4444);

function requestHandler(req, res) {

    var parsedUrl = url.parse(req.url).pathname;
    console.log("The Request is: " + parsedUrl);
    if(parsedUrl === "/") parsedUrl = "/index.html";
    console.log("The Request is: " + parsedUrl);
    console.log(__dirname + "/.." + parsedUrl);

    fs.readFile(__dirname + "/.." + parsedUrl,
        // Callback function for reading
        function (err, data) {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + parsedUrl.pathname);
            }
            // Otherwise, send the data, the contents of the file
            res.writeHead(200);
            res.end(data);
        }
    );


    // res.writeHead(200);
    // res.end("Life is wonderful");
}


// from here: http://stackoverflow.com/a/105074
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var boxes = {};
var active = {};

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {

        console.log("We have a new client: " + socket.id);
        // socket.send('boxdata', boxes);
        io.to(socket.id).emit('boxdata', boxes);
        active[socket.id] = String(guid());
        io.to(socket.id).emit('yourPeerID', active[socket.id]);


        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('iCheckedABox', function(data) {
            // Data comes in as whatever was sent, including objects
            console.log("someone checked a box:" + data);
            console.log("id", data["id"]);
            console.log("value", data["value"]);
            var id = data["id"];
            var value = data["value"];
            boxes[id] = value;
            console.log(boxes);


            // Send it to all of the clients
            socket.broadcast.emit('boxdata', boxes);
            // io.sockets.emit('boxdata', boxes);
        });

        function sendActiveTo(socketID, callback){
            allSocketIDs = Object.keys(active);
            idsToSend = [];
            for(var i = 0; i < allSocketIDs.length; i++){
                if(allSocketIDs[i] != socketID){
                    idsToSend.push(active[allSocketIDs[i]]);
                }
            }
            callback(idsToSend);
        }

        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('readyToCall', function() {
            console.log(active[socket.id], "ready to call");
            sendActiveTo(socket.id, function(numbersToCall){
                io.to(socket.id).emit('callThose', numbersToCall);
            });
        });


        socket.on('disconnect', function() {
            console.log("Client has disconnected " + socket.id);
            console.log(active);

            socket.broadcast.emit('deleteThisCursor', active[socket.id]);

            delete active[socket.id];
            console.log(active);



        });
    }
);
