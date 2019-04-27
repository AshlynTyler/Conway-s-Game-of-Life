

//Cell constructor

function Cell(x,y){
    this.x = x;

    this.y = y;

    this.alive = false;

    this.marked = false;
    
    this.neighbors = [];

    this.cellCount = 0;

    //Finds all adjacent cells and adds them to the neighbors array.
    this.findNeighbors = function(){
        
        for(var i = -1; i < 2; i++){
            for(var j = -1; j < 2; j++){
                if(this.x + i >= 0 && this.y + j >=0 && this.x+i < boardWidth &&this.y + j < boardHeight){

                    if(cells[this.x + i][this.y + j] !== this){
                        this.neighbors.push(cells[this.x + i][this.y + j])
                    }
                    
                }
            }
        }
    }

    this.die = function(){
        this.alive = false;

        aliveCells.splice(aliveCells.lastIndexOf(this),1)

        for(var i = 0; i < this.neighbors.length; i ++){
            this.neighbors[i].cellCount -= 1;

            this.neighbors[i].check()
        }

        this.check()
    }

    this.born = function(){
        this.alive = true;

        aliveCells.push(this)

        for(var i = 0; i < this.neighbors.length; i ++){
            this.neighbors[i].cellCount += 1;

            this.neighbors[i].check()
        }

        this.check()
    }

    this.mark = function(){
        this.marked = true;

        markedCells.push(this);
    }

    this.unmark = function(){
        this.marked = false;
        markedCells.splice(markedCells.lastIndexOf(this),1)
    }

    //checks to see if cell should be alive or dead next generation based on the cells around it and marks them accordingly.
    this.check = function(){
        if(this.marked){
            this.unmark();
        }

        if((this.cellCount < 2 || this.cellCount > 3) && this.alive === true){
            this.mark();
        }

        if(this.cellCount === 3 && this.alive === false){
            this.mark();
        }
    }

    //Revives or kills marked cells.
    this.update = function(){
            
            if(this.alive === true){
                this.die()
            }
            else{
                this.born();
            }
    }
}

var cells = [];

var aliveCells = [];

var markedCells = [];

var boardWidth = 200;

var boardHeight =200;

var xoffset = Math.floor(boardWidth /10)

var yoffset = Math.floor(boardHeight/10)

var canvasWidth = 1200;

var canvasHeight = 675;

var cellSize = 30;

var canvas = document.getElementById("game-canvas")

var canvasGrid = document.getElementById("grid-canvas")

var canvasOverlay = document.getElementById("overlay-canvas")

var draw = canvas.getContext("2d");

var drawGrid = canvasGrid.getContext("2d")

var drawOverlay = canvasOverlay.getContext("2d")

var scale = 1;

var timePerGen = 100;

var gameInterval;

var isPlaying = false;

var pixeloffx = 0;

var pixeloffy = 0;

draw.translate(.5,.5);

drawGrid.translate(.5,.5);

drawOverlay.translate(.5,.5);

function pixelOffset(){
    if(xoffset*cellSize < pixeloffx){
        pixeloffx = 0
    }
    if(yoffset*cellSize < pixeloffy){
        pixeloffy = 0
    }
    while(pixeloffx > 0){
        pixeloffx -= cellSize
        xoffset--
    }
    while(pixeloffy > 0){
        pixeloffy -= cellSize
        yoffset--
    }

    while(pixeloffx < -cellSize){
        pixeloffx += cellSize
        xoffset++
    }
    while(pixeloffy < -cellSize){
        pixeloffy += cellSize
        yoffset++
    }
}

$("#zoom-input").val(cellSize)

$("#speed-input").val(timePerGen)

//creates or resets the cell board.
function remakeBoard(){
    cells = [];

    for (i = 0; i < boardWidth; i++){
        cells[i] = [];

        var row = cells[i];

        for(j = 0; j < boardHeight; j++){
            row[j] = new Cell(i,j);
        }
    }

    for (i = 0; i < boardWidth; i++){

        for(j = 0; j < boardHeight; j++){
            cells[i][j].findNeighbors();
        }
    }

}

remakeBoard();

console.log(cells)

//renders the line grid and adds a brighter line every 5 squares.
function renderGrid(){
    drawGrid.clearRect(
        0,
        0,
        canvasWidth * scale,
        canvasHeight * scale)

    drawGrid.lineWidth = 1

    drawGrid.strokeStyle = "#113322";

    drawGrid.beginPath();

    for(var i = 0 + pixeloffx; i <= canvasWidth && i <=(cellSize*(boardWidth-xoffset))+pixeloffx; i += cellSize){
        if(((i-pixeloffx)+xoffset*cellSize) % (5 * cellSize) === 0){
            drawGrid.strokeStyle = "#204422"
        }
        if(((i-pixeloffx)+xoffset*cellSize) % (5 * cellSize) === (1 * cellSize)){
            drawGrid.strokeStyle = "#113322";
        }
        drawGrid.moveTo(i, 0);
        if(canvasHeight >= cellSize*(boardHeight-yoffset)+pixeloffy)
            drawGrid.lineTo(i, cellSize*(boardHeight-yoffset)+pixeloffy)
        else
            drawGrid.lineTo(i, canvasHeight)
        
        drawGrid.stroke();

        drawGrid.beginPath();
    }

    for(var i = 0 + pixeloffy; i <= canvasHeight && i <=(cellSize*(boardHeight-yoffset))+pixeloffy; i += cellSize){
        if(((i-pixeloffy)+yoffset*cellSize) % ((5 * cellSize)) === 0){
            drawGrid.strokeStyle = "#204422"
        }
        if(((i-pixeloffy)+yoffset*cellSize) % ((5 * cellSize)) === (1 * cellSize)){
            drawGrid.strokeStyle = "#113322";
        }

        drawGrid.moveTo(0, i)

        if(canvasWidth >= cellSize*(boardWidth-xoffset)+pixeloffx)
            drawGrid.lineTo(cellSize*(boardWidth-xoffset)+pixeloffx, i)
        else
            drawGrid.lineTo(canvasWidth, i)
        

        drawGrid.stroke();

        drawGrid.beginPath();
    }

}

renderGrid();

function renderOverlay(){
    
    drawOverlay.strokeStyle = "#337722"

    drawOverlay.strokeRect(0,0,canvasWidth - 1,canvasHeight -1)

}

renderOverlay();

//make colors for rainbow pattern.
var rainbow = ["#ff0000","#ff8800","#ffff00","#00ff00","#0088ff","#ff00ff"]

//ren
function renderBoard(){
    draw.clearRect(0,0,canvasWidth,canvasHeight)

    for(j = 0; j < aliveCells.length; j++)
    {   
        var thisCell = aliveCells[j]

        draw.fillStyle = rainbow[thisCell.y % rainbow.length]

        draw.fillRect(
            (thisCell.x -xoffset) * cellSize + pixeloffx,
            (thisCell.y -yoffset) * cellSize + pixeloffy,
            cellSize,
            cellSize
        )
    
        
    }
}

function getMousePos(can, evt) {
    var rect = can.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//click event for canvas to add and remove live cells.
canvasOverlay.addEventListener("click", function (evt) {
    if(!isPlaying && !evt.ctrlKey){
        var mousePos = getMousePos(canvas, evt);
        
        var selectx = Math.floor((mousePos.x-pixeloffx)/cellSize +xoffset)
        var selecty = Math.floor((mousePos.y-pixeloffy)/cellSize +yoffset)

        var selectCell = cells[selectx][selecty]

        if(selectCell.alive === false)
            selectCell.born();
        else
            selectCell.die();

        renderBoard();
    }
}, false);

//click event to play/pause the game.
$("#play-button").click(function(){
    if(!isPlaying){
        var button = $("#play-button")

        button.css("background","#ff0066")

        button.text("Pause")

        gameInterval = setInterval(function(){
            newGeneration();
        },$("#speed-input").val())

        isPlaying = true;
    }
    else{
        var button = $("#play-button")

        button.css("background","#66ff00")

        button.text("Play")

        clearInterval(gameInterval);

        isPlaying = false;
    }
})

//function for a new generation of cells
function newGeneration(){

    var currentMarked = markedCells.slice(0);


    for(var j = 0; j < currentMarked.length; j++){
        currentMarked[j].update();
    }

    renderBoard();
}

//Adjust the zoom level when user enters a new value.
$("#zoom-form").submit(function(event){
    event.preventDefault();

    var oldSize = cellSize;

    cellSize = parseInt($("#zoom-input").val());

    if(Number.isNaN(cellSize)){
        cellSize = oldSize
    }

    if(cellSize < 3){
        cellSize = 3
    }

    $("#zoom-input").val(cellSize)

    xoffset -= Math.round((canvasWidth/(oldSize*2))*(oldSize / cellSize -1))

    yoffset -= Math.round((canvasHeight/(oldSize*2))*(oldSize / cellSize -1))

    if(xoffset < 0)
        xoffset = 0
    if(yoffset < 0)
        yoffset = 0
    renderGrid();

    renderBoard();
})

//Zooms in or out when user holds control and uses the mouse wheel.
window.addEventListener("wheel", function(e){
    if(e.ctrlKey){
        e.preventDefault();

        let oldSize = cellSize;

        absoY = e.deltaY / Math.abs(e.deltaY)

        cellSize -= absoY

        if(cellSize < 3){
            cellSize = 3
        }

        $("#zoom-input").val(cellSize);

        pixeloffx += (oldSize/cellSize-1)*canvasWidth/2;

        pixeloffy += (oldSize/cellSize-1)*canvasHeight/2;

        pixelOffset();

        renderGrid();

        renderBoard();
    }
})

canvasOverlay.addEventListener("mousemove",(function(event){
    

    if(event.buttons % 2 === 1 && (isPlaying || event.ctrlKey))
        {
            pixeloffx += Math.round(event.movementX)

            pixeloffy += Math.round(event.movementY)

            pixelOffset();

            renderGrid();

            renderBoard();
        }
}))