import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase/firebase.conf";
import { Link } from "react-router-dom";

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
      <h1>My favorite movies</h1>
      <MoviesGrid>
        {favoriteMovies.map((movie) => (
          <Movie key={movie.id}>
            <Card>
              <Front>
                <Poster src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              </Front>
              <Back posterPath={movie.poster_path}>
                <Title>{movie.title}</Title>
                <Rating>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</Rating>
                <ButtonLink to={`/movie/${movie.id}`}>Ver Mais</ButtonLink>
              </Back>
            </Card>
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

const Movie = styled.div`
  perspective: 1000px;
  margin: 1rem;
`;

const Card = styled.div`
  width: 250px;
  height: 350px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);

  &:hover {
    transform: rotateY(180deg);
  }
`;

const Side = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
`;

const Front = styled(Side)`
  background-color: transparent; /* Remove o fundo colorido */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Back = styled(Side)`
  background-image: ${({ posterPath }) =>
    `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/w500${posterPath})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 10px;
`;

const Poster = styled.img`
  width: 100%;
  height: 300px;
  border-radius: 10px 10px 0 0;
`;

const Title = styled.h4`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 30px;
`;

const Rating = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ButtonLink = styled(Link)`
  padding: 0.5rem 1rem;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  background-color: #f0a500;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e09400;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: white;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: red;
`;
