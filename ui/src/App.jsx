import { useState } from 'react'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import VehiclesAndUsers from './pages/VehiclesAndUsers'
import TrafficViolation from './pages/TrafficViolation'
import ViolationVehicle from './pages/ViolationVehicle'
import AllVehicleDetails from './pages/AllVehicleDetails'
import StartPage from './pages/StartPage'

const pages = {
  dashboard: Dashboard,
  'vehicles-users': VehiclesAndUsers,
  'traffic-violation': TrafficViolation,
  'violation-vehicle': ViolationVehicle,
  'all-vehicle-details': AllVehicleDetails,
  start: StartPage,
}

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')

  if (!hasStarted) {
    return (
      <Welcome
        onStart={() => {
          setActivePage('start')
          setHasStarted(true)
        }}
      />
    )
  }

  const Page = pages[activePage]

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <Page onNavigate={setActivePage} />
    </Layout>
  )
}

export default App
