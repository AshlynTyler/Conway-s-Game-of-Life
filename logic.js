

//Cell constructor

function Cell(x,y){
    this.x = x;

    this.y = y;

    this.alive = false;

    this.marked = false;

    //checks to see if cell should be alive or dead next generation based on the cells around it and marks them accordingly.
    this.check = function(){
        var cellCount = 0;

        for(i = -1; i < 2; i++){
            for(j = -1; j < 2; j++){
                if(cells[this.x + i][this.x + j] !== undefined){
                    if(cells[this.x + i][this.y + j] !== this && cells[this.x + i][this.x + j].alive === true)
                        cellCount++
                }
            }
        }

        if((cellCount < 2 || cellCount > 3) && this.alive === true)
            this.marked = true;

        if(cellCount === 3 && this.alive === false)
            this.marked = true;
    }

    //Checks to see if a cell is marked and then switches its state and unmarks it if it is.
    this.update = function(){
        if(this.marked === true){
            if(this.alive === true)
                this.alive === false
            else
                this.alive === true

            this.marked === false;
        }
    }
}

var cells = [];

var boardWidth = 100;

var boardHeight = 100;

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

draw.translate(.5,.5);

drawGrid.translate(canvasWidth/2 + .5,canvasHeight/2 + .5);

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
        -canvasWidth/2 * scale,
        - canvasHeight/2 * scale,
        canvasWidth * scale,
        canvasHeight * scale)

    drawGrid.lineWidth = 1

    drawGrid.strokeStyle = "#113322";

    drawGrid.beginPath();

    for(i = -canvasWidth/2; i <= canvasWidth/2; i += cellSize){
        drawGrid.moveTo(i, -canvasHeight/2);

        drawGrid.lineTo(i, canvasHeight/2);
    }

    for(i = -canvasHeight/2; i <= canvasHeight/2; i += cellSize){
        drawGrid.moveTo(-canvasWidth/2, i)

        drawGrid.lineTo(canvasWidth/2, i)
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
            thisCell = cells[j][i]

            if(thisCell.alive === true){
                draw.fillRect(
                    (thisCell.x- boardWidth/2) * cellSize,
                    (thisCell.y- boardHeight/2) * cellSize,
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

canvasOverlay.addEventListener("click", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    
    var selectx = Math.floor(mousePos.x/cellSize + boardWidth/2)
    var selecty = Math.floor(mousePos.y/cellSize + boardHeight/2)

    var selectCell = cells[selectx][selecty]

    if(selectCell.alive === false)
        selectCell.alive = true;
    else
        selectCell.alive = false;

    console.log(selectCell)

    renderBoard();
}, false);