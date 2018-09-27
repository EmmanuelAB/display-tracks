var fileData = {};
var render_button, file_input;
var remainingFiles;
var date_combo;
var OFFSET_TO_DATE_START = 6;
var OFFSET_TO_DATE_END = 16;
var map;
var num_of_files;
var layers_ids = [];
var remove_button;
var layer_serial = 1;

function main(){

    date_combo = document.querySelector("#date");
    date_combo.onchange = comboDateChanged;

    render_button = document.querySelector("#render");
    fileInput = document.querySelector('#files');

    remove_button = document.querySelector("#remove");
    remove_button.onclick = removeClicked;

    
    initializeMap();

    render_button.onclick = renderClicked;

    setupFileInput();

    //temp
    // renderClicked();
}

function initializeMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiZW1tYW51ZWxhYiIsImEiOiJjamt0NmxpdHcwMnFyM2t0a3Mxbjh5aDFrIn0.7CcPXhDaki4-Y97DT7DYpQ';

    //Create the map object
    map = new mapboxgl.Map({
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
    layers_ids.push(traceId);
}

function renderClicked(){
    // Get the selected date from the combo
    var date = document.querySelector("#date").value;

    // Get all the filanames linked with the date in the JSON
    var files = fileData[date];

    console.debug("File asociated to date "+date+" : "+files);

    // Iterate over the filenames and add each one to the map
    for (var i = 0 ; i < files.length ; i++) {
        addGpxFileToMap(files[i],layer_serial);
        layer_serial += 1;
    }
}

// file_content is the fíle's content as string
function extractDate(file_content){
    var i = file_content.search("<time>");
    var date = file_content.slice(i+OFFSET_TO_DATE_START,i+OFFSET_TO_DATE_END);
    // console.log("*"+date+"*");
    return date;
}

function enableRenderButton(){

    render_button.removeAttribute("disabled");
}

function fileInputChanged(event){
    var input = event.target;
    date_combo.innerHTML = "<option>Processig...</option>";

    remainingFiles = input.files.length;

    //TODO Must filter only the .gpx files
    for (var i = 0; i < input.files.length; i++) {
        
        var reader = new FileReader();
        
        var file = input.files[i];
        
        if(file.name.endsWith(".gpx")){
            
            // Get the file's content
            reader.onload = function(event){
                var text = event.target.result;
                // console.log(text);

                // Get the date of the file 
                var date = extractDate(text);

                // Check if the filename list of the date is empty
                if(fileData[date] == null){
                    fileData[date] = [];
                }

                // Add the filame to the date element in the JSON
                fileData[date].push(file);

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
        // console.debug("done");
        populateDateCombo();
        return;
    }
    console.log("files_read: "+remainingFiles);
    setTimeout(waitAllFilesRead, 1000);
}

function comboDateChanged(){
    // console.log(this.value);
    var n = fileData[this.value].length;
    document.querySelector("#files_count").innerHTML = ""+n;
}

function populateDateCombo(){
    var result = ""
    var temp_list = [];
    for(var date in fileData){
        temp_list.push(date);
    }
    temp_list.sort();
    temp_list.forEach(function(elem){
        result += "<option>"+elem+"</option>";
        // i += 1;
    });
    date_combo.innerHTML = result;
    date_combo.removeAttribute("disabled");
}

function removeClicked(event){
    console.debug("deleting "+layers_ids);
    var n = layers_ids.length;
    for (var i = 0; i < n; i++) {
        // console.debug(e);
        var e = layers_ids.pop();
        map.removeLayer(e);
        console.debug("layer "+e+ " removed");
        
    }
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

window.onload = main;