
//
// Demonstrates the mapping of coordinates to tiles and the displaying of tiles on an OSM map.
//

import { Rectangle, Polyline } from 'react-leaflet'
import { TileSet } from 'tiles-math'
import { OSMContainer } from './OSMContainer'
import { sampleCoords } from './sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13

// Map all coordinates to tile names (https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
// and add them to a set. Duplicate tiles are ignored.
const tiles = new TileSet(tileZoom).addCoords(sampleCoords)

// For every tile, draw a red square on the map, using the Tile.bounds method.
const TileContainer = () => (
    <div>
        {tiles.map((tile, index) => (
            <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'red', weight: 0.5 }} />
        ))}
        <Polyline positions={sampleCoords} />
    </div>
)

export const DemoTrackTiles = () => (
    <OSMContainer tileContainer={<TileContainer />} mapZoom={mapZoom} />
)
