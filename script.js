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


//User inputted values
var primersUI = document.getElementById('primers');
var samplesUI = document.getElementById('samples');
var duplicatesUI = document.getElementById('duplicates');
var plateSize = document.getElementById('plateSize');
var primerButton = document.getElementById('primerStrings');

//UI Gathering
var calculate = document.getElementById('calculate');
const storage = document.getElementById("storage");

//Color Chooser
let color = '#' + Math.floor(Math.random() * 16777215).toString(16); //random color generator
let prev = -1;
let primerIteration = 0;
let colorPrimerArray = [];
let primerInputArray = [];
var result = "";

//== BUTTON ==
//adds Primer Fields to input primer names
//WIP: access primer names and use them in rest of document
primerButton.addEventListener('click', function () {
    var newP = document.createElement("div");

    //loop to attach text input fields to paragraph element created above
    for (let y = 0; y < primersUI.value; y++) {
        var textField = document.createElement("input");
        textField.type = "text";
        textField.placeholder = "Primer Name";
        primerInputArray.push(textField); //adding textFields into an array to access their values
        newP.appendChild(textField);
        newP.appendChild(document.createElement("br"));
        document.getElementById("firstDiv").appendChild(newP);
    }
    primerButton.remove();
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
function printCalculatedValues() {
    document.write(numPlatesRound + " plate(s), " +
        wellsNeeded + " wells needed, " +
        wellsPerSection + " wells per section, " +
        maxSectionsPerPlate + " section(s) per plate maximum. "
    );
    document.write("<br><br>");
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

//== BUTTON == "calculate"
calculate.addEventListener('click', function () {
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
        printCalculatedValues();

        //FIXME: VAGUE VARIABLE NAMES
        //FIXME: BREAK INTO DISTINCT FUNCTIONS    
        //
        for (x = 0; x < numPlatesRound; x++) {
            initializeTwoDimensionalArray();
            xPlus1 = x + 1;
            result += "Creating PCR Table " + xPlus1 + "<br>";

            //Loop to put elements in a table
            //FIXME: Change random color to a color palette
            result += "<table>";
            for (var l = 1; l <= rows; l++) {
                result += "<tr>";
                for (var k = 1; k <= columns; k++) {
                    let isBlack = false;
                    if (pcrPlateArray[l][k] == 0) {
                        isBlack = true;
                        //pcrPlateArray[l][k] = ""; set '0' cells as empty
                    } else if (pcrPlateArray[l][k] === 1 && prev !== 1 && prev !== -1) {
                        color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                        colorPrimerArray.push(color);
                        console.log(k + ": " + colorPrimerArray.length);
                    }
                    prev = pcrPlateArray[l][k];
                    result += "<td style = 'background-color: " + (isBlack ? "#000000" : color) + "'>" + pcrPlateArray[l][k] + "</td>";
                }
                result += "</tr>";
            }
            result += "</table>";
        }

        //writing out list of color
        //result += "<p>";
        result += "<table>";
        result += "<tr>";
        for (const c of colorPrimerArray) { //FIXME: colorPrimerArray is only storing one color at this point...
            result += "primer: <td style = 'background-color: " + c + "'>" + " HELLO! </td>"; //FIXME: replace HELLO! w/ primer name
            result += "<br>";
        }
        //result += "</p>";
        result += "</tr>";
        result += "</table>";
        document.write(result);

        //primerInputArray.foreach(element => result += element); Tried to use foreach to no avail
        //Loop to add primer names to bottom of page
        for (let primerCounter = 0; primerCounter < primerInputArray.length; primerCounter++) {
            result += primerInputArray[primerCounter].value;
            result += "<br>";
        }
        document.write(result);
    } else {
        alert("The multiple of samples and duplicates has to be less than or equal to the plate size!");
        location.reload();
    }
});