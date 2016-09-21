var sideCanvas;
var canvas1;
var canvas2;
var ctxS;
var ctx1;
var ctx2;

function main(){
    setUpCanvas();
}

function setUpCanvas(){
    canvas1 = document.getElementById("canvas1");
    ctx1 = canvas1.getContext("2d");
    canvas2 = document.getElementById("canvas2");
    ctx2 = canvas2.getContext("2d");
    sideCanvas = document.getElementById("sideCanvas");
    ctxS = sideCanvas.getContext("2d");
    draw();
}

function draw(){
    ctx1.fillStyle = "#000000";
    ctx1.fillRect(0,0,canvas1.width,canvas1.height);

    ctx2.fillStyle = "#000000";
    ctx2.fillRect(0,0,canvas2.width,canvas2.height);

    ctxS.fillStyle = "#777777";
    ctxS.fillRect(0,0,sideCanvas.width,sideCanvas.height);

    var cardwidth = sideCanvas.width/5;
    var cardheight = sideCanvas.height * .8;

    //ctx1.fillStyle = "#001433";
    ctx1.fillRect(0,0,sideCanvas.width,sideCanvas.height);
    ctx1.fillRect(0,0,sideCanvas.width,sideCanvas.height);
    //ctx1.fillStyle = "#003380";
    ctx1.fillRect(0,0,sideCanvas.width,sideCanvas.height);
    ctx1.fillRect(0,0,sideCanvas.width,sideCanvas.height);
    // ctx1.fillStyle = "#0066ff";
    // ctx1.fillRect(  sideCanvas.width/2 - cardwidth/2,
    //                 (sideCanvas.height - cardheight)/2,
    //                 cardwidth,
    //                 cardheight);
    drawCard(ctx1, "#001433", sideCanvas.width/2 + 2.6 * cardwidth/2, (sideCanvas.height - cardheight)/1.2, cardwidth * .8, cardheight * .8);
    drawCard(ctx1, "#001433", sideCanvas.width/2 - 1.64 * cardwidth/.8, (sideCanvas.height - cardheight)/1.2, cardwidth * .8, cardheight * .8);

    drawCard(ctx1, "#003380", sideCanvas.width/2 + cardwidth/2, (sideCanvas.height - cardheight)/1.2, cardwidth * .8, cardheight * .8);
    drawCard(ctx1, "#003380", sideCanvas.width/2 - cardwidth/.8, (sideCanvas.height - cardheight)/1.2, cardwidth * .8, cardheight * .8);

    drawCard(ctx1, "#0066ff", sideCanvas.width/2 - cardwidth/2, (sideCanvas.height - cardheight)/2, cardwidth, cardheight);

}

function drawCard(ctx, color, x, y, cw, ch){
    ctx.fillStyle = color;
    ctx.fillRect(  x,
                    y,
                    cw,
                    ch);
}

main();
setInterval(draw, 25);
