import { cluster2boundaries, cluster2square, tiles2clusters, TileSet } from 'tiles-math'

const tileZoom = 14
const tileSet = new TileSet(tileZoom)

const coords = []
for (let i = 0; i < 500000; ++i) {
    coords.push([48 + 6 * Math.random(), 7 + 10 * Math.random()])
}
console.log('Start  :', new Date().toISOString())
tileSet.addCoords(coords)
console.log('TileSet:', new Date().toISOString(), tileSet.getSize())
const clusters = tiles2clusters(tileSet)
console.log('Cluster:', new Date().toISOString(), clusters.minorClusters.getSize(), clusters.maxCluster.getSize())
const squares = cluster2square(clusters.maxCluster)
console.log('Squares:', new Date().toISOString(), squares.getRectangles().length)
const boundaries = cluster2boundaries(clusters.maxCluster)
console.log('Bounds :', new Date().toISOString(), [...boundaries].length)