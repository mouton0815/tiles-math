import { tiles2clusters } from '../tiles2clusters'
import { TileSet } from '../../containers/TileSet'
import { Tile } from '../../types/Tile'

test('cluster-empty', () => {
    const tileClusters = tiles2clusters(new TileSet())
    expect(tileClusters.maxCluster.toArray()).toEqual([])
    expect(tileClusters.minorClusters.toArray()).toEqual([])
    expect(tileClusters.detachedTiles.toArray()).toEqual([])
})

test('cluster-none', () => {
    const tile1 = Tile.of(1, 2, 0)
    const tile2 = Tile.of(3, 2, 0)
    const allTiles = new TileSet().addAll([tile1, tile2])
    const tileClusters = tiles2clusters(allTiles)
    expect(tileClusters.maxCluster.toArray()).toEqual([])
    expect(tileClusters.minorClusters.toArray()).toEqual([])
    expect(tileClusters.detachedTiles.toArray()).toEqual([tile1, tile2])
})

test('cluster-simple', () => {
    const tileLeft   = Tile.of(1, 2, 0)
    const tileRight  = Tile.of(3, 2, 0)
    const tileBelow  = Tile.of(2, 3, 0)
    const tileCenter = Tile.of(2, 2, 0) // Central tile => the cluster
    const tileAbove  = Tile.of(2, 1, 0)
    const allTiles = new TileSet().addAll([tileLeft, tileRight, tileBelow, tileCenter, tileAbove])
    const tileClusters = tiles2clusters(allTiles)
    expect(tileClusters.maxCluster.toArray()).toEqual([tileCenter])
    expect(tileClusters.minorClusters.toArray()).toEqual([])
    expect(tileClusters.detachedTiles.toArray()).toEqual([tileLeft, tileRight, tileBelow, tileAbove])
})

test('cluster-separated', () => {
    const tile1Left   = Tile.of(1, 2, 0)
    const tile1Right  = Tile.of(3, 2, 0)
    const tile1Below  = Tile.of(2, 3, 0)
    const tile1Center = Tile.of(2, 2, 0) // Central tile => cluster A
    const tile1Above  = Tile.of(2, 1, 0)
    const tile2Center = Tile.of(3, 3, 0) // Central tile => cluster B
    const tile2Right  = Tile.of(4, 3, 0)
    const tile2Below  = Tile.of(3, 4, 0)
    const allTiles = new TileSet().addAll([tile1Left, tile1Right, tile1Below, tile1Center, tile1Above, tile2Center, tile2Right, tile2Below])
    const tileClusters = tiles2clusters(allTiles)
    expect(tileClusters.maxCluster.toArray()).toEqual([tile2Center]) // It is tile2Center because x=3 was added before x=2
    expect(tileClusters.minorClusters.toArray()).toEqual([tile1Center])
    expect(tileClusters.detachedTiles.toArray()).toEqual([tile1Left, tile1Right, tile2Below, tile1Below, tile1Above, tile2Right])
})

test('cluster-large', () => {
    const tileLeft    = Tile.of(1, 2, 0)
    const tileCenter2 = Tile.of(3, 2, 0)
    const tileBelow1  = Tile.of(2, 3, 0)
    const tileCenter1 = Tile.of(2, 2, 0)
    const tileAbove1  = Tile.of(2, 1, 0)
    const tileRight   = Tile.of(4, 2, 0)
    const tileBelow2  = Tile.of(3, 3, 0)
    const tileAbove2  = Tile.of(3, 1, 0)
    const allTiles = new TileSet().addAll([tileLeft, tileCenter2, tileBelow1, tileCenter1, tileAbove1, tileRight, tileBelow2, tileAbove2])
    const tileClusters = tiles2clusters(allTiles)
    expect(tileClusters.maxCluster.toArray()).toEqual([tileCenter2, tileCenter1])
    expect(tileClusters.minorClusters.toArray()).toEqual([])
    expect(tileClusters.detachedTiles.toArray()).toEqual([tileLeft, tileBelow2, tileAbove2, tileBelow1, tileAbove1, tileRight])
})

test('cluster-large-and-separated', () => {
    // Detached cluster A
    const tile1Center  = Tile.of(2, 2, 0) // Central tile cluster A
    const tile1Left    = Tile.of(1, 2, 0)
    const tile1Right   = Tile.of(3, 2, 0)
    const tile1Below   = Tile.of(2, 3, 0)
    const tile1Above   = Tile.of(2, 1, 0)
    // Main cluster B
    const tile2Left    = Tile.of(1, 5, 0)
    const tile2Center2 = Tile.of(3, 5, 0) // Central tile 1 cluster B
    const tile2Below1  = Tile.of(2, 6, 0)
    const tile2Center1 = Tile.of(2, 5, 0) // Central tile 2 cluster B
    const tile2Above1  = Tile.of(2, 4, 0)
    const tile2Right   = Tile.of(4, 5, 0)
    const tile2Below2  = Tile.of(3, 6, 0)
    const tile2Above2  = Tile.of(3, 4, 0)
    // Detached cluster C
    const tile3Right   = Tile.of(6, 2, 0)
    const tile3Center  = Tile.of(5, 2, 0) // Central tile cluster C
    const tile3Left    = Tile.of(4, 2, 0)
    const tile3Below   = Tile.of(5, 3, 0)
    const tile3Above   = Tile.of(5, 1, 0)
    const allTiles = new TileSet().addAll([
        tile1Center, tile1Left, tile1Right, tile1Below, tile1Above,
        tile2Left, tile2Center2, tile2Below1, tile2Center1, tile2Above1, tile2Right, tile2Below2, tile2Above2,
        tile3Right, tile3Center, tile3Left, tile3Below, tile3Above])
    const tileClusters = tiles2clusters(allTiles)
    expect(tileClusters.maxCluster.toArray()).toEqual([tile2Center1, tile2Center2])
    expect(tileClusters.minorClusters.toArray()).toEqual([tile1Center, tile3Center])
    expect(tileClusters.detachedTiles.toArray()).toEqual([
        tile1Below, tile1Above, tile2Below1, tile2Above1, tile1Left, tile2Left, tile1Right,
        tile2Below2, tile2Above2, tile2Right, tile3Left, tile3Right, tile3Below, tile3Above])
})
