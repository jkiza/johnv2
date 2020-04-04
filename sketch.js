let molecules = [];
const numOfMolecules = 100;
let fractionOfInfected = 0.02;
const gridCols = 10;
const gridRows = 10;
let gridWidth;
let gridHeight;
let intersectCount = 0;
let radiusMin = 10;
let radiusMax = 15;
let showGrid = true;
let showLines = false;
let stopLoop = false;

let gridMolecules = [];

function setup() {
    createCanvas(1000, 1000);
    pixelDensity(1);
    background(127);

    for (let i = 0; i < numOfMolecules; i++) {
        let randomNum = random();
        if (randomNum < fractionOfInfected) {
            molecules.push(new Infected(i));
        } else {
            molecules.push(new Healthy(i));
        }
    }
    
    for (let i = 0; i < numOfMolecules * fractionOfInfected; i++) {
        molecules.push(new Infected(i));
    }
    
    gridifyBalls();

    gridWidth = width / gridCols;
    gridHeight = height / gridRows;
    smooth();
    
    if (stopLoop) {
        noLoop();
    }
}

function draw() {

    background(127);

    make2dArray();
    resetBalls();
    splitIntoGrids();

    checkIntersections();
    drawGrid();
    renderGrid();
}

function make2dArray() {
    gridMolecules = [];

    for (let j = 0; j < gridRows; j++) {
        gridMolecules.push([]);
        for (let i = 0; i < gridCols; i++) {
            gridMolecules[j].push([]);
        }
    }
}

function resetBalls() {

    for (let i = 0; i < numOfMolecules; i++) {
        molecules[i].reset();
    }
}

function gridifyBalls() {

    let iNum = Math.ceil(Math.sqrt(numOfMolecules));
    let jNum = iNum;
    let iSize = width / iNum;
    let jSize = height / jNum;

    molecules.forEach(function (molecule, index) {

        let iPos = index % iNum;
        let jPos = Math.floor(index / jNum);
        molecule.position.x = iPos * iSize + 50;
        molecule.position.y = jPos * jSize + 50;

    });
}

function splitIntoGrids() {

    molecules.forEach(function (molecule) {
        let iNum = floor(molecule.position.x / gridWidth);
        let jNum = floor(molecule.position.y / gridHeight);

        if (iNum < 0) {
            iNum = 0
        }
        if (iNum > gridCols - 1) {
            iNum = gridCols - 1
        }
        if (jNum < 0) {
            jNum = 0
        }
        if (jNum > gridRows - 1) {
            jNum = gridRows - 1
        }

        gridMolecules[jNum][iNum].push(molecule.arrayPosition);

        if (molecule.position.x % gridWidth < molecule.radius && molecule.position.x > gridWidth) {
            gridMolecules[jNum][iNum - 1].push(molecule.arrayPosition);
            molecule.left = true;
        }

        if (molecule.position.x % gridWidth > gridWidth - molecule.radius && molecule.position.x < width - gridWidth) {
            gridMolecules[jNum][iNum + 1].push(molecule.arrayPosition);
            molecule.right = true;
        }

        if (molecule.position.y % gridHeight < molecule.radius && molecule.position.y > gridHeight) {
            gridMolecules[jNum - 1][iNum].push(molecule.arrayPosition);
            molecule.top = true;
        }

        if (molecule.position.y % gridHeight > gridHeight - molecule.radius && molecule.position.y < height - gridWidth) {
            gridMolecules[jNum + 1][iNum].push(molecule.arrayPosition);
            molecule.bottom = true;
        }
        
        // NIE DZIALA

        if (molecule.top && molecule.left) {
            gridMolecules[jNum - 1][iNum - 1].push(molecule.arrayPosition);
        }

        if (molecule.top && molecule.right) {
            gridMolecules[jNum - 1][iNum + 1].push(molecule.arrayPosition);
        }

        if (molecule.bottom && molecule.left) {
            gridMolecules[jNum + 1][iNum - 1].push(molecule.arrayPosition);
        }

        if (molecule.bottom && molecule.right) {
            gridMolecules[jNum + 1][iNum + 1].push(molecule.arrayPosition);
        }
    });
}

function checkIntersections() {

    for (let j = 0; j < gridRows; j++) {
        for (let i = 0; i < gridCols; i++) {
            let tempArray = gridMolecules[j][i];
            let numInArray = tempArray.length
            if (numInArray > 1) {
                for (let z = 0; z < numInArray; z++) {
                    for (let w = z + 1; w < numInArray; w++) {
                        let indexValue01 = tempArray[z];
                        let indexValue02 = tempArray[w];
                        if (molecules[indexValue01].checkIntersecting(indexValue02)) {
                            molecules[indexValue01].checkHealth(indexValue02)
                        }
                    }
                }
            }
        }
    }
}

function drawGrid() {

    if (showGrid) {
        for (let j = 0; j < gridRows; j++) {
            for (let i = 0; i < gridCols; i++) {
                noFill();
                strokeWeight(1);
                stroke(0, 244, 0, 50);
                rect(i * gridWidth, j * gridHeight, gridWidth, gridHeight);

                let intersectCount = 0;

                let tempArray = gridMolecules[j][i];
                let numArray = tempArray.length;

                tempArray.forEach(function (indexValue) {

                    if (molecules[indexValue].intersecting == true) {
                        intersectCount++
                    }
                })

                if (numArray == 0) {
                    numArray = ""
                }

                noStroke();
                fill(255, 255, 255, 255);
                textSize(16);
                textAlign(RIGHT);
                text(numArray, i * gridWidth + gridWidth - 5, j * gridHeight + 20);

                fill(255, 50, 0, 150);
                text(intersectCount, i * gridWidth + gridWidth - 5, j * gridHeight + gridHeight - 5);

            }
        }
    }
}

function renderGrid() {

    molecules.forEach(function (molecule) {
        molecule.step();
        molecule.checkEdges();

        molecule.render();

    });
}
