## Display GPS Traces on a Map
This repository have a simple JavaScript program for displaying GPS Traces onto a map.

## How it works
It uses the MapboxGL JS API for creating the map itself. Therefore it requests for all the `.gpx` files in a GitHub Repository (which hosts several GPX traces). Then it parses all the `gpx` files to the format required for rendering a multiline onto the Mapbox map. 

## Features
- It can retrieve files from folder in a configurable GitHub repository
- It shows each track with a level of opacity, so if there are many tracks that passes through the same route, that route will be shown with a darker color, achieving something like a heatmap appearance.
- You can customize the color of the track being displayed, the line width and other parameters.

