import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./pages/Login";
import Order from "./pages/Order";
import NotFound from "./pages/NotFound";
import { OrderSuccess } from "./pages/OrderSuccess";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log(isAuthenticated);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated === true ? "/orders" : "/login"} />
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/orders"
          element={isAuthenticated ? <Order /> : <Navigate to="/login" />}
        />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
