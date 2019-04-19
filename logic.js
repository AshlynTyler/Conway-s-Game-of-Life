

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

var gridWidth = 100;

var gridHeight = 100;

var cellSize = 10;

//creates or resets the cell grid.
function remakeGrid(){
    cells = [];

    for (i = 0; i <= gridWidth; i++){
        cells[i] = [];

        var row = cells[i];

        for(j = 0; j <= gridHeight; j++){
            row[j] = new Cell(i,j);
        }
    }
}

remakeGrid();

