import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Scoring from "./components/Scoring";
import Leaderboard from "./components/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/scoring",
      element: (
        <ProtectedRoute>
          <Scoring />
        </ProtectedRoute>
      ),
    },
    {
      path: "/leaderboard",
      element: <Leaderboard />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={appRouter} />;
}

export default App;
