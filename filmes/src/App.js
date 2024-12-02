import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./Components/firebase/firebase.conf";
import { setUser, clearUser } from "./store/authSlice";
import Login from "./Components/firebase/login";
import RegisterForm from "./Components/firebase/registo";
import Main from "./Components/main";
import MovieDetails from "./Components/movieDetails";

// Componente para rotas protegidas
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true); 
console.log("1");
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(
    (user) => {
      if (user) {
        dispatch(setUser({ email: user.email })); // Atualiza o estado global
      } else {
        dispatch(clearUser()); // Limpa o estado global se não autenticado
      }
      setLoading(false); // Finaliza o estado de carregamento
    },
    (error) => {
      console.error("Erro ao verificar autenticação:", error);
      setLoading(false); // Evita loading infinito mesmo em caso de erro
    }
  );

  return () => unsubscribe();
}, [dispatch]);

  console.log("3");
  console.log(loading);

  // if (loading) {
  //   return <p>Loading...</p>; 
  // }

  return (
    <Router>
      <Routes>
        
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/main" /> : <Navigate to="/login" />
          }
        />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />

       
        <Route
          path="/main"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Main />
            </PrivateRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MovieDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
