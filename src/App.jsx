import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import Scoring from './components/Scoring'
import Leaderboard from './components/Leaderboard'

function App() {

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login/>
    },
    {
      path: "/scoring",
      element: <Scoring />
    },
    {
      path: "/leaderboard",
      element: <Leaderboard/>
    }
  ])

  return (
    <RouterProvider router={appRouter}/>
  )
}

export default App
