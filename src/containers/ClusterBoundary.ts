import { ClusterEdge } from '../types/ClusterEdge'

export class ClusterBoundary {
    edges: Array<ClusterEdge>

    /// Initializes a new cluster boundary with a start edge.
    constructor(edge: ClusterEdge) {
        this.edges = new Array<ClusterEdge>()
        this.edges.push(edge)
    }

    /// Inserts newEdge before the start of this boundary if the end coordinates of newEsge are
    /// equal to the start coordinates of the boundary. Returns true in this case and false otherwise.
    tryJoinStart(newEdge: ClusterEdge): boolean {
        const firstEdge = this.edges[0] // Array is never empty
        if (newEdge.x2 === firstEdge.x1 && newEdge.y2 === firstEdge.y1) {
            if (newEdge.x1 === firstEdge.x2) { // newEdge has same direction as firstEdge: merge
                firstEdge.y1 = newEdge.y1
            } else if (newEdge.y1 === firstEdge.y2) { // ditto
                firstEdge.x1 = newEdge.x1
            } else {
                this.edges.unshift(newEdge)
            }
            return true
        }
        return false
    }

    /// Appends the newEdge to the end of this boundary if the start coordinates of newEdge are
    /// equal to the end coordinates of the boundary. Returns true in this case and false otherwise.
    tryJoinEnd(newEdge: ClusterEdge): boolean {
        const lastEdge = this.edges[this.edges.length - 1] // Array is never empty
        if (newEdge.x1 === lastEdge.x2 && newEdge.y1 === lastEdge.y2) {
            if (newEdge.x2 === lastEdge.x1) { // newEdge has same direction as lastEdge: merge
                lastEdge.y2 = newEdge.y2
            } else if (newEdge.y2 === lastEdge.y1) { // ditto
                lastEdge.x2 = newEdge.x2
            } else {
                this.edges.push(newEdge)
            }
            return true
        }
        return false
    }

    isCircular(): boolean {
        const firstEdge = this.edges[0]
        const lastEdge = this.edges[this.edges.length - 1]
        return firstEdge.x1 === lastEdge.x2 && firstEdge.y1 === lastEdge.y2
    }
}