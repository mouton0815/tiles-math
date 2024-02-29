
# Demo of `tiles-math` Features

This project demonstrates various `tiles-math` calculations, such as finding the max cluster
and max square of tile sets. The results of the calculations are visualized on a
[React Leaflet](https://react-leaflet.js.org) map. In detail,
* [DemoTrackTiles.tsx](./src/DemoTrackTiles.tsx) shows the mapping of latitude/longitude sequences to map tiles of a given zoom level,
* [DemoClustering.tsx](./src/DemoClustering.tsx) computes the max cluster of a tile set, all minor clusters, and the set of non-cluster tiles,
* [DemoBoundaries.tsx](./src/DemoBoundaries.tsx) renders the boundary of a max cluster as Leaflet [Polyline](https://leafletjs.com/reference.html#polyline),
* [DemoMaxSquare.tsx](./src/DemoMaxSquare.tsx) finds the max square embedded into the max cluster of a tile set, and
* [DemoAllFeatures.tsx](./src/DemoAllFeatures.tsx) creates random tile sets and applies all the mentioned algorithms.

# Installation
```
npm install
```

# Running
```
npm run dev
```

Then point your browser to http://localhost:5173/
