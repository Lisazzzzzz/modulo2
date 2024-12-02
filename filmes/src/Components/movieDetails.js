import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { doc, setDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db, auth } from "./firebase/firebase.conf";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=634fe8021bd7490d2e69e49e82825968`
        );
        const data = await response.json();
        setMovie(data);
        setAverageRating(data.vote_average); 
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

        let firestoreAverage = 0; 
        let combinedAverage = averageRating; 

        if (!snapshot.empty) {
          const userRatings = snapshot.docs.map((doc) => doc.data());

          const totalRatings = userRatings.reduce((acc, curr) => acc + curr.rating, 0);
          const numRatings = userRatings.length;
          firestoreAverage = totalRatings / numRatings;

          
          combinedAverage = (averageRating + firestoreAverage) / 2;

          const userRatingDoc = snapshot.docs.find((doc) => doc.id === userId);
          if (userRatingDoc) {
            setUserRating(userRatingDoc.data().rating);
          }
        }

        setAverageRating(combinedAverage); 
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      }
    };

    fetchRatings();
  }, [id, userId, averageRating]);

  const handleRatingSubmit = async () => {
    if (!userId) {
      setErrorMessage("Você precisa estar logado para enviar uma avaliação.");
      return;
    }

    if (userRating <= 0) {
      setErrorMessage("Por favor, selecione uma avaliação antes de enviar.");
      return;
    }

    try {
      const userRatingRef = doc(db, `ratings/${id}/userRatings/${userId}`);
      await setDoc(userRatingRef, { rating: userRating });

      const ratingsRef = collection(db, `ratings/${id}/userRatings`);
      const snapshot = await getDocs(ratingsRef);
      if (!snapshot.empty) {
        const userRatings = snapshot.docs.map((doc) => doc.data());
        const totalRatings = userRatings.reduce((acc, curr) => acc + curr.rating, 0);
        const numRatings = userRatings.length;
        const firestoreAverage = totalRatings / numRatings;

        const newAverage = (movie.vote_average + firestoreAverage) / 2;

        const movieRef = doc(db, `ratings/${id}`);
        await updateDoc(movieRef, { averageRating: newAverage });

        setAverageRating(newAverage);
        setErrorMessage("");
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao salvar a avaliação:", error);
      setErrorMessage("Erro ao salvar a sua avaliação. Por favor, tente novamente.");
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
            <Rating>{averageRating.toFixed(1)}</Rating>
          </PosterContainer>
          <Details>
            <Title>{movie.title}</Title>
            <Overview>{movie.overview}</Overview>
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
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                {isSubmitted && <FeedbackMessage>Avaliação enviada com sucesso!</FeedbackMessage>}
              </RatingBox>
            </RatingContainer>
          </Details>
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
  margin-top: 10px;
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
  color: lime;
  margin-top: 10px;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  font-size: 1rem;
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
