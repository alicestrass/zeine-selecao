import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
// import Dashboard from "./pages/Dashboard";
// import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Adicione outras rotas aqui conforme for desenvolvendo */}
      </Routes>
    </AuthProvider>
  );
}

export default App;