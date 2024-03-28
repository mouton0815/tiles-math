import { cluster2boundaries, cluster2square, delta2clusters, tiles2clusters, TileSet } from 'tiles-math'

const tileZoom = 14
const tileSet = new TileSet(tileZoom)

const coords = []
for (let i = 0; i < 500000; ++i) {
    coords.push([48 + 6 * Math.random(), 7 + 10 * Math.random()])
}
const date1 = new Date()
console.log('Start  :', date1.toISOString())
tileSet.addCoords(coords)
const date2 = new Date()
console.log('TileSet:', date2.toISOString(), date2 - date1, tileSet.getSize())
const clusters = tiles2clusters(tileSet)
const date3 = new Date()
console.log('Cluster:', date3.toISOString(), date3 - date2, clusters.minorClusters.getSize(), clusters.maxCluster.getSize())
const delta = delta2clusters(tileSet)
const date4 = new Date()
console.log('Delta  :', date4.toISOString(), date4 - date3, delta.minorClusters.getSize(), delta.maxCluster.getSize())
const squares = cluster2square(clusters.allTiles)
const date5 = new Date()
console.log('Squares:', date5.toISOString(), date5 - date4, squares.getRectangles().length)
const boundaries = cluster2boundaries(clusters.maxCluster)
const date6 = new Date()
console.log('Bounds :', date6.toISOString(), date6 - date5, [...boundaries].length)
