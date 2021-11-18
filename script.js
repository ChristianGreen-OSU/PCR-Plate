//Declaring variables for calculation
var numPlates;
var numPlatesRound;
var wellsNeeded;
var wellsPerSection;
var maxSectionsPerPlate;

//Values for making table
var columns;
var rows;
var sampleNumber; //the number that appears in the table for pcr i.e. (1,1,2,2,3,3)
var pcrPlateArray; //Holds the sample numbers/\
var xPlus1 = 0;


//User inputted values
var primersUI = document.getElementById('primers');
var samplesUI = document.getElementById('samples');
var duplicatesUI = document.getElementById('duplicates');
var plateSize = document.getElementById('plateSize');
var primerButton = document.getElementById('primerStrings');
var sampleButton = document.getElementById('sampleStrings');

//UI Gathering
var calculate = document.getElementById('calculate');


//Color Chooser
let color = '#' + Math.floor(Math.random() * 16777215).toString(16); //random color generator
let prev = -1;
let primerIteration = 0;
let colorPrimerArray = [];
let primerInputArray = [];
let sampleInputArray = [];
var colorPaletteArray = ["#0099BC", "#00CC6A", "#8E8CD8", "#00B7C3", "#FFB900", "#0078D7", "#FF8C00", "#00B294"];

//== BUTTON ==
//adds Primer Fields to input primer names
//WIP: access primer names and use them in rest of document
primerButton.addEventListener('click', function () {
    var newD = document.createElement("div");

    //loop to attach text input fields to paragraph element created above
    for (let y = 0; y < primersUI.value; y++) {
        var textField = document.createElement("input");
        textField.type = "text";
        textField.placeholder = "Primer Name";
        primerInputArray.push(textField); //adding textFields into an array to access their values
        newD.appendChild(textField);
        newD.appendChild(document.createElement("br"));
        document.getElementById("firstDiv").appendChild(newD);
    }
    primerButton.remove();
});

//== BUTTON == 
//adds Sample Fields to input names
sampleButton.addEventListener('click', function () {
    var newD = document.createElement("div");

    //loop to attach text input fields to paragraph element created above
    for (let y = 0; y < samplesUI.value; y++) {
        var textField = document.createElement("input");
        textField.type = "text";
        textField.placeholder = "Sample Name";
        sampleInputArray.push(textField); //adding textFields into an array to access their values
        newD.appendChild(textField);
        newD.appendChild(document.createElement("br"));
        document.getElementById("secondDiv").appendChild(newD);
    }
    sampleButton.remove();
});


//== FUNCTIONS ==
//function called within calculate button function to 
//determine the dimensions of the plate after size is chosen
function detDimensions() {

    if (plateSize.value == "24") {
        columns = 8;
        rows = 3;
    } else if (plateSize.value == "48") {
        columns = 8;
        rows = 6;
    } else if (plateSize.value == "96") {
        columns = 12;
        rows = 8;
    } else if (plateSize.value == "384") {
        columns = 24;
        rows = 16;
    }
    let crArray = [columns, rows];
    return crArray;
}
//Calculates numPlates, numPlatesRound, wellsNeeded, wellsPerSection, and maxSectionsPerPlate
function calculateValues() {
    numPlates = (primersUI.value * samplesUI.value * duplicatesUI.value) / plateSize.value;
    numPlatesRound = Math.ceil(numPlates); //Rounds the number of plates needed up to the next highest int
    wellsNeeded = primersUI.value * samplesUI.value * duplicatesUI.value;
    wellsPerSection = samplesUI.value * duplicatesUI.value;
    maxSectionsPerPlate = Math.floor(plateSize.value / wellsPerSection);
}
//Prints values calculated above at the top of 2nd page 
function printCalculatedValues(calcValuesDiv) {

    let calcValuesPar = document.createElement("P");
    calcValuesPar.textContent = (numPlatesRound + " plate(s), " +
        wellsNeeded + " wells needed, " +
        wellsPerSection + " wells per section, " +
        maxSectionsPerPlate + " section(s) per plate maximum. "
    );
    calcValuesDiv.appendChild(calcValuesPar);
}
//Initializes the two dimensional array
function initializeTwoDimensionalArray() {
    sampleNumber = 1;
    pcrPlateArray = new Array(columns);

    //Loop to add array of size rows to each column
    for (var u = 0; u < pcrPlateArray.length; u++) {
        pcrPlateArray[u] = new Array(rows);
    }

    var countPCR = 0; //FIXME: Poor variable naming
    //Loop to put sampleNumbers into 2D array.
    for (var i = 1; i <= rows; i++) {
        for (var j = 1; j <= columns; j++) {
            pcrPlateArray[i][j] = sampleNumber;

            //FIXME: Likely an issue with this modulo logic for sampleNumber bug
            //Checks if current column # is evenly divisible by duplicatesUI
            if (j % duplicatesUI.value === 0) {
                sampleNumber++; //if it is evenly divisible, move on to next number
                //check if current sampleNumber is bigger than what user input for # of total samples
                if (sampleNumber > samplesUI.value) {
                    sampleNumber = 1; //if it is, reset to one
                    countPCR++;
                }

                if (countPCR >= primersUI.value || countPCR >= maxSectionsPerPlate) {
                    sampleNumber = 0;
                }

            }
        }
    }
}

function tableCreation() {
    
}

//== BUTTON == "calculate"
calculate.addEventListener('click', function () {
    let secondDiv = document.getElementById("tables");
    secondDiv.innerHTML = "";
    var calcValuesDiv = document.getElementById("Calculated Values Output");
    calcValuesDiv.innerHTML = "";
    let legendDiv = document.getElementById("legend");
    legendDiv.innerHTML = "";

    //make sure user input can fit on chosen plate size
    if ((samplesUI.value * duplicatesUI.value) <= plateSize.value) {
        //determine dimensions of tables based on chosen Plate Size
        let crArray = detDimensions();
        let columns = crArray[0];
        let rows = crArray[1];
        console.log(" columns:" + columns + " rows:" + rows + " plateSize:" + plateSize.value);
        console.log(primersUI.value + " primers, " + samplesUI.value + " samples, " + duplicatesUI.value + " duplicates");

        calculateValues();
        //1 line sentence letting you know all calculated values.
        printCalculatedValues(calcValuesDiv);

        //FIXME: VAGUE VARIABLE NAMES
        //FIXME: BREAK INTO DISTINCT FUNCTIONS    
        //Description of for loop
        for (let x = 1; x <= numPlatesRound; x++) {
            initializeTwoDimensionalArray();
            let pcrTableTag = document.createElement("p");
            pcrTableTag.textContent = "Creating PCR Table #" + x;
            secondDiv.appendChild(pcrTableTag);

            //Loop to put elements from pcrPlateArray in a table and add color to table
            //FIXME: Change random color to a color palette
            let colorPalette = 0;
            let pcrTable = document.createElement("table");
            for (let l = 1; l <= rows; l++) {
                let tr = pcrTable.insertRow();
                for (let k = 1; k <= columns; k++) {
                    let isBlack = false;
                    if (pcrPlateArray[l][k] == 0) {
                        isBlack = true;
                        //pcrPlateArray[l][k] = ""; //set '0' cells as empty
                    } else if ((pcrPlateArray[l][k] === 1 && prev !== 1 && prev !== -1) || l === 1 && k === 1) {
                        //color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                        color = colorPaletteArray[colorPalette];
                        console.log(color);
                        colorPrimerArray.push(color);
                        console.log(k + ": " + colorPrimerArray.length);
                        colorPalette++;
                    }
                    prev = pcrPlateArray[l][k];
                    let td = tr.insertCell();
                    td.style.backgroundColor = (isBlack ? "#000000" : color);
                    td.textContent = pcrPlateArray[l][k];
                }
            }
            pcrTableTag.appendChild(pcrTable);
        }

        //writing out list of color
        let legendTable = document.createElement("table");
        let legendTitle = document.createElement("p");
        legendTitle.textContent = "Primers:";
        console.log(colorPrimerArray);
        let tr = legendTable.insertRow();
        for (let w = 0; w < colorPrimerArray.length; w++) {
            let td = tr.insertCell();
            //td.style.backgroundColor = (colorPrimerArray[w]);
            td.style.backgroundColor = (colorPaletteArray[w]);
            console.log(colorPaletteArray[w]);
            td.textContent = primerInputArray[w].value;
        }
        legendDiv.appendChild(legendTitle);
        legendDiv.appendChild(legendTable);

    } else {
        alert("The multiple of samples and duplicates has to be less than or equal to the plate size!");
        location.reload();
    }
});