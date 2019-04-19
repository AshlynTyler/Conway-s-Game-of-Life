

//Cell constructor

function Cell(x,y){
    this.x = x;

    this.y = y;

    this.alive = false;

    this.marked = false;

    //checks to see if cell should be alive or dead next generation based on the cells around it and marks them accordingly.
    this.check = function(){
        var cellCount = 0;

        for(var i = -1; i < 2; i++){
            for(var j = -1; j < 2; j++){
                if(this.x + i >= 0 && this.y + j >=0 && this.x+i < boardWidth &&this.y + j < boardHeight){

                    if(cells[this.x + i][this.y + j] !== this && cells[this.x + i][this.y + j].alive === true){
                        cellCount++
                    }
                    
                }
            }
        }

        console.log(cellCount)
        if((cellCount < 2 || cellCount > 3) && this.alive === true){
            this.marked = true;
        }

        if(cellCount === 3 && this.alive === false){
            this.marked = true;
        }

        console.log(this.marked)
    }

    //Checks to see if a cell is marked and then switches its state and unmarks it if it is.
    this.update = function(){
        if(this.marked){
            
            
            if(this.alive === true){
                this.alive = false;
            }
            else{
                this.alive = true;
            }
            this.marked = false;
        }
    }
}

var cells = [];

var boardWidth = 80;

var boardHeight = 80;

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
        drawGrid.moveTo(i, 0);

        drawGrid.lineTo(i, canvasHeight);
    }

    for(i = 0; i <= canvasHeight; i += cellSize){
        drawGrid.moveTo(0, i)

        drawGrid.lineTo(canvasWidth, i)
    }

    drawGrid.stroke();
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

    for(i = 0; i < boardHeight; i++)
    {   
        
        draw.fillStyle = rainbow[i % rainbow.length]

        for(j = 0; j < boardWidth; j++){
            var thisCell = cells[j][i]

            if(thisCell.alive === true){
                draw.fillRect(
                    (thisCell.x) * cellSize,
                    (thisCell.y) * cellSize,
                    cellSize,
                    cellSize
                )
            }
        }
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
        
        var selectx = Math.floor(mousePos.x/cellSize)
        var selecty = Math.floor(mousePos.y/cellSize)

        var selectCell = cells[selectx][selecty]

        if(selectCell.alive === false)
            selectCell.alive = true;
        else
            selectCell.alive = false;

        console.log(selectCell)

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


    for(var k = 0; k < boardWidth; k++){
        for(var l = 0; l < boardHeight; l++){
            cells[k][l].check();
        }
    }

    for(var k = 0; k < boardWidth; k++){
        for(var l = 0; l < boardHeight; l++){
            cells[k][l].update();
        }
    }

    renderBoard();
}