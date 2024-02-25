# Tile Math

This library provides algorithms and data structures to map your rides and runs to [slippy map tiles](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames).
It then groups the tiles in various ways, similar to what
[VeloViewer](https://veloviewer.com/explorer), [StatsHunters](https://www.statshunters.com),
[Squadrats](https://squadrats.com/activities), and [RideEveryTile](https://rideeverytile.com) do.

Specifically, `tile-math`
* maps geo positions (latitude, longitude) to map tiles of a given zoom level,
* combines adjacent tiles to connected clusters,
* selects the maximum-size tile cluster,
* computes the boundary polylines of tile clusters,
* detects the largest and most central square included in a cluster,
* finds all maximum-size rectangles embedded in a cluster,
* calculates the map coordinates of tiles, clusters, polylines, squares, rectangles.  

The library does not provide GPX parsing routines. It also does not come with map functionalities,
but it can be easily integrated into map frameworks such as [Leaflet](https://leafletjs.com).
In particular, the map coordinates calculated for the various artifacts are compatible with Leaflet's
[LatLng](https://leafletjs.com/reference.html#latlng) and [LatLngBounds](https://leafletjs.com/reference.html#latlngbounds)
types, and can thus directly used for drawing Leaflet [Rectangles](https://leafletjs.com/reference.html#rectangle),
[Polylines](https://leafletjs.com/reference.html#polyline), and similar map overlays.

The [demo](./demo) folder shows an example of applying `tile-math` to a [React Leaflet](https://react-leaflet.js.org) map.
Red squares represent tiles of zoom level 14 touched by (fake) rides,
purple regions show smaller clusters (i.e. tiles with four neighbors),
the blue area depicts the maximum cluster (with the orange circle as its [centroid](https://en.wikipedia.org/wiki/Centroid)),
and the yellow frame shows the maximum square:

<img src="demo.png" alt="Screenshot of the demo integration into React Leaflet" style="width:700px;"/>

Because `tile-math` is a pure Javascript library (written in Typescript) without dependencies
and without reference to a specific map framework, it can be used in the browser and in Node servers.
The latter is very useful to pre-compute all tiles for all your rides and runs, and then deliver
the resulting tile set via API to the browser.

# Installation
```
npm install tile-math
```

# Usage
## Display a Tile Set created from GPS Positions
Assume you have a number of tracks stored e.g. as GPX files. With function `coords2tile` you find the
tile touched by a latitude-longitude pair, given a zoom level (often 14). Class `TileSet` holds all unique
(non-duplicate) tiles of all your rides and runs. Note that you can compute the tile set on the backend,
and deliver them via API.

```typescript jsx
import { Rectangle } from 'react-leaflet'
import { coords2tile, TileSet } from 'tile-math'

const zoom = 14 // VeloViewer and others use zoom-level 14 tiles
const coords = [[51.492084, 0.010122], ...] // The latitude-longitude pairs or your rides
const tiles = new TileSet().addAll(coords.map(latLon => coords2tile(latLon, zoom)))

export const TileContainer = () => (
    <div>
        {tiles.map((tile, index) => (
            <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'red' }} />
        ))}
    </div>
)
```

The complete source code can be found in [DemoTrackTiles.tsx](demo/src/DemoTrackTiles.tsx).

## Clustering of a Tile Set
Tiles with a neighboring tile on each side belong to a cluster. A tile set can have multiple clusters.
The largest cluster is called _max cluster_. The following code snipped takes a tile set as input and
computes the max cluster, all minor clusters, and the remaining set of detached tiles:

```typescript jsx
import { Rectangle } from 'react-leaflet'
import { tiles2clusters, TileSet } from 'tile-math'

const zoom = 14
const tiles = new TileSet().addAll([...]) // The input tile set 
const { detached, surrounded, maxCluster } = tiles2clusters(tiles)

export const TileContainer = () => (
    <div>
        <>
            {detached.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
            ))}
        </>
        <>
            {surrounded.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'purple', weight: 1 }} />
            ))}
        </>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'blue', weight: 2 }} />
            ))}
        </>
    </div>
)
```

For more information see [DemoClustering.tsx](demo/src/DemoClustering.tsx).

## Show the Boundaries of a Tile Cluster
You may want to highlight the boundaries of a cluster on the map. Note that a cluster may have an outer boundary,
and multiple inner boundary polylines for cut-out areas.

```typescript jsx
import { Polyline, Rectangle } from 'react-leaflet'
import { cluster2boundaries, tiles2clusters, TileSet } from 'tile-math'

const zoom = 14
const tiles = new TileSet().addAll([...]) // The input tile set 
const { maxCluster } = tiles2clusters(tiles)
const boundaries = cluster2boundaries(maxCluster)

export const TileContainer = () => (
    <div>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'blue', weight: 0.5 }} />
            ))}
        </>
        <>
            {boundaries.map((line, index) => (
                <Polyline key={index} positions={line.positions(tileZoom)} pathOptions={{ color: 'blue', weight: 4 }} />
            ))}
        </>
    </div>
)
```

The source code can be found in [DemoBoundaries.tsx](demo/src/DemoBoundaries.tsx).

## Find the Max Square embedded in a Tile Cluster
The _max square_ is the square with the maximum edge length embeddable into the max cluster.
There may be several max squares in a cluster. Function `cluster2square` selects the max square
that is closest to the [centroid](https://en.wikipedia.org/wiki/Centroid) of the max cluster.

```typescript jsx
import { Rectangle } from 'react-leaflet'
import { cluster2square, tiles2clusters, TileSet } from 'tile-math'

const zoom = 14
const tiles = new TileSet().addAll([...]) // The input tile set 
const { maxCluster } = tiles2clusters(tiles)
const maxSquare = cluster2square(maxCluster).getCenterSquare()

export const TileContainer = () => (
    <div>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'blue', weight: 0.5 }} />
            ))}
        </>
        <>
            {maxSquare &&
                <Rectangle bounds={maxSquare.bounds(tileZoom)} pathOptions={{ fill: false, color: 'yellow', weight: 4 }} />
            }
        </>
    </div>
)
```

See [DemoMaxSquare.tsx](demo/src/DemoMaxSquare.tsx) for the complete source code.