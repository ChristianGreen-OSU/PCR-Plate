//Declaring variables for calculation
var numPlates;
var numPlatesRound;
var wellsNeeded;
var wellsPerSection;
var maxSectionsPerPlate;

//Values for making table
var columns;
var rows;
//var sampleNumber; //the number that appears in the table for pcr i.e. (1,1,2,2,3,3)

//stops default form refresh. Allows page to be built after hitting 'Calculate!' button
$("#userinput").submit(function(e) {
    e.preventDefault();
    console.log("jQuery success!");
});

//User inputted values
//var primersUI = $('#primers').val(); var samplesUI = $('#samples').val(); var duplicatesUI = document.getElementById('duplicates'); var plateSize = document.getElementById('plateSize'); var primerButton = document.getElementById('primerStrings');
var sampleButton = document.getElementById('sampleStrings');

//UI Gathering
var calculate = document.getElementById('calculate');

//Color Chooser
//The number 16,777,215 is the total possible combinations of RGB(255,255,255) which is 32 bit colour
let color = '#' + Math.floor(Math.random() * 16777215).toString(16); //random color generator
let prev = -1;
let colorPrimerArray = [];
let primerInputArray = [];
let sampleInputArray = [];
var colorPaletteArray = ["#0099BC", "#00CC6A", "#8E8CD8", "#00B7C3", "#FFB900", "#0078D7", "#FF8C00", "#00B294"];

//== BUTTON ==
//adds Primer Fields to input primer names
$("#primerStrings").click(function(){
    let newD = document.createElement("div");

    //loop to attach text input fields to paragraph element created above
    for (let y = 0; y < $('#primers').val(); y++) {
        let textField = document.createElement("input");
        textField.type = "text";
        textField.placeholder = "Primer Name";
        primerInputArray.push(textField); //adding textFields into an array to access their values
        newD.appendChild(textField);
        newD.appendChild(document.createElement("br"));
        document.getElementById("firstDiv").appendChild(newD);
    }
    $("#primerStrings").remove();
});

//== BUTTON == 
//adds Sample Fields to input names
//WIP: access sample names and use them in rest of document
$('#sampleStrings').click(function() {
    let newDiv = document.createElement("div");

    //loop to attach text input fields to paragraph element created above
    for (let y = 0; y < $('#samples').val(); y++) {
        let textField = document.createElement("input");
        textField.type = "text";
        textField.placeholder = "Sample Name";
        sampleInputArray.push(textField); //adding textFields into an array to access their values
        newDiv.appendChild(textField);
        newDiv.appendChild(document.createElement("br"));
        document.getElementById("secondDiv").appendChild(newDiv);
    }
    $('#sampleStrings').remove();
});


//== FUNCTIONS ==
//function called within calculate button function to 
//determine the dimensions of the plate after size is chosen
function detDimensions() {

    if ($('#plateSize').val() == "24") {
        columns = 8;
        rows = 3;
    } else if ($('#plateSize').val() == "48") {
        columns = 8;
        rows = 6;
    } else if ($('#plateSize').val() == "96") {
        columns = 12;
        rows = 8;
    } else if ($('#plateSize').val() == "384") {
        columns = 24;
        rows = 16;
    }
    let crArray = [columns, rows];
    return crArray;
}
//Calculates numPlates, numPlatesRound, wellsNeeded, wellsPerSection, and maxSectionsPerPlate
function calculateValues() {
    numPlates = ($('#primers').val() * $('#samples').val() * $('#duplicates').val()) / $('#plateSize').val();
    numPlatesRound = Math.ceil(numPlates); //Rounds the number of plates needed up to the next highest int
    wellsNeeded = $('#primers').val() * $('#samples').val() * $('#duplicates').val();
    wellsPerSection = $('#samples').val() * $('#duplicates').val();
    maxSectionsPerPlate = Math.floor($('#plateSize').val() / wellsPerSection);
}
//Prints values calculated above at the top of 2nd half of page 
function printCalculatedValues(calcValuesDiv) {

    let calcValuesPar = document.createElement("P");
    calcValuesPar.textContent = (numPlatesRound + " plate(s), " +
        wellsNeeded + " wells needed, " +
        wellsPerSection + " wells per section, " +
        maxSectionsPerPlate + " section(s) per plate maximum. "
    );
    calcValuesDiv.appendChild(calcValuesPar);
}
//Creates and fills the two dimensional array
function initialize2DArray() {
    let sampleNumber = 1;
    let pcrPlateArray = new Array(columns);

    //Loop to add array of size rows to each column
    for (let u = 0; u < pcrPlateArray.length; u++) {
        pcrPlateArray[u] = new Array(rows);
    }
    return pcrPlateArray;
}

