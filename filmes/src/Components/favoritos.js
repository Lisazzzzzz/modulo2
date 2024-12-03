import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
        const favoritesRef = collection(db, `users/${userId}/favorites`);
        const snapshot = await getDocs(favoritesRef);

        if (snapshot.empty) {
          setErrorMessage("Nenhum filme favorito encontrado.");
          setLoading(false);
          return;
        }

        const favoriteMovieIds = snapshot.docs.map((doc) => doc.id);

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

  if (loading) return <LoadingMessage>Carregando...</LoadingMessage>;
  if (errorMessage) return <ErrorMessage>{errorMessage}</ErrorMessage>;

  return (
    <FavoritesContainer>
      <h1>Meus Filmes Favoritos</h1>
      <MoviesGrid>
        {favoriteMovies.map((movie) => (
          <Movie key={movie.id}>
            <Poster src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <MovieDetails>
              <Box>
                <Title>{movie.title}</Title>
                <Rating>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</Rating>
              </Box>
            </MovieDetails>
            <Overview>
              <h1>Overview</h1>
              {movie.overview}
            </Overview>
          </Movie>
        ))}
      </MoviesGrid>
    </FavoritesContainer>
  );
};

export default FavoritesList;

// Styled Components

const FavoritesContainer = styled.div`
  margin: 2rem auto;
  text-align: center;
  color: white;

  h1 {
    margin-bottom: 1.5rem;
  }
`;

const MoviesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Overview = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-height: 100%;
  background-color: #f0a500;
  opacity: 0.9;
  color: white;
  box-sizing: border-box;
  padding: 1rem;
  transition: all 0.4s ease-in-out;
  overflow-y: auto;
  transform: translateY(100%);
`;

const Movie = styled.div`
  box-shadow: 0 5px 10px black;
  width: 250px;
  background-color: #f0a500;
  margin: 1rem;
  border-radius: 5px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  &:hover ${Overview} {
    transform: translateY(0%);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 250px;
`;


const MovieDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Title = styled.h4`
  width: 160px;
  text-align: left;
`;

const Rating = styled.p`
  background-color: rgb(169, 129, 10);
  width: 45px;
  height: 45px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border: 1px solid rgb(169, 129, 10);
  box-shadow: inset 0 2px 2px black;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: white;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: red;
`;
