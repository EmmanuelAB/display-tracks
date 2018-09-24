var fileData = {};
var render_button, file_input;
var remainingFiles;
var date_combo;

function main(){

    // var o = {};
    // o["hoy"] = [];
    // o["hoy"].push("hola");
    // o["hoy"].push("asd");
    // o["ayer"] = [];
    // o["ayer"].push("aer");
    // o["ayer"].push("qwe");

    // console.log(o["lcas"]==null);
    // return;

    date_combo = document.querySelector("#date");
    render_button = document.querySelector("#render");
    fileInput = document.querySelector('#files');
    
    initializeMap();

    render_button.onclick = renderClicked;

    setupFileInput();

    //temp
    // renderClicked();
}

function initializeMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiZW1tYW51ZWxhYiIsImEiOiJjamt0NmxpdHcwMnFyM2t0a3Mxbjh5aDFrIn0.7CcPXhDaki4-Y97DT7DYpQ';

    //Create the map object
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [-84.19636102,10.01950755,1],
        zoom: 13
    });
}

function renderGpxTrace(traceId, coordinatesList){
    //Get the list of coordinates of the trace
    color = 'rgba(255,0,0,0.1)';
    lineWidth = 5;
    //Add the trace to the map
    map.addLayer({
        "id": traceId,
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinatesList
                }
            }
        },
        "paint": {
            "line-color": color,
            //"line-color": color,
            "line-width": lineWidth
            //"line-width": lineWidth
        }
    });
}

function addGpxFileToMap(gpxFile, id){
    //The return value will be a list of lists [lon,lat]
    var outputList = [];
    //Request the content of the gpx file
    var reader = new FileReader();
    reader.onload = function(event){
        file = event.target.result;
        //Instantiate an object to parse the xml file further
        var parser = new DOMParser();
        var doc = parser.parseFromString(file, "application/xml");

        var elems = doc.getElementsByTagName("trkpt");

        for(var i=0 ; i < elems.length ; i++){
            var lat = elems[i].getAttribute("lat");
            var lon = elems[i].getAttribute("lon");
            //The coordinates must be in this order for the map to render them correctly
            outputList.push([lon,lat]);
        }
        renderGpxTrace(""+id, outputList);
        console.debug(id +" track done");
    };
    //For not to continue until the request is done 
    reader.readAsText(gpxFile);
}

function renderClicked(){
    return;
    // Get the selected date from the combo
    var date = document.querySelector("#date").value;

    // Get all the filanames linked with the date in the JSON
    var filenames = fileData[date];

    // Iterate over the filenames and add each one to the map
    for (var i = 0 ; i < filenames.length ; i++) {
        addGpxFileToMap(filenames[i],i)
    }





    // ----------------------------------------------------
    //Get all the files within the folder named as the date
    
    // var request = new XMLHttpRequest();

    // request.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         console.log("Resp:"+this.responseText);
    //     }
    // };
    // request.open("GET", "filtered_tracks/", true);
    // request.open("GET", "all_tracks", true);
    // request.open("GET", "all_tracks/2489506.gpx", true);
    // request.send();    
    // console.log("request sent");
    // var files = document.querySelector("#files").files
    //     for(var i=0 ; i<files.length ; i++) {
    //         addGpxFileToMap(files[i],i);
    //     }
    // }
    // var fs = require('fs');
    // var files = fs.readdirSync('/all_tracks/');
    // console.log(files);
    // const testFolder = './tests/';
    // const fs = require('fs');

    // fs.readdir(testFolder, (err, files) => {
    //     files.forEach(file => {
    //         console.log(file);
    //     });
    // })
}

// file_content is the fíle's content as string
function extractDate(file_content){
    return '18-07-18';
}

function enableRenderButton(){

    render_button.removeAttribute("disabled");
}

function fileInputChanged(event){
    var input = event.target;
    
    var reader = new FileReader();

    remainingFiles = input.files.length;

    //TODO Must filter only the .gpx files
    for (var i = 0; i < input.files.length; i++) {
        
        var file = input.files[i];
        
        if(file.name.endsWith(".gpx")){
            
            // Get the file's content
            reader.onload = function(event){
                var text = event.target.result;
                console.log(text);

                // Get the date of the file 
                var date = extractDate(text);

                // Check if the filename list of the date is empty
                if(fileData[date] == null){
                    fileData[date] = [];
                }

                // Add the filame to the date element in the JSON
                fileData[date].push(file.name);

                // Update the remaining files
                remainingFiles -= 1;

            };
            
            reader.readAsText(file);



            // console.log(input.files[i].name);

        }
        else{
            console.log("Invalid file:_Not a gpx file");
        }

    }
    
    waitAllFilesRead();

    // Create the combo with each date in the JSON

    // 

    enableRenderButton();
}

function setupFileInput(){
    
    fileInput.addEventListener('change', fileInputChanged);
}

function waitAllFilesRead(){
    if(remainingFiles == 0){
        console.debug("done");
        populateDateCombo();
        return;
    }
    console.log("files_read: "+remainingFiles);
    setTimeout(waitAllFilesRead, 1000);
}

function populateDateCombo(){
    var result = ""
    // for(var i=0 ; fileData. ; i++){
    // }
    for(var date in fileData){
        result += "<option>"+date+"<option>"
    }
    date_combo.innerHTML = result;
    
}
window.onload = main;