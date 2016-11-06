function init(){
    console.log("HELLO TO QUITE A COOL SITE");


    var socket = io.connect();
    //
    socket.on('connect', function() {
        console.log("Connected");

        drawBoxes();


        socket.on('boxdata', function(data){
            console.dir(data);
            processBoxData(data);
        })

        function processBoxData(data){

            var IDs = Object.keys(data);
            for(var i = 0; i < IDs.length; i++){

                var id = IDs[i];

                someOneCheckedABox(id, data[id]);
            }
        }
        function iCheckedABox(id){

            var b = document.getElementById(id);
            console.log("iCheckedABox", id, b.checked);
            socket.emit('iCheckedABox', {"id": id, "value": b.checked});

        }

        function someOneCheckedABox(id, value){
            console.log(id,value);
            var b = document.getElementById(id);
            if(b){
                if(b.checked != value){
                    b.checked = value;
                }
            }
        }


        function makeBox(tag, newline){
            if(newline) document.getElementById("mainWrapper").appendChild(document.createElement("br"));
            var wrapper = document.createElement("div");
            wrapper.style.width = "13px";
            wrapper.style.height = "13px";
            wrapper.style.display = "inline-block";
            wrapper.style.textAlign = "center";
            wrapper.style.position = "relative";
            var box = document.createElement("input");
            box.type = "checkbox"
            box.style.margin = "0px";
            box.style.position = "absolute";
            box.style.top = "0px";
            box.style.left = "0px";
            box.style.width = "12px";
            box.style.width = "12px";
            box.id = tag;
            box.addEventListener("change", function(){
                iCheckedABox(tag)
            });
            wrapper.appendChild(box);
            document.getElementById("mainWrapper").appendChild(wrapper);
        }





        function drawBoxes(){
            var w = getGameDims()["w"];
            var h = getGameDims()["h"];
            var mainWrapper = document.createElement("div");
            mainWrapper.style.width = w+"px";
            mainWrapper.style.height = h+"px";
            mainWrapper.id = "mainWrapper";
            document.body.appendChild(mainWrapper);
            var c = Math.floor(w/13);
            var r = Math.floor(h/13);
            for(var row = 0; row < r; row++){
                for(var column = 0; column < c; column++){
                    var newline = 0;
                    if(column == 0) newline = 1;
                    makeBox("row"+String(row)+"column"+String(column), newline);
                }
            }
        }

        function getGameDims(){
            return {"w":window.innerWidth, "h":window.innerHeight}
        }


        socket.on("yourPeerID", function(MyPeerID){
            console.log(MyPeerID);
            connections = {};

            document.addEventListener('mousemove', function(evt){
                console.log("recording datatata");
                conIDs = Object.keys(connections)
                for(var c = 0; c < conIDs.length; c++){
                    connections[conIDs[c]].send({x: evt.clientX, y: evt.clientY});
                }
            });

            peer = new Peer(MyPeerID, {host: 'liveweb.itp.io', port: 9001, path: '/'});
			peer.on('open', function(id) {
			  console.log('Ready to make calls. My id', id);
              socket.emit('readyToCall');
			});
            peer.on('error', function(message){
                console.log(message);
            });

            peer.on('connection', function(conn) {
					conn.on('open', function() {
						console.log("GOT A CALL");
                        if(!connections[conn.peer]){
    						connections[conn.peer] = conn;
                            var the_mouse = document.createElement('div');
                            var the_img = document.createElement('img');
                            the_img.src = "http://leoneckert.com/mouse2.png";
                            the_img.style.width = "29px";
                            the_mouse.appendChild(the_img);
                            the_mouse.id = String(conn.peer) + "_mouse";
                            the_mouse.style.left = "0px";
                            the_mouse.style.top = "0px";
                            the_mouse.style.marginLeft = "-10px";
                            the_mouse.style.marginTop = "-7px";
                            the_mouse.style.position = "absolute";
                            document.body.appendChild(the_mouse);
    					}
					});
					conn.on('data', function(data) {
                        console.log("getting data");
						var m = document.getElementById(String(conn.peer) + "_mouse");
						m.style.left = data.x + "px";
                        m.style.top = data.y + "px";
					});
			});

            var makeConnection = function(id) {
                console.log("calling", id);
				conn = peer.connect(id);

                conn.on('open', function(data) {
                    if(!connections[conn.peer]){
						connections[conn.peer] = conn;
                        var the_mouse = document.createElement('div');
                        var the_img = document.createElement('img');
                        the_img.src = "http://leoneckert.com/mouse2.png";
                        the_img.style.width = "29px";
                        the_mouse.appendChild(the_img);
                        the_mouse.id = String(conn.peer) + "_mouse";
                        the_mouse.style.left = "0px";
                        the_mouse.style.top = "0px";
                        the_mouse.style.marginLeft = "-10px";
                        the_mouse.style.marginTop = "-7px";
                        the_mouse.style.position = "absolute";
                        document.body.appendChild(the_mouse);
					}
				});
                conn.on('data', function(data) {
                    console.log("getting data");
                    var m = document.getElementById(String(conn.peer) + "_mouse");
                    m.style.left = data.x + "px";
                    m.style.top = data.y + "px";
                });
			};

            socket.on("callThose", function(data){
                for(var i = 0; i < data.length; i++){
                    makeConnection(data[i]);
                }
            });
            function remove(id) {
                var elem = document.getElementById(id);
                return elem.parentNode.removeChild(elem);
            }
            socket.on("deleteThisCursor", function(data){
                console.log(data, "delete this cursor");
                var id = String(conn.peer) + "_mouse";
                remove(id);
            });

        });













    });
}


window.addEventListener("load", init);








//
// peer = new Peer('leon', {host: 'liveweb.itp.io', port: 9001, path: '/'});
//
// 				peer.on('open', function(id) {
// 				  console.log('My peer ID is: ' + id);
// 				  mypeerid = id;
// 				});
//
//                 peer.on('error', function(message){
//                     console.log(message);
//                 });
//
// 				peer.on('connection', function(conn) {
// 					connection = conn;
// 					connection.on('open', function() {
// 						document.getElementById('chatlog').innerHTML += "Connection Established<br>";
// 					});
//
// 					if(!connections[connection.peer]){
// 						connections[connection.peer] = connection;
// 						var the_mouse = document.createElement('div');
//
// 						var the_img = document.createElement('img');
// 						the_img.src = "http://leoneckert.com/mouse2.png";
// 						the_img.style.width = "29px";
// 						the_mouse.appendChild(the_img);
//
// 						var the_name = document.createElement('p');
// 						the_name.innerHTML = connection.peer;
// 						the_name.style.marginTop = "0px"
// 						the_mouse.appendChild(the_name);
//
// 						the_mouse.id = String(connection.peer) + "_mouse";
// 						the_mouse.style.left = "0px";
//                         the_mouse.style.top = "0px";
// 						the_mouse.style.position = "absolute";
//
//
// 						document.body.appendChild(the_mouse);
// 					}
// 					// connections.push(connection);
//
// 					connection.on('data', function(data) {
//
// 						// document.getElementById('chatlog').innerHTML += data + "<br>";
//                         // console.log(connection.peer);
// 						var m = document.getElementById(String(connection.peer) + "_mouse");
//
//                         // // document.getElementById('othermouse').style.left = data.x + "px";
//                         // // document.getElementById('othermouse').style.top = data.y + "px";
// 						m.style.left = data.x + "px";
//                         m.style.top = data.y + "px";
//
//                         // broadCastMessage(data);
// 					});
//
// 				});
