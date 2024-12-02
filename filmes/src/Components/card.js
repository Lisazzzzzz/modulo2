import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = ({ info }) => {
  const image_path = "https://image.tmdb.org/t/p/w500";
  const roundedRating = info.vote_average ? info.vote_average.toFixed(1) : "N/A";
  return (
    <Movie>
      <Poster src={image_path + info.poster_path} alt="Imagem" />
      <MovieDetails>
        <Box>
          <Title>{info.title}</Title>
          <Rating>{roundedRating}</Rating>
        </Box>
      </MovieDetails>
      <Link to={`/movie/${info.id}`}> 
        <Overview>
          <h1>Overview</h1>
          {info.overview}
        </Overview>
      </Link>
    </Movie>
  );
};

export default Card;

// Styled components

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
