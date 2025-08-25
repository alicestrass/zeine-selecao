import { Routes, Route, Navigate  } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth"
import Produtos from "./pages/Produtos";
import NewProduct from "./pages/NewProduct";
import EditProduct from "./pages/EditProduct";

const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth(); 
    if (loading) {
        return <div>Carregando...</div>;
    }
    return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
        <Route path="/produtos/novo" element={<PrivateRoute><NewProduct /></PrivateRoute>} />
        <Route path="/produtos/editar/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;