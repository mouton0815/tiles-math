import { BoundaryPolyline } from './BoundaryPolyline'
import { BoundarySegment } from '../types/BoundarySegment'

///
/// Contains all polylines the defined the boundaries of a cluster.
///
export class ClusterBoundaries {
    array: Array<BoundaryPolyline>
    constructor() {
        this.array = new Array<BoundaryPolyline>()
    }

    addUpperEdge(x: number, y: number) {
        this.prepend(BoundarySegment.fromUpperEdge(x, y))
    }

    addLeftEdge(x: number, y: number) {
        this.append(BoundarySegment.fromLeftEdge(x, y))
    }

    addLowerEdge(x: number, y: number) {
        this.append(BoundarySegment.fromLowerEdge(x, y))
    }

    addRightEdge(x: number, y: number) {
        this.prepend(BoundarySegment.fromRightEdge(x, y))
    }

    /// Internal method that searches for a matching polyline start to prepend the segment.
    /// If no such line exits, the method creates a new polyline with the segment.
    prepend(segment: BoundarySegment) {
        for (const boundary of this.array) {
            if (boundary.tryPrepend(segment)) {
                return
            }
        }
        this.array.push(new BoundaryPolyline(segment))
    }

    /// Internal method that searches for a matching polyline end to append the segment.
    /// If no such line exits, the method creates a new polyline with the segment.
    append(segment: BoundarySegment) {
        for (const boundary of this.array) {
            if (boundary.tryAppend(segment)) {
                return
            }
        }
        this.array.push(new BoundaryPolyline(segment))
    }
}