import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { doc, setDoc, deleteDoc, getDocs, collection, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase/firebase.conf";


const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [apiRating, setApiRating] = useState(0); // Média inicial da API
  const [userAverageRating, setUserAverageRating] = useState(0); // Média dos utilizadores
  const [combinedAverageRating, setCombinedAverageRating] = useState(0); // Média combinada
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const userId = auth.currentUser ? auth.currentUser.uid : null;


  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=634fe8021bd7490d2e69e49e82825968`
        );
        const data = await response.json();
        setMovie(data);
        setApiRating(data.vote_average); 
        setCombinedAverageRating(data.vote_average); 
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);


  useEffect(() => {
    if (!userId) return;

    const fetchRatings = async () => {
      try {
        const ratingsRef = collection(db, `ratings/${id}/userRatings`);
        const snapshot = await getDocs(ratingsRef);

        if (!snapshot.empty) {
          const userRatings = snapshot.docs.map((doc) => doc.data());
          const totalRatings = userRatings.reduce((acc, curr) => acc + curr.rating, 0);
          const numRatings = userRatings.length;

          const firestoreAverage = totalRatings / numRatings;
          setUserAverageRating(firestoreAverage); 
          setCombinedAverageRating((apiRating + firestoreAverage) / 2); 
          
          const userRatingDoc = snapshot.docs.find((doc) => doc.id === userId);
          if (userRatingDoc) {
            setUserRating(userRatingDoc.data().rating);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      }
    };

    fetchRatings();
  }, [id, userId, apiRating]);

  useEffect(() => {
    if (!userId) return;

    const checkFavorite = async () => {
      try {
        const favoriteRef = doc(db, `users/${userId}/favorites/${id}`);
        const favoriteDoc = await getDoc(favoriteRef);

        if (favoriteDoc.exists()) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Erro ao verificar favoritos:", error);
      }
    };

    checkFavorite();
  }, [id, userId]);

  const handleFavoriteToggle = async () => {
    if (!userId) {
      setErrorMessage("Precisas estar logado para adicionar aos favoritos.");
      return;
    }

    try {
      const favoriteRef = doc(db, `users/${userId}/favorites/${id}`);

      if (isFavorite) {
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
        console.log("Filme removido dos favoritos.");
      } else {
        await setDoc(favoriteRef, { movieId: id });
        setIsFavorite(true);
        console.log("Filme adicionado aos favoritos.");
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

  const handleRatingSubmit = async () => {
    if (!userId) {
      setErrorMessage("Precisas estar logado para enviar uma avaliação.");
      return;
    }

    if (userRating <= 0) {
      setErrorMessage("Por favor, seleciona uma avaliação antes de enviar.");
      return;
    }

    try {
      const userRatingRef = doc(db, `ratings/${id}/userRatings/${userId}`);
      await setDoc(userRatingRef, { rating: userRating });
      setIsSubmitted(true);

      const ratingsRef = collection(db, `ratings/${id}/userRatings`);
      const snapshot = await getDocs(ratingsRef);
      if (!snapshot.empty) {
        const userRatings = snapshot.docs.map((doc) => doc.data());
        const totalRatings = userRatings.reduce((acc, curr) => acc + curr.rating, 0);
        const numRatings = userRatings.length;
        const newFirestoreAverage = totalRatings / numRatings;

        setUserAverageRating(newFirestoreAverage); 
        setCombinedAverageRating((apiRating + newFirestoreAverage) / 2); 
        setErrorMessage("");
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao salvar a avaliação:", error);
    }
  };

  if (!movie) return <p>Loading...</p>;

  const image_path = "https://image.tmdb.org/t/p/w500";

  return (
    <>
      <GlobalStyle />
      <Container>
        <BackButton onClick={() => navigate(-1)}>Voltar</BackButton>
        <Content>
          <PosterContainer>
            <Poster src={image_path + movie.poster_path} alt="Poster" />
            <Rating>{combinedAverageRating.toFixed(1)}</Rating> {/* Exibe a média combinada */}
          </PosterContainer>
          <Details>
            <Title>{movie.title}</Title>
            <Overview>{movie.overview}</Overview>
            <None> <p>Avaliação média: {(userAverageRating || 0).toFixed(1)}</p> </None>
            <RatingContainer>
              <RatingBox>
                <p>
                  <strong>Avalia o teu filme</strong>
                </p>
                <Stars>
                  {[...Array(10)].map((_, index) => (
                    <Star
                      key={index}
                      filled={userRating > index}
                      onClick={() => setUserRating(index + 1)}
                    >
                      ★
                    </Star>
                  ))}
                </Stars>
                <SubmitButton onClick={handleRatingSubmit} disabled={isSubmitted}>
                  {isSubmitted ? "Submetido" : "Enviar"}
                </SubmitButton>
                {isSubmitted && <FeedbackMessage>Avaliação enviada com sucesso!</FeedbackMessage>}
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              </RatingBox>
            </RatingContainer>
          </Details>
          <FavoriteButton onClick={handleFavoriteToggle}>
            {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          </FavoriteButton>
        </Content>
      </Container>
    </>
  );
};

export default MovieDetails;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: relative;
  background-color: #000;
  color: white;
`;

const BackButton = styled.button`
  background-color: rgb(169, 129, 10);
  border: none;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 25px;
  position: absolute;
  top: 30px; 
  left: 15px; 
  box-shadow: inset 0 2px 2px black;
  cursor: pointer;
  z-index: 2; 

  &:hover {
    background-color: rgb(149, 109, 10);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const PosterContainer = styled.div`
  position: relative;
`;

const Poster = styled.img`
  width: 300px;
  height: auto;
  border-radius: 10px;
  margin-right: 2rem;
`;

const Rating = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Overview = styled.p`
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const RatingContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
`;

const RatingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1rem;
`;

const Stars = styled.div`
  display: flex;

  margin-bottom:2rem;
`;

const Star = styled.span`
  font-size: 2rem;
  color: ${(props) => (props.filled ? "rgb(169, 129, 10)" : "gray")};
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    color: gold;
  }
`;

const SubmitButton = styled.button`
  background-color: ${(props) => (props.disabled ? "gray" : "transparent")};
  border: 2px solid white;
  color: ${(props) => (props.disabled ? "darkgray" : "white")};
  padding: 10px 20px;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "white")};
    color: ${(props) => (props.disabled ? "darkgray" : "black")};
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "scale(0.98)")};
  }
`;

const FeedbackMessage = styled.div`
  color: rgb(169, 129, 10);
  margin-top: 10px;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  color: rgb(169, 129, 10);
  margin-top: 30px;
  font-size: 1.5rem;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden; 
    background-color: black; 
  }
`;

const FavoriteButton = styled.button`
  background-color: ${(props) => (props.isFavorite ? "rgb(169, 129, 10)" : "transparent")};
  color: ${(props) => (props.isFavorite ? "white" : "rgb(169, 129, 10)")};
  border: 2px solid rgb(169, 129, 10);
  padding: 10px 20px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 150px;
  height:50px;
  margin-top: 2rem;
  &:hover {
    background-color: ${(props) => (props.isFavorite ? "rgb(149, 109, 10)" : "rgb(169, 129, 10)")};
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const None = styled.div`
  color: rgb(169, 129, 10);
  margin-top: 30px;
  font-size: 1.5rem;
  display: none; /* Torna o elemento invisível e remove do layout */
`;