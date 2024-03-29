import { ClusterSquare } from '../containers/ClusterSquare'
import { TileRectangle } from '../types/TileRectangle'
import { TileSet } from '../containers/TileSet'
import { Centroid } from '../types/Centroid'

/**
 * Finds the maximum square of tiles included in the {@link TileSet} cluster.
 * @param cluster - a tile cluster
 * @returns an object holding the max square of this tile cluster.
 */
export function cluster2square(cluster: TileSet): ClusterSquare {
    const state = new MergingState(cluster.getZoom(), cluster.centroid())
    for (const x of cluster.getSortedXs()) {
        state.newColumn(x)
        const sequence = new Sequence()
        for (const y of cluster.getSortedYs(x)) {
            // A sequence consists of consecutive tiles within one column (i.e. having the same x value)
            if (sequence.isConsecutive(y)) {
                sequence.push(y)
            } else {
                // Sequence ended, match it with all sequences of the previous column
                interleaveRange(sequence.toRange(), state)
                sequence.reset(y)
            }
        }
        interleaveRange(sequence.toRange(), state)
    }
    return state.squares
}

/**
 * Interleaves a range with all ranges of prevColumn.
 * Adds interleaved ranges to currColumn and to the pool of squares / rectangles.
 */
function interleaveRange(range: Range, state: MergingState) {
    const zoom = state.zoom || 0 // At this point, state.zoom is never null
    let maxOverlap = 0 // Maximum overlapping range in previous column
    for (const prevRange of state.prevColumn) {
        const yMin = Math.max(range.yMin, prevRange.yMin)
        const yMax = Math.min(range.yMax, prevRange.yMax)
        const overlap = yMax - yMin + 1 // Overlap of the current range with the range in the previous column
        const width = prevRange.width + 1
        // Add bounding rectangle to pool of max squares
        if (Math.min(overlap, width) >= state.squares.getSquareSize()) {
            state.squares.add(TileRectangle.of(state.x - width + 1, yMin, width, overlap, zoom))
        }
        // Add width-extended range only if it is larger than or equal to max square
        if (overlap >= state.squares.getSquareSize()) {
            state.currColumn.push({ yMin, yMax, width })
        }
        maxOverlap = Math.max(maxOverlap, overlap)
    }
    // If this is the first column, add a rectangle of width one
    if (state.squares.getSquareSize() <= 1) {
        state.squares.add(TileRectangle.of(state.x, range.yMin, 1, range.yMax - range.yMin + 1, zoom))
    }
    // Add new range only if it is larger than / equal to max square and any merged range from previous column,
    // because only then it can contribute to upcoming larger or equal-sized squares.
    if (range.yMax - range.yMin + 1 >= Math.max(maxOverlap, state.squares.getSquareSize())) {
        state.currColumn.push(range)
    }
}

/**
 * A range of connected tiles within one (width === 1) or more columns.
 * Ranges are candidates for rectangles.
 */
type Range = {
    yMin: number,
    yMax: number,
    width: number
}

/**
 * A sequence of y values within an x column
 */
class Sequence {
    array: Array<number>
    constructor() {
        this.array = new Array<number>()
    }
    push(y: number) {
        this.array.push(y)
    }
    reset(y: number) {
        this.array = [y]
    }
    isConsecutive(y: number): boolean {
        return this.array.length === 0 || this.array[this.array.length - 1] === y - 1
    }
    toRange(): Range {
        return { yMin: this.array[0], yMax: this.array[this.array.length - 1], width: 1 }
    }
}

/**
 * Holds all data needed by the cluster2square function
 */
class MergingState {
    zoom: number | null
    squares: ClusterSquare
    prevColumn: Array<Range>
    currColumn: Array<Range>
    x: number
    constructor(zoom: number | null, centroid: Centroid | null) {
        this.zoom = zoom
        this.squares = new ClusterSquare(centroid)
        this.prevColumn = new Array<Range>()
        this.currColumn = new Array<Range>()
        this.x = -2 // This will always lead to a gap even if the first column is at x = 0
    }
    newColumn(x: number) {
        // Flip between prev and curr column, but only if there is no gap between them
        this.prevColumn = x - this.x > 1 ? new Array<Range>() : this.currColumn
        this.currColumn = new Array<Range>()
        this.x = x
    }
}
