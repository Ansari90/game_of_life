var cellArray;
var dataObject;

self.onmessage = function (event) {
    dataObject = event.data;
    if (dataObject.cellArrayPresent == 1)
        cellArray = dataObject.cellArray;

    for (var i = 0; i < 100000; i++) {
        for (var j = 0; j < 100000; j++) {      //a combined wait of 1 x 10^8 CPU cycles for my system (2.0 Ghz Core 2 Duo, Intel)
            for (var k = 0; k < 1000; k++) { 
                //
            } 
        }
        if (dataObject.newCanvas == 1) {
            setupGrid();
            calculateInitialSeed();
            dataObject.newCanvas = 0;
        }
        else {
            spawnNextGeneration();
        }

        self.postMessage(cellArray);
    }
};

function setupGrid() {
    var gridEdge = dataObject.gridEdge;
    cellArray = new Array();

    for (var i = 0; i < (gridEdge * gridEdge); i++) {
        cellArray[i] = "dead";
    }
}

function calculateInitialSeed(l) {
    var startingPoint = Math.floor(Math.random() * cellArray.length);
    cellArray[startingPoint] = "alive";

    var cellPoints = new Array();
    cellPoints[0] = startingPoint;

    var edge = Math.sqrt(cellArray.length), operation, random, randomPoint, i = 1;
    while (i < dataObject.liveCells) {
        random = Math.floor(Math.random() * dataObject.cellSpread);
        operation = Math.floor(Math.random() * 7);

        switch (operation) {
            case 1:
                randomPoint = startingPoint + random;
                break;
            case 2:
                randomPoint = startingPoint - random;
                break;
            case 3:
                randomPoint = startingPoint + edge + random;
                break;
            case 4:
                randomPoint = startingPoint + edge - random;
                break;
            case 5:
                randomPoint = startingPoint - edge + random;
                break;
            case 6:
                randomPoint = startingPoint - edge - random;
                break;
            default:
                //0 returned
        }

        if (randomPoint >= 0 && randomPoint < cellArray.length) {
            if (cellPoints.indexOf(randomPoint) == -1) {
                i++;
                cellArray[randomPoint] = "alive";
                startingPoint = randomPoint;
                cellPoints[i - 1] = randomPoint;    //because i starts from 1 (1 cell has already been placed)
            }
        }
    }
}

function spawnNextGeneration() {
    var emergingGeneration = new Array();
    var tempCellCounter, neighborCounter;
    var edge = Math.sqrt(cellArray.length);

    for (var cellCounter = 0; cellCounter < cellArray.length; cellCounter++) {
        neighborCounter = 0;
        
        //middle cells
        tempCellCounter = cellCounter - 1;
        neighborCounter += neighborAlive(tempCellCounter);
        
        tempCellCounter = cellCounter + 1;
        neighborCounter += neighborAlive(tempCellCounter);

        //top cells
        tempCellCounter = cellCounter - edge;
        neighborCounter += neighborAlive(tempCellCounter);

        tempCellCounter = cellCounter - edge - 1;
        neighborCounter += neighborAlive(tempCellCounter);

        tempCellCounter = cellCounter - edge + 1;
        neighborCounter += neighborAlive(tempCellCounter);

        //bottom cells
        tempCellCounter = cellCounter + edge;
        neighborCounter += neighborAlive(tempCellCounter);

        tempCellCounter = cellCounter + edge - 1;
        neighborCounter += neighborAlive(tempCellCounter);

        tempCellCounter = cellCounter + edge + 1;
        neighborCounter += neighborAlive(tempCellCounter);

        if (neighborCounter < dataObject.lonelyDeath) {
            emergingGeneration[cellCounter] = "dead";
        } 
        else {
            if ((neighborCounter >= dataObject.minLive) && (neighborCounter <= dataObject.maxLive) && (cellArray[cellCounter] == "alive")) {
                emergingGeneration[cellCounter] = "alive";
            }
            else {
                if ((neighborCounter == dataObject.rezParam) && (cellArray[cellCounter] == "dead")) {
                        emergingGeneration[cellCounter] = "alive";
                } 
                else {
                    if (neighborCounter > dataObject.crowdedDeath)
                        emergingGeneration[cellCounter] = "dead";
                    else {
                        emergingGeneration[cellCounter] = cellArray[cellCounter];
                    }
                }
            }
        }
    }

    cellArray = emergingGeneration;
}

function neighborAlive(cellNumber) {
    var tempVar = validCellNumber(cellNumber);
    if (tempVar == 1) {
        if (cellArray[cellNumber] == "alive")
            return 1;
        else
            return 0;
    }
    else
        return 0;
}

function validCellNumber(number) {
    if (number >= 0 && number < cellArray.length)
        return 1;
    else
        return 0;
}