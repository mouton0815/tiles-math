# Tile Math


This library provides algorithms and data structures to map your rides and runs to [slippy map tiles](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames),
and group those tiles in various ways, similar to what
[VeloViewer](https://veloviewer.com/explorer), [StatsHunters](https://www.statshunters.com),
[Squadrats](https://squadrats.com/activities), and [RideEveryTile](https://rideeverytile.com) do. 

Specifically, `tile-math`
* maps geo positions (latitude, longitude) to map tiles of a given zoom level,
* combines adjacent tiles to clusters and selects the largest cluster,
* detects the maximum-size square included in a tile cluster,
* finds all maximum-size rectangles embedded in a cluster,
* calculates the map coordinates of tiles, clusters, squares, rectangles.  

The map coordinates calculated for the various artifacts are compatible with Leaflet's
[LatLng](https://leafletjs.com/reference.html#latlng) and [LatLngBounds](https://leafletjs.com/reference.html#latlngbounds)
types, and can thus directly used for drawing [Rectangles](https://leafletjs.com/reference.html#rectangle),
[Polyline](https://leafletjs.com/reference.html#polyline), and similar map overlays.
