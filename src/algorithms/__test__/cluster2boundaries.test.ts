import { BoundarySegment } from '../../types/BoundarySegment'
import { TileSet } from '../../containers/TileSet'
import { Tile } from '../../types/Tile'
import { cluster2boundaries } from '../cluster2boundaries'

test('cluster2boundaries-inner-outer', () => {
    //     1   2   3   4
    // 1 | x | x | x | x |
    // 2 | x |   |   | x |
    // 3 | x | x | x | x |
    const cluster = new TileSet().addAll([ // Insert in 'random' order
        Tile.of(3, 3),
        Tile.of(1, 2),
        Tile.of(4, 3),
        Tile.of(2, 3),
        Tile.of(1, 1),
        Tile.of(3, 1),
        Tile.of(4, 2),
        Tile.of(2, 1),
        Tile.of(1, 3),
        Tile.of(4, 1),
        Tile.of(4, 3),
    ])
    const boundaries = cluster2boundaries(cluster)
    const array = [...boundaries]
    expect(array.length).toBe(2)
    // Outer boundary
    expect(array[0].segments).toEqual([
        BoundarySegment.of(5, 4, 5, 1), // Right segment
        BoundarySegment.of(5, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 4), // Left segment
        BoundarySegment.of(1, 4, 5, 4), // Lower segment
    ])
    // Inner boundary
    expect(array[1].segments).toEqual([
        BoundarySegment.of(4, 3, 2, 3), // Lower segment
        BoundarySegment.of(2, 3, 2, 2), // Left segment
        BoundarySegment.of(2, 2, 4, 2), // Upper segment
        BoundarySegment.of(4, 2, 4, 3), // Right segment
    ])
})
