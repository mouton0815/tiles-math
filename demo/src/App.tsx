import { Routes, Route, Outlet, Link } from 'react-router-dom'
import { DemoTrackTiles } from './DemoTrackTiles'
import { DemoClustering } from './DemoClustering'
import { DemoBoundaries } from './DemoBoundaries'
import { DemoMaxSquare } from './DemoMaxSquare'
import { DemoAllFeatures } from './DemoAllFeatures'
import './App.css'

export const App = () => (
    <>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<DemoTrackTiles />} />
                <Route path='clustering' element={<DemoClustering />} />
                <Route path='boundaries' element={<DemoBoundaries />} />
                <Route path='max-square' element={<DemoMaxSquare />} />
                <Route path='all-features' element={<DemoAllFeatures />} />
            </Route>
        </Routes>
    </>
)

const Layout = () => (
    <div>
        <nav>
            <ul>
                <li><Link to="/">Map Coordinates to Tiles</Link></li>
                <li><Link to="/clustering">Max and Minor Clusters</Link></li>
                <li><Link to="/boundaries">Boundaries of Max Cluster</Link></li>
                <li><Link to="/max-square">Max Square</Link></li>
                <li><Link to="/all-features">Random Tile Generation</Link></li>
            </ul>
        </nav>
        <Outlet />
    </div>
)
