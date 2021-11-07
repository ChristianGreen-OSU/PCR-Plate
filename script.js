//user inputted values
var primers = document.getElementById('primers');
var samples = document.getElementById('samples');
var duplicates = document.getElementById('duplicates');
var plateSize = document.getElementById('plateSize');
//UI Gathering
var calculate = document.getElementById('calculate');
const storage = document.getElementById("storage");

let color = '#'+Math.floor(Math.random()*16777215).toString(16); //random color generator
let prev = -1;
let primerIteration = 0;

let colorPrimerMap = [];

var result = "";

//calculations\/
calculate.addEventListener('click', function () {


    console.log(plateSize.value);
    if (plateSize.value == "24") {
        var columns = 8;
        var rows = 3;
    }
    
    else if (plateSize.value == "48") {
        var columns = 8;
        var rows = 6;
    }
    
    else if (plateSize.value == "96") {
        var columns = 12;
        var rows = 8;
    }
    
    else if (plateSize.value == "384") {
        var columns = 24;
        var rows = 16;
    }
    console.log(" c:" + columns + " r:" + rows + " plateSize:" + plateSize.value);

    var numPlates = (primers.value * samples.value * duplicates.value) / plateSize.value;
    console.log(numPlates);
    var numPlatesRound = Math.ceil(numPlates);
    var wellsNeeded = primers.value * samples.value * duplicates.value;
    var wellsPerSection = samples.value * duplicates.value;
    var maxSectionsPerPlate = Math.floor(plateSize.value / wellsPerSection);
    document.write(numPlatesRound + " plate(s), " +
        wellsNeeded + " wells needed, " +
        wellsPerSection + " wells per section, " +
        maxSectionsPerPlate + " section(s) per plate maximum. "
    );
    document.write("<br><br>");

    //Create one dimensional array
    var h = 1;
    for (x = 0; x < numPlatesRound; x++) {
        var gfg = new Array(columns);
        xPlus1 = x+1;
        result += "Creating PCR Table " + xPlus1 +"<br>";

        // Loop to create 2D array using 1D array
        for (var u = 0; u < gfg.length; u++) {
            gfg[u] = new Array(rows);
        }
        var z = 1;
        var countPCR = 0;

        // Loop to initialize 2D array elements.
        for (var i = 1; i <= rows; i++) {
            for (var j = 1; j <= columns; j++) {
                gfg[i][j] = h;

                if (j % duplicates.value === 0) {
                    h++;
                    if (h > samples.value) {
                        h = 1;
                        countPCR++;
                    }

                    if (countPCR >= primers.value || countPCR >= maxSectionsPerPlate) {
                        h = 0;
                    }
                }
            }
        }
        //Loop to put elements in a table
        result += "<table border=1>";
        for (var l = 1; l <= rows; l++) {
            result += "<tr>";
            for (var k = 1; k <= columns; k++) {
                let isBlack = false;
                if (gfg[l][k] == 0) {
                    isBlack = true;
                }else if (gfg[l][k] === 1 && prev !== 1 && prev !== -1) {
                    color = '#'+Math.floor(Math.random()*16777215).toString(16);
                    colorPrimerMap.push(color);
                }
                prev = gfg[l][k];
                result += "<td style = 'background-color: "+ (isBlack ? "#000000" : color)+"'>" + gfg[l][k] + "</td>";
            }
            result += "</tr>";
        }
        result += "</table>";


        // Loop to display the elements of 2D array. 
        /*
        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 12; j++) {
                document.write(gfg[i][j] + " ");
            }
            document.write("<br>");
        }
        primers.value = primers.value - maxSectionsPerPlate; */
        h = 1;
    }

    result += "<p>";
    for (const c of colorPrimerMap) {
        result += "primer: " + c;
        result += `\n`;
    }
    result += "</p>";

    document.write(result);

});