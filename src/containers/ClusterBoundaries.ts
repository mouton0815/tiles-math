import { BoundaryPolyline } from './BoundaryPolyline'
import { BoundarySegment } from './BoundarySegment'

/**
 * Contains all {@link BoundaryPolyline}s of the defined the boundaries of a cluster.
 * Objects of this class are created by algorithm {@link cluster2boundaries}.
 * For consumers, read-only access is recommended.
 */
export class ClusterBoundaries {
    private readonly array: Array<BoundaryPolyline>

    constructor() {
        this.array = new Array<BoundaryPolyline>()
    }

    addUpperEdge(x: number, y: number, zoom: number) {
        this.prepend(BoundarySegment.fromUpperEdge(x, y), zoom)
    }

    addLeftEdge(x: number, y: number, zoom: number) {
        this.append(BoundarySegment.fromLeftEdge(x, y), zoom)
    }

    addLowerEdge(x: number, y: number, zoom: number) {
        this.append(BoundarySegment.fromLowerEdge(x, y), zoom)
    }

    addRightEdge(x: number, y: number, zoom: number) {
        this.prepend(BoundarySegment.fromRightEdge(x, y), zoom)
    }

    /**
     * Internal method that searches for a matching polyline start to prepend the segment.
     * If a line was found, the method also tries to append the line to another matching line.
     * Otherwise, the method creates a new polyline with the segment.
     */
    private prepend(segment: BoundarySegment, zoom: number) {
        for (const [index, line] of this.array.entries()) {
            if (line.tryPrependSegment(segment)) {
                // Check if this line can be appended to another line
                this.tryAppendLine(line, index)
                return
            }
        }
        this.array.push(new BoundaryPolyline(segment, zoom))
    }

    /**
     * Internal method that searches for a matching polyline end to append the segment.
     * If a line was found, the method also tries to prepend the line to another matching line.
     * Otherwise, the method creates a new polyline with the segment.
     */
    private append(segment: BoundarySegment, zoom: number) {
        for (const [index, line] of this.array.entries()) {
            if (line.tryAppendSegment(segment)) {
                // Check if this line can be prepended to another line
                this.tryPrependLine(line, index)
                return
            }
        }
        this.array.push(new BoundaryPolyline(segment, zoom))
    }

    // TODO: Documentation
    private tryAppendLine(line: BoundaryPolyline, index: number) {
        for (const [otherIndex, otherLine] of this.array.entries()) {
            if (otherIndex !== index && otherLine.tryAppendLine(line)) {
                this.array.splice(index, 1) // Line appended to another line, delete it
                break
            }
        }
    }

    // TODO: Documentation
    private tryPrependLine(line: BoundaryPolyline, index: number) {
        for (const [otherIndex, otherLine] of this.array.entries()) {
            if (otherIndex !== index && otherLine.tryPrependLine(line)) {
                this.array.splice(index, 1) // Line prepended to another line, delete it
                break
            }
        }
    }

    /**
     * Similar to Array.map() function.
     */
    map<T>(callback: (line: BoundaryPolyline, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const line of this) { // Use *[Symbol.iterator]()
            results.push(callback(line, index++))
        }
        return results
    }

    /**
     * Iterates through the {@link BoundaryPolyline}s in creation order.
     */
    *[Symbol.iterator]() : Generator<BoundaryPolyline, void, undefined> {
        for (const line of this.array) {
            yield line
        }
    }
}