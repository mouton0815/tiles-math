import { BoundaryPolyline } from './BoundaryPolyline'
import { BoundarySegment } from '../types/BoundarySegment'

///
/// Contains all polylines of the defined the boundaries of a cluster.
///
export class ClusterBoundaries {
    array: Array<BoundaryPolyline>

    constructor() {
        this.array = new Array<BoundaryPolyline>()
    }

    addUpperEdge(x: number, y: number, zoom: number) {
        this.#prepend(BoundarySegment.fromUpperEdge(x, y), zoom)
    }

    addLeftEdge(x: number, y: number, zoom: number) {
        this.#append(BoundarySegment.fromLeftEdge(x, y), zoom)
    }

    addLowerEdge(x: number, y: number, zoom: number) {
        this.#append(BoundarySegment.fromLowerEdge(x, y), zoom)
    }

    addRightEdge(x: number, y: number, zoom: number) {
        this.#prepend(BoundarySegment.fromRightEdge(x, y), zoom)
    }

    /// Internal method that searches for a matching polyline start to prepend the segment.
    /// If a line was found, the method also tries to append the line to another matching line.
    /// Otherwise, the method creates a new polyline with the segment.
    #prepend(segment: BoundarySegment, zoom: number) {
        for (const [index, line] of this.array.entries()) {
            if (line.tryPrepend(segment)) {
                this.#tryAppend(segment, index)
                return
            }
        }
        this.array.push(new BoundaryPolyline(segment, zoom))
    }

    /// Internal method that searches for a matching polyline end to append the segment.
    /// If a line was found, the method also tries to prepend the line to another matching line.
    /// Otherwise, the method creates a new polyline with the segment.
    #append(segment: BoundarySegment, zoom: number) {
        for (const [index, line] of this.array.entries()) {
            if (line.tryAppend(segment)) {
                this.#tryPrepend(segment, index)
                return
            }
        }
        this.array.push(new BoundaryPolyline(segment, zoom))
    }

    /// Tries to prepend the line with otherIndex to another existing line.
    #tryPrepend(segment: BoundarySegment, otherIndex: number) {
        for (const [index, line] of this.array.entries()) {
            if (index !== otherIndex && line.canPrepend(segment)) {
                line.prependLine(this.array[otherIndex]) // Prepend other line to this line
                this.array.splice(otherIndex, 1) // Delete other line
                break
            }
        }
    }

    /// Tries to append the line with otherIndex to another existing line.
    #tryAppend(segment: BoundarySegment, otherIndex: number) {
        for (const [index, line] of this.array.entries()) {
            if (index !== otherIndex && line.canAppend(segment)) {
                line.appendLine(this.array[otherIndex]) // Append other line to this line
                this.array.splice(otherIndex, 1) // Delete other line
                break
            }
        }
    }

    /// Similar to Array.map() function
    map<T>(callback: (line: BoundaryPolyline, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const line of this) { // Use *[Symbol.iterator]()
            results.push(callback(line, index++))
        }
        return results
    }

    /// Iterates through the polylines in creation order
    *[Symbol.iterator]() {
        for (const line of this.array) {
            yield line
        }
    }
}