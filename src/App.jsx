import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack"; // Import SnackbarProvider
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import DeleteActivities from "./pages/DeleteActivities.jsx";
import "./App.css";
import PrivateRoute from "./util/PrivateRoute.jsx";
import PublicRoute from "./util/PublicRoute.jsx";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route
              path="/activities/delete/:id"
              element={<DeleteActivities />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
