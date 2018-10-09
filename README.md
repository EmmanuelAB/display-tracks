## Display GPS Traces on a Map
This repository have a simple JavaScript program for displaying GPS Traces onto a MapBox map.

## How it works
It uses the MapboxGL JS API for creating the map itself. The tracks to display must be in `gpx` and are selected by the user from the local filesystem. When the the traces are selected the program parses the files to match the format required by the MapBox map to render the lines onto the map.

## Features
- You can select your gpx files from your local filesystem
- You can filter the tracks you want to render from a date filter
- It shows each track with a level of opacity, so if there are many tracks that passes through the same route, that route will be shown with a darker color, achieving something like a heatmap appearance.
- You can customize the color of the track being displayed, the line width and other parameters.

