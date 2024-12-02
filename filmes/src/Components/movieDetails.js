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

  const userId = auth.currentUser ? auth.currentUser.uid : null;

 
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=634fe8021bd7490d2e69e49e82825968`
        );
        const data = await response.json();
        setMovie(data);
        setAverageRating(data.vote_average); // Initial average rating
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    };

    fetchMovieDetails();
  }, []);

  // Fetch user and average ratings
  // useEffect(() => {
  //   if (!userId) return;

  //   const fetchRatings = async () => {
  //     try {
  //       const ratingsRef = collection(db, `ratings/${id}/userRatings`);
  //       const snapshot = await getDocs(ratingsRef);

  //       if (!snapshot.empty) {
  //         const userRatings = snapshot.docs.map((doc) => doc.data());

  //         // Calculate average rating
  //         const totalRatings = userRatings.reduce((acc, curr) => acc + curr.rating, 0);
  //         const numRatings = userRatings.length;
  //         setAverageRating(totalRatings / numRatings);

  //         // Find user's rating
  //         const userRatingDoc = snapshot.docs.find((doc) => doc.id === userId);
  //         if (userRatingDoc) {
  //           setUserRating(userRatingDoc.data().rating);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Erro ao carregar avaliações:", error);
  //     }
  //   };

  //   fetchRatings();
  // }, []);

  // Submit user rating
  const handleRatingSubmit = async () => {
    if (!userId || userRating <= 0) {
      alert("Por favor, selecione uma avaliação antes de enviar.");
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
        const newAverage = totalRatings / numRatings;

      
        const movieRef = doc(db, `ratings/${id}`);
        await updateDoc(movieRef, { averageRating: newAverage });

        setAverageRating(newAverage);
        alert("Avaliação enviada com sucesso!");
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
          <Poster src={image_path + movie.poster_path} alt="Poster" />
          <Details>
            <Title>{movie.title}</Title>
            <Overview>{movie.overview}</Overview>
            <RatingContainer>
              <AverageRating>
                <Rating>
                  <p>
                    <strong></strong> {averageRating.toFixed(1)}
                  </p>
                </Rating>
              </AverageRating>
              <RatingBox>
                <p>
                  <strong>Your Rating:</strong>
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
                <button onClick={handleRatingSubmit}>Submit</button>
              </RatingBox>
            </RatingContainer>
          </Details>
        </Content>
      </Container>
    </>
  );
};

export default MovieDetails;



const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: relative;
  background-color: #000; /* Fundo preto */
  color: white; /* Texto branco */
`;

const BackButton = styled.button`
  background-color: rgb(169, 129, 10);
  border: none;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 25px;
  position: absolute;
  top: 20px;
  left: 20px;
  box-shadow: inset 0 2px 2px black;
  cursor: pointer;

  &:hover {
    background-color: rgb(149, 109, 10);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const Poster = styled.img`
  width: 300px;
  height: auto;
  border-radius: 10px;
  margin-right: 2rem;
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

const AverageRating = styled.div`
  margin-bottom: 1rem;
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
  right: 20px;
  bottom: 5px;
`;
