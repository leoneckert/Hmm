function init(){
    console.log("HELLO TO QUITE A COOL SITE");


    var socket = io.connect();
    //
    socket.on('connect', function() {
        console.log("Connected");
        drawBoxes();
        socket.on('boxdata', function(data){
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
            socket.emit('iCheckedABox', {"id": id, "value": b.checked});
        }
        function someOneCheckedABox(id, value){
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
            wrapper.className = "boxWrapper";

            var box = document.createElement("input");
            box.type = "checkbox"
            box.class = "a_checkbox"
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
            var connections = {};
            var second = false;
            document.addEventListener('mousemove', function(evt){
                if(!second){
                    conIDs = Object.keys(connections)
                    for(var c = 0; c < conIDs.length; c++){
                        connections[conIDs[c]].send({x: evt.clientX, y: evt.clientY});
                    }
                    second = true;
                }else{
                    second = false;
                }

                var my_name = document.getElementById("myname");
                my_name.style.left = evt.x - 17 + "px";
                my_name.style.top = evt.y + 20 + "px";
            });

            var peer = new Peer(MyPeerID, {host: 'liveweb.itp.io', port: 9001, path: '/'});

            peer.on('open', function(id) {
			  console.log('Ready to make calls. My id', id);
              socket.emit('readyToCall');

              var my_name = document.createElement('p');
              my_name.innerHTML = String(id);
              my_name.id = "myname";

            //   my_name.style.marginTop = "0px";
            //   my_name.style.fontSize = "0.5em";
            //   my_name.style.left = "0px";
            //   my_name.style.top = "0px";
            //   my_name.style.position = "absolute";
              document.body.appendChild(my_name);
			});

            peer.on('error', function(message){
                console.log(message);
            });

            function initCursor(conn){
                if(!connections[conn.peer]){
                    connections[conn.peer] = conn;
                    var the_mouse = document.createElement('div');
                    the_mouse.className = "otherCursor";

                    var the_img = document.createElement('img');
                    the_img.src = "http://leoneckert.com/mouse2.png";
                    the_img.className = "cursorImage";

                    the_mouse.appendChild(the_img);
                    the_mouse.id = String(conn.peer) + "_mouse";
                    // the_mouse.style.left = "0px";
                    // the_mouse.style.top = "0px";
                    // the_mouse.style.marginLeft = "-10px";
                    // the_mouse.style.marginTop = "-7px";
                    // the_mouse.style.position = "absolute";
                    // the_mouse.style.pointerEvents = "none";

                    var the_name = document.createElement('p');
					the_name.innerHTML = String(conn.peer);
                    the_name.className = "otherName";

					// the_name.style.marginTop = "0px";
                    // the_name.style.fontSize = "0.5em";
                    // the_name.style.cursor = "default";
					the_mouse.appendChild(the_name);

                    document.body.appendChild(the_mouse);
                }
            }

            peer.on('connection', function(conn) {
				conn.on('open', function() {
                    initCursor(conn);
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
				var conn = peer.connect(id);

                conn.on('open', function(data) {
                    initCursor(conn);
				});
                conn.on('error', function(err) {
                    console.log(err);
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
            function remove(data) {
                delete connections[data];
                var id = String(data) + "_mouse";
                var elem = document.getElementById(id);
                elem.parentNode.removeChild(elem);
            }
            socket.on("deleteThisCursor", function(data){
                console.log(data, "delete this cursor");
                remove(data);
            });

        });



    });
}


var isChrome = !!window.chrome;
function notChrome(){
    document.body.innerHTML = "Only works on Chrome, my friend.";
    document.head.innerHTML = "";
}

if(!isChrome){
    window.addEventListener("load", notChrome);
}else{
    window.addEventListener("load", init);
}
