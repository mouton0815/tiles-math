import { ClusterBoundaries } from '../ClusterBoundaries'

test('boundary-boundaries-outer-inner', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 | x |   | x |
    // 3 | x | x | x |
    const boundaries = new ClusterBoundaries()
    boundaries.addUpperEdge(1, 1, 7)
    boundaries.addLeftEdge(1, 1, 7)
    boundaries.addLeftEdge(1, 2, 7)
    boundaries.addRightEdge(1, 2, 7)
    boundaries.addLeftEdge(1, 3, 7)
    boundaries.addLowerEdge(1, 3, 7)
    boundaries.addUpperEdge(2, 1, 7)
    boundaries.addLowerEdge(2, 1, 7)
    boundaries.addUpperEdge(2, 3, 7)
    boundaries.addLowerEdge(2, 3, 7)
    boundaries.addUpperEdge(3, 1, 7)
    boundaries.addRightEdge(3, 1, 7)
    boundaries.addLeftEdge(3, 2, 7)
    boundaries.addRightEdge(3, 2, 7)
    boundaries.addLowerEdge(3, 3, 7)
    boundaries.addRightEdge(3, 3, 7)
    const array = [...boundaries]
    expect(array.length).toBe(2)
    // Outer boundary
    expect([...array[0]]).toEqual([
        { x: 4, y: 4 }, // Lower right
        { x: 4, y: 1 }, // Upper right
        { x: 1, y: 1 }, // Upper left
        { x: 1, y: 4 }, // Lower left
        { x: 4, y: 4 }, // Circle
    ])
    // Inner boundary
    expect([...array[1]]).toEqual([
        { x: 3, y: 3 }, // Lower right
        { x: 2, y: 3 }, // Lower left
        { x: 2, y: 2 }, // Upper left
        { x: 3, y: 2 }, // Upper right
        { x: 3, y: 3 }, // Circle
    ])
})
