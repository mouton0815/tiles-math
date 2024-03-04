import { BoundarySegment } from '../types/BoundarySegment'
import { Coords } from '../types/Coords'
import { tile2coords } from '../algorithms/tile2coords'

/**
 * A polyline representing the boundaries of a tile cluster.
 * Method {@link positions} returns a sequence of positions that can be passed to Leaflet's Polyline map element.
 */
export class BoundaryPolyline {
    segments: Array<BoundarySegment>
    zoom: number

    /**
     * Initializes a new {@link BoundaryPolyline} with an initial segment.
     * @param segment - the initial segment of this polyline.
     * @param zoom - the zoom level of the tile cluster.
     */
    constructor(segment: BoundarySegment, zoom: number) {
        this.segments = new Array<BoundarySegment>()
        this.segments.push(segment)
        this.zoom = zoom
    }

    /**
     * Appends the other polyline to this line.
     * @param other - the line to append.
     */
    appendLine(other: BoundaryPolyline) {
        this.segments.push(...other.segments)
    }

    /**
     * Prepends the other polyline to this line.
     * @param other - the line to prepend.
     */
    prependLine(other: BoundaryPolyline) {
        this.segments.unshift(...other.segments)
    }

    /**
     * Checks whether the given {@link BoundarySegment} can be prepended to this polyline.
     * That is the case if the end position of the other polyline is equal the start position of this polyline.
     * @param segment - the {@link BoundarySegment} to prepend.
     * @returns true iff the passed segment can be prepended, false otherwise.
     */
    canPrepend(segment: BoundarySegment): boolean {
        const firstSegment = this.segments[0] // Array is never empty
        return segment.x2 === firstSegment.x1 && segment.y2 === firstSegment.y1
    }

    /**
     * Checks whether the given {@link BoundarySegment} can be appended to this polyline.
     * That is the case if the start position of the other polyline is equal the end position of this polyline.
     * @param segment - the {@link BoundarySegment} to append.
     * @returns true iff the passed segment can be appended, false otherwise.
     */
    canAppend(segment: BoundarySegment): boolean {
        const lastSegment = this.segments[this.segments.length - 1] // Array is never empty
        return segment.x1 === lastSegment.x2 && segment.y1 === lastSegment.y2
    }

    /**
     * Inserts the new segment before the start of this boundary if the end coordinates of the segment
     * are equal to the start coordinates of the boundary. Returns true in this case and false otherwise.
     * @param segment - the {@link BoundarySegment} to prepend.
     * @returns true iff the passed segment was prepended, false otherwise.
     * */
    tryPrepend(segment: BoundarySegment): boolean {
        const firstSegment = this.segments[0] // Array is never empty
        if (segment.x2 === firstSegment.x1 && segment.y2 === firstSegment.y1) {
            if (segment.x1 === firstSegment.x2) { // segment has same direction as firstSegment: merge
                firstSegment.y1 = segment.y1
            } else if (segment.y1 === firstSegment.y2) { // ditto
                firstSegment.x1 = segment.x1
            } else {
                this.segments.unshift(segment)
            }
            return true
        }
        return false
    }

    /**
     * Appends the new segment to the end of this boundary if the start coordinates of the new segment
     * are equal to the end coordinates of the boundary. Returns true in this case and false otherwise.
     * @param segment - the {@link BoundarySegment} to append.
     * @returns true iff the passed segment was appended, false otherwise.
     */
    tryAppend(segment: BoundarySegment): boolean {
        const lastSegment = this.segments[this.segments.length - 1] // Array is never empty
        if (segment.x1 === lastSegment.x2 && segment.y1 === lastSegment.y2) {
            if (segment.x2 === lastSegment.x1) { // segment has same direction as lastSegment: merge
                lastSegment.y2 = segment.y2
            } else if (segment.y2 === lastSegment.y1) { // ditto
                lastSegment.x2 = segment.x2
            } else {
                this.segments.push(segment)
            }
            return true
        }
        return false
    }

    /**
     * Checks if this polyline is circular, i.e. the start and end positions are equal.
     * @returns true if the polyline is circular, false otherwise.
     */
    isCircular(): boolean {
        const firstSegment = this.segments[0]
        const lastSegment = this.segments[this.segments.length - 1]
        return firstSegment.x1 === lastSegment.x2 && firstSegment.y1 === lastSegment.y2
    }

    /**
     * Returns a sequence of coordinates that can be passed to Leaflet's Polyline map element.
     */
    positions(): Array<Coords> {
        const results = new Array<Coords>()
        let first = true
        for (const segment of this.segments) {
            if (first) {
                results.push(tile2coords(segment.x1, segment.y1, this.zoom))
                first = false
            }
            results.push(tile2coords(segment.x2, segment.y2, this.zoom))
        }
        return results
    }
}