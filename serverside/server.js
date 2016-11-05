// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

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


var boxes = {};

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


        // socket.on('disconnect', function() {
        //     console.log("Client has disconnected " + socket.id);
        // });
    }
);
