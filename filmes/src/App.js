import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./Components/firebase/firebase.conf";
import { setUser, clearUser } from "./store/authSlice";
import Login from "./Components/firebase/login";
import RegisterForm from "./Components/firebase/registo";
import Main from "./Components/main";
import MovieDetails from "./Components/movieDetails";
import FavoritesList from "./Components/favoritos";
import StaticPage from "./Components/paginaestatica";


const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // Listener para mudanças no estado de autenticação do Firebase
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          dispatch(setUser({ email: user.email })); 
        } else {
          dispatch(clearUser()); 
        }
        setLoading(false); 
      },
      (error) => {
        console.error("Erro ao verificar autenticação:", error);
        setLoading(false); // Evita loading infinito mesmo em caso de erro
      }
    );

    return () => unsubscribe(); // Remove o listener ao desmontar o componente
  }, [dispatch]);

 
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#000", color: "#fff" }}>
        <p>Carregando...</p>
      </div>
    );
  }

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
        <Route path="/registo" element={<RegisterForm />} />

     
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

        <Route
          path="/favoritos"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <FavoritesList />
            </PrivateRoute>
          }
        />

        <Route
          path="/about"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <StaticPage />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;





