var tileEdge = 10; //each live tile should be 5 pixels across
var worker, workerReady = 0;
var genNumber = 0;
var dataObject = new Object();
var cellArray;

//changing simulation meta setting results in a new simulation
var currentMeta = new Object();
currentMeta.gridEdge = -1;
currentMeta.liveCells = -1;
currentMeta.cellSpread = -1;

//verifies if the entered data is valid
function verifyInput() {
    dataObject.newCanvas = 0;

    var tmp1, tmp2, tmp3;
    var problems = new Object;
    problems.problemNum = 0;
    problems.problemStatement = "Error! Improper Input: \n";


    //we must ensure that a new Canvas is drawn even if one of the meta parameters remains unchanged
    tmp1 = document.getElementById("gridEdge").value;
    tmp2 = document.getElementById("liveCells").value;
    tmp3 = document.getElementById("cellSpread").value;
    
    if (tmp1 < 3 || tmp1 == "" || isNaN(tmp1)) {
        problems.problemNum++;
        problems.problemStatement += "Grid too small for any meaningful simulation!\n";
    }
    else {
        if (currentMeta.gridEdge != tmp1) {
            dataObject.newCanvas = 1;
            dataObject.gridEdge = tmp1;
            dataObject.liveCells = tmp2;
            dataObject.cellSpread = tmp3;

            currentMeta.gridEdge = tmp1;
        }
    }

    if (tmp2 <= 0 || tmp2 == "" || isNaN(tmp2)) {
        problems.problemNum++;
        problems.problemStatement += "Invalid initial seed value!\n";
    }
    else {
        if (currentMeta.liveCells != tmp2) {
            dataObject.newCanvas = 1;
            dataObject.gridEdge = tmp1;
            dataObject.liveCells = tmp2;
            dataObject.cellSpread = tmp3;

            currentMeta.liveCells = tmp2;
        }
    }

    if (tmp3 <= 0 || tmp3 == "" || isNaN(tmp3)) {
        problems.problemNum++;
        problems.problemStatement += "Invalid initial seed value!\n";
    }
    else {
        if (currentMeta.liveCells != tmp2) {
            dataObject.newCanvas = 1;
            dataObject.gridEdge = tmp1;
            dataObject.liveCells = tmp2;
            dataObject.cellSpread = tmp3;

            currentMeta.liveCells = tmp3;
        }
    }

    tmp1 = document.getElementById("lonelyDeath").value;
    if (tmp1 < 0 || tmp1 > 8 || tmp1 == "" || isNaN(tmp1)) {
        problems.problemNum++;
        problems.problemStatement += "Invalid Underpopulation Parameter!\n";
    }
    else {
        dataObject.lonelyDeath = tmp1;
    }

    tmp1 = document.getElementById("minLive").value;
    tmp2 = document.getElementById("maxLive").value
    if (tmp1 < 0 || tmp2 < 0 || (tmp1 > tmp2) || tmp1 == "" || isNaN(tmp1) || tmp2 == "" || isNaN(tmp2)) {
        problems.problemNum++;
        problems.problemStatement += "Invalid No Change Parameters!\n";
    }
    else {
        dataObject.minLive = tmp1;
        dataObject.maxLive = tmp2;
    }

    tmp1 = document.getElementById("crowdedDeath").value;
    if (tmp1 < 0 || tmp1 > 8 || tmp1 == "" || isNaN(tmp1)) {
        problems.problemNum++;
        problems.problemStatement += "Invalid Overpopulation Parameter!\n";
    }
    else {
        dataObject.crowdedDeath = tmp1;
    }

    tmp1 = document.getElementById("rezParam").value;
    if (tmp1 < 0 || tmp1 > 8 || tmp1 == "" || isNaN(tmp1)) {
        problems.problemNum++;
        problems.problemStatement += "Invalid Resurrection Parameter!\n";
    }
    else {
        dataObject.rezParam = tmp1;
    }

    return problems;
}

function startSimulation() {
    var problems = verifyInput();

    if (problems.problemNum > 0) {
        alert(problems.problemStatement);
    }
    else {
        if (dataObject.newCanvas == 1) {
            genNumber = 0;
        }

        if (workerReady == 0) {
            setupWorker();
            dataObject.cellArrayPresent = 0;
        }
        else {
            dataObject.cellArrayPresent = 1;
            dataObject.cellArray = cellArray;

            worker.terminate();
            setupWorker();
        }

        worker.postMessage(dataObject);
    }
}

function setupWorker() {
    worker = new Worker("GoL_Worker.js");

    worker.onmessage = function (event) {
        cellArray = event.data;
        genNumber++;
        document.getElementById("displayArea").innerHTML = "";
        document.getElementById("infoArea").innerHTML = "Generation #" + genNumber + "<br/>";

        var theCanvas = document.createElement("canvas");
        var verifiedEdge = Math.sqrt(cellArray.length);
        var theTile = document.getElementById("liveTile");

        theCanvas.setAttribute("width", (verifiedEdge * tileEdge) + tileEdge);
        theCanvas.setAttribute("height", (verifiedEdge * tileEdge) + tileEdge);
        document.getElementById("displayArea").appendChild(theCanvas);
        var ctx = theCanvas.getContext("2d");

        for (var row = 0; row < verifiedEdge; row++) {
            for (var column = 0; column < verifiedEdge; column++) {
                if (cellArray[(row * verifiedEdge) + column] == "alive") {
                    ctx.drawImage(theTile, (column * tileEdge), (row * tileEdge));
                }
            }
        }
    };
    workerReady = 1;
}

function stopSimulation() {
    currentMeta.gridEdge = -1;
    currentMeta.liveCells = -1;
    document.getElementById("displayArea").innerHTML = "";

    worker.terminate();
    workerReady = 0;
}