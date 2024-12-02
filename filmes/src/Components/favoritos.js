import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase/firebase.conf";

const FavoritesList = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        setErrorMessage("Precisas estar logado para ver a lista de favoritos.");
        setLoading(false);
        return;
      }

      try {
        // Obtendo os IDs dos filmes favoritos do Firestore
        const favoritesRef = collection(db, `users/${userId}/favorites`);
        const snapshot = await getDocs(favoritesRef);

        if (snapshot.empty) {
          setErrorMessage("Nenhum filme favorito encontrado.");
          setLoading(false);
          return;
        }

        const favoriteMovieIds = snapshot.docs.map((doc) => doc.id);

        // Consultando os detalhes dos filmes na API TMDb
        const favoriteMovies = await Promise.all(
          favoriteMovieIds.map(async (movieId) => {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${movieId}?api_key=634fe8021bd7490d2e69e49e82825968`
            );

            if (!response.ok) {
              throw new Error(`Erro ao buscar detalhes do filme ${movieId}`);
            }

            return await response.json();
          })
        );

        setFavoriteMovies(favoriteMovies);
        setErrorMessage("");
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        setErrorMessage("Erro ao carregar a lista de favoritos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  if (loading) return <p>Carregando...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div>
      <h1>Meus Filmes Favoritos</h1>
      <div>
        {favoriteMovies.map((movie) => (
          <div key={movie.id}>
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
