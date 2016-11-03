function init(){
    console.log("HELLO TO QUITE A COOL SITE");



    dim = getGameDims();
    console.log("dim['w']", dim["w"]);
    console.log("dim['h']", dim["h"]);

    console.log("dim['w']/13", dim["w"]/13);
    console.log('dim["h"]/13', dim["h"]/13);

    console.log("Math.round(dim['w']/13)", Math.floor(dim["w"]/13) );
    console.log('Math.round(dim["h"]/13)', Math.floor(dim["h"]/13) );

    var w = dim["w"];
    var h = dim["h"];
    var mainWrapper = document.createElement("div");
    mainWrapper.style.width = w+"px";
    mainWrapper.style.height = h+"px";
    // mainWrapper.style.backgroundColor = "grey";
    mainWrapper.id = "mainWrapper";
    document.body.appendChild(mainWrapper);


    var c = Math.floor(dim["w"]/13);
    var r = Math.floor(dim["h"]/13);

    for(var row = 0; row < r; row++){
        for(var column = 0; column < c; column++){
            var newline = 0;
            if(column == 0) newline = 1;
            makeBox("row"+String(row)+"column"+String(column), newline);
        }
    }

    //secret ID's created on server, or let's jsut say only one at a time.
}

function makeBox(tag, newline){
    if(newline) document.body.appendChild(document.createElement("br"));
    var wrapper = document.createElement("div");
    wrapper.style.width = "13px";
    wrapper.style.height = "13px";
    wrapper.style.display = "inline-block";
    wrapper.style.textAlign = "center";
    wrapper.style.position = "relative";
    wrapper.id = tag;

    var box = document.createElement("input");
    box.type = "checkbox"
    box.style.margin = "0px";
    box.style.position = "absolute";
    box.style.top = "0px";
    box.style.left = "0px";
    box.style.width = "12px";
    box.style.width = "12px";
    box.addEventListener("change", function(){
        console.log(tag)
    });

    wrapper.appendChild(box);
    document.getElementById("mainWrapper").appendChild(wrapper);
}

function getGameDims(){
    console.log("Math.max(document.documentElement.clientWidth, window.innerWidth || 0)", Math.max(document.documentElement.clientWidth, window.innerWidth || 0))
    console.log("Math.max(document.documentElement.clientHeight, window.innerHeight || 0)", Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    console.log("window.innerWidth", window.innerWidth);
    console.log("window.innerHeight", window.innerHeight);
    return {"w":window.innerWidth, "h":window.innerHeight}
}

window.addEventListener("load", init);