function createPCRPlateArray() {
    let pcrPlateArray = initialize2DArray();
    let countPCR = 0;
    let duplicates = 1;
    let sampleNumber = 1;
    //Loop to put sampleNumbers into 2D array.
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= columns; c++) {
            pcrPlateArray[r][c] = sampleNumber;
            //FIXME: seems to recalculate number of duplicates by row
            //e.g. 6 duplicates; 2 on first row, move onto next row; another 6 added because it restarts (8 total)
            //Checks if current column # is evenly divisible by duplicatesUI
            function log() {
                console.log("New section");
                console.log("Sample Number: " + sampleNumber);
                console.log("c: " + c);
                console.log("$('#duplicates').val(): " + $('#duplicates').val());
                console.log("c % $('#duplicates').val(): " + c % $('#duplicates').val());
            } //log();
            console.log(duplicates);
            console.log(duplicates == $('#duplicates').val());
            if ((duplicates == $('#duplicates').val())) { 
                console.log(duplicates);
                sampleNumber++; //if it is evenly divisible, move on to next number
                duplicates = 0;
                //check if current sampleNumber is bigger than what user input for # of total samples
                if (sampleNumber > $('#samples').val()) {
                    sampleNumber = 1; //if it is, reset to one
                    countPCR++;
                }if (countPCR >= $('#primers').val() || countPCR >= maxSectionsPerPlate) {
                    sampleNumber = 0;
                }
            }
            duplicates++;   
        }
    }
    return pcrPlateArray;
}

//== BUTTON == "calculate"
$('#calculate').click(function() {
    //jQuery-ify
    let secondDiv = document.getElementById("tables");
    secondDiv.innerHTML = "";
    var calcValuesDiv = document.getElementById("Calculated Values Output");
    calcValuesDiv.innerHTML = "";
    let legendDiv = document.getElementById("legend");
    legendDiv.innerHTML = "";

    //make sure user input can fit on chosen plate size
    if (($('#samples').val() * $('#duplicates').val()) <= $('#plateSize').val()) {
        //determine dimensions of tables based on chosen Plate Size
        let crArray = detDimensions();
        let columns = crArray[0];
        let rows = crArray[1];
        console.log(" columns:" + columns + " rows:" + rows + " plateSize:" + $('#plateSize').val());
        console.log($('#primers').val() + " primers, " + $('#samples').val() + " samples, " + $('#duplicates').val() + " duplicates");

        calculateValues();
        //1 line sentence letting you know all calculated values.
        printCalculatedValues(calcValuesDiv);

        //FIXME: VAGUE VARIABLE NAMES
        //FIXME: BREAK INTO DISTINCT FUNCTIONS    
        //Description of for loop
        for (let x = 1; x <= numPlatesRound; x++) {
            //jQuery-ify
            let pcrPlateArray = createPCRPlateArray();
            let pcrTableTag = document.createElement("p");
            pcrTableTag.textContent = "Creating PCR Table #" + x;
            secondDiv.appendChild(pcrTableTag);

            //Loop to put elements from pcrPlateArray in a UX table and add color to table
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
            td.style.backgroundColor = (colorPaletteArray[w]);
            console.log(colorPaletteArray[w]);
            td.textContent = primerInputArray[w].value;
        }
        legendDiv.appendChild(legendTitle);
        legendDiv.appendChild(legendTable);

    } else {
        //Error: The number of samples times duplicates provides the number of wells required for each primer. 
        //Every plate must have at least two primers, one internal control, and one test sample. Please re-input data to match criteria.

        alert("The multiple of samples and duplicates has to be less than or equal to the plate size!");
        location.reload();
    }
});
