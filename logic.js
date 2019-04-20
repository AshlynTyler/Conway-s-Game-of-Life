

//Cell constructor

function Cell(x,y){
    this.x = x;

    this.y = y;

    this.alive = false;

    this.marked = false;
    
    this.neighbors = [];

    this.cellCount = 0;

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

    //Checks to see if a cell is marked and then switches its state and unmarks it if it is.
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

var boardWidth = 100;

var boardHeight =100;

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

draw.translate(.5,.5);

drawGrid.translate(.5,.5);

drawOverlay.translate(.5,.5);

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

function renderGrid(){
    drawGrid.clearRect(
        0,
        0,
        canvasWidth * scale,
        canvasHeight * scale)

    drawGrid.lineWidth = 1

    drawGrid.strokeStyle = "#113322";

    drawGrid.beginPath();

    for(i = 0; i <= canvasWidth; i += cellSize){
        if(i % (5 * cellSize) === 0){
            drawGrid.strokeStyle = "#204422"
        }
        if(i % (5 * cellSize) === (1 * cellSize)){
            drawGrid.strokeStyle = "#113322";
        }

        drawGrid.moveTo(i, 0);

        drawGrid.lineTo(i, canvasHeight);
        
        drawGrid.stroke();

        drawGrid.beginPath();
    }

    for(i = 0; i <= canvasHeight; i += cellSize){
        if(i % (5 * cellSize) === 0){
            drawGrid.strokeStyle = "#204422"
        }
        if(i % (5 * cellSize) === (1 * cellSize)){
            drawGrid.strokeStyle = "#113322";
        }

        drawGrid.moveTo(0, i)

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

function renderBoard(){
    draw.clearRect(0,0,canvasWidth,canvasHeight)

    for(j = 0; j < aliveCells.length; j++)
    {   
        var thisCell = aliveCells[j]

        draw.fillStyle = rainbow[thisCell.y % rainbow.length]

        draw.fillRect(
            (thisCell.x -xoffset) * cellSize,
            (thisCell.y -yoffset) * cellSize,
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
    if(!isPlaying){
        var mousePos = getMousePos(canvas, evt);
        
        var selectx = Math.floor(mousePos.x/cellSize +xoffset)
        var selecty = Math.floor(mousePos.y/cellSize +yoffset)

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
        },timePerGen)

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