import { BoundaryPolyline } from '../../containers/BoundaryPolyline'
import { BoundarySegment } from '../../types/BoundarySegment'
import { ClusterBoundaries } from '../../containers/ClusterBoundaries'
import { TileSet } from '../../containers/TileSet'
import { Tile } from '../../types/Tile'
import { cluster2boundaries } from '../cluster2boundaries'

test('cluster2boundaries-inner-outer', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 | x |   | x |
    // 3 | x | x | x |
    const cluster = new TileSet().addAll([ // Insert in 'random' order
        Tile.of(3, 3),
        Tile.of(1, 2),
        Tile.of(2, 3),
        Tile.of(1, 1),
        Tile.of(3, 1),
        Tile.of(3, 2),
        Tile.of(2, 1),
        Tile.of(1, 3),
    ])
    const boundaries = cluster2boundaries(cluster)
    // TODO: Duplicate of ClusterBoundaries.test.ts -> vary
    expect(boundaries.array.length).toBe(2)
    expect(boundaries.array[0].segments).toEqual([
        BoundarySegment.of(4, 4, 4, 1), // Right segment
        BoundarySegment.of(4, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 4), // Left segment
        BoundarySegment.of(1, 4, 4, 4), // Lower segment
    ])
    expect(boundaries.array[1].segments).toEqual([
        BoundarySegment.of(3, 3, 2, 3), // Upper segment
        BoundarySegment.of(2, 3, 2, 2), // Right segment
        BoundarySegment.of(2, 2, 3, 2), // Lower segment
        BoundarySegment.of(3, 2, 3, 3), // Left segment
    ])
})
