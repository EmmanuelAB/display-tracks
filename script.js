function main(){
    
    initializeMap();

    document.querySelector("#render").onclick = renderClicked;

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
    //Get the selected date
    var date = document.querySelector("#date").value;

    //Get all the files within the folder named as the date
    
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Resp:"+this.responseText);
        }
    };
    request.open("GET", "./all_tracks/", true);
    // request.open("GET", "all_tracks/2489506.gpx", true);
    request.send();    
    console.log("request sent");
    // var files = document.querySelector("#files").files
    //     for(var i=0 ; i<files.length ; i++) {
    //         addGpxFileToMap(files[i],i);
    //     }
    // }
    // var fs = require('fs');
    // var files = fs.readdirSync('/all_tracks/');
    // console.log(files);
    const testFolder = './tests/';
    const fs = require('fs');

    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    })
}

window.onload = main;