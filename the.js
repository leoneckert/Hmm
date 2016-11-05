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












    });
}


window.addEventListener("load", init);
