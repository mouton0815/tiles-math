import { TileSet } from '../../containers/TileSet'
import { cluster2boundaries } from '../cluster2boundaries'

test('cluster2boundaries-empty', () => {
    const lines = [...cluster2boundaries(new TileSet(0))]
    expect(lines.length).toBe(0)
})

test('cluster2boundaries-simple', () => {
    //     1
    // 1 | x |
    const cluster = new TileSet(0).addTile({ x: 1, y: 1 })
    const lines = [...cluster2boundaries(cluster)]
    expect(lines.length).toBe(1)
    expect([...lines[0]]).toEqual([
        { x: 2, y: 2 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
    ])
})

test('cluster2boundaries-right-open', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 | x |   |   |
    // 3 | x |   | x |
    // 4 | x | x | x |
    const cluster = new TileSet(0).addTiles([ // Insert in 'random' order
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 3, y: 3 },
        { x: 1, y: 1 },
        { x: 1, y: 3 },
        { x: 3, y: 1 },
        { x: 1, y: 4 },
    ])
    const lines = [...cluster2boundaries(cluster)]
    expect(lines.length).toBe(1)
    expect([...lines[0]]).toEqual([
        { x: 4, y: 5 },
        { x: 4, y: 3 },
        { x: 3, y: 3 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 2, y: 2 },
        { x: 4, y: 2 },
        { x: 4, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 5 },
        { x: 4, y: 5 },
    ])
})

test('cluster2boundaries-left-open', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 |   |   | x |
    // 3 | x |   | x |
    // 4 | x | x | x |
    const cluster = new TileSet(0).addTiles([ // Insert in 'random' order
        { x: 1, y: 3 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 2, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 1, y: 4 },
    ])
    const lines = [...cluster2boundaries(cluster)]
    expect(lines.length).toBe(1)
    expect([...lines[0]]).toEqual([
        { x: 4, y: 5 },
        { x: 4, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 3, y: 2 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 2, y: 3 },
        { x: 1, y: 3 },
        { x: 1, y: 5 },
        { x: 4, y: 5 },
    ])
})

test('cluster2boundaries-inner-outer', () => {
    //     1   2   3   4
    // 1 | x | x | x | x |
    // 2 | x |   |   | x |
    // 3 | x | x | x | x |
    const cluster = new TileSet(0).addTiles([ // Insert in 'random' order
        { x: 3, y: 3 },
        { x: 1, y: 2 },
        { x: 4, y: 3 },
        { x: 2, y: 3 },
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 2 },
        { x: 2, y: 1 },
        { x: 1, y: 3 },
        { x: 4, y: 1 },
        { x: 4, y: 3 },
    ])
    const lines = [...cluster2boundaries(cluster)]
    expect(lines.length).toBe(2)
    // Outer boundary
    expect([...lines[0]]).toEqual([
        { x: 5, y: 4 },
        { x: 5, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 4 },
        { x: 5, y: 4 },
    ])
    // Inner boundary
    expect([...lines[1]]).toEqual([
        { x: 4, y: 3 },
        { x: 2, y: 3 },
        { x: 2, y: 2 },
        { x: 4, y: 2 },
        { x: 4, y: 3 },
    ])
})

test('cluster2boundaries-two-inner', () => {
    //     1   2   3   4
    // 1 | x | x | x | x |
    // 2 | x |   |   | x |
    // 3 | x | x | x | x |
    // 4 | x |   | x | x |
    // 5 | x | x | x | x |
    const cluster = new TileSet(0).addTiles([
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 1, y: 4 },
        { x: 1, y: 5 },
        { x: 2, y: 1 },
        { x: 2, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 1 },
        { x: 3, y: 3 },
        { x: 3, y: 4 },
        { x: 3, y: 5 },
        { x: 4, y: 1 },
        { x: 4, y: 2 },
        { x: 4, y: 3 },
        { x: 4, y: 4 },
        { x: 4, y: 5 },
    ])
    const lines = [...cluster2boundaries(cluster)]
    expect(lines.length).toBe(3)
    // Inner boundary 1
    expect([...lines[0]]).toEqual([
        { x: 3, y: 5 },
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 3, y: 4 },
        { x: 3, y: 5 },
    ])
    // Outer boundary
    expect([...lines[1]]).toEqual([
        { x: 5, y: 6 },
        { x: 5, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 6 },
        { x: 5, y: 6 },
    ])
    // Inner boundary 2
    expect([...lines[2]]).toEqual([
        { x: 4, y: 3 },
        { x: 2, y: 3 },
        { x: 2, y: 2 },
        { x: 4, y: 2 },
        { x: 4, y: 3 },
    ])
})

test('cluster2boundaries-non-connected', () => {
    // This is not a regular max cluster because tile [3,2] is not connected.
    // Still the algorithms works and finds complete and unique line segments.
    //     1   2   3
    // 1 | x | x |   |
    // 2 | x |   | x |
    // 3 | x | x |   |
    // 4 |   | x | x |
    const cluster = new TileSet(0).addTiles([ // Insert in 'random' order
        { x: 1, y: 2 },
        { x: 3, y: 2 },
        { x: 3, y: 4 },
        { x: 2, y: 3 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
    ])
    const lines = [...cluster2boundaries(cluster)]
    expect(lines.length).toBe(2)
    // Boundary of main area
    expect([...lines[0]]).toEqual([
        { x: 4, y: 5 },
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 3, y: 3 },
        { x: 2, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 3, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 4 },
        { x: 2, y: 4 },
        { x: 2, y: 5 },
        { x: 4, y: 5 },
    ])
    // Boundary of single non-connected tile
    expect([...lines[1]]).toEqual([
        { x: 4, y: 3 },
        { x: 4, y: 2 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
    ])
})
