import React from "react";
import styled from "styled-components";


const StaticPage = () => {
  return (
    <PageContainer>
      <Title>About</Title>
      <Text>
      At Focus, discovering amazing movies is just the beginning! Check out ratings, dive into overviews, and pick your next watch. Think the movie deserves ten stars? Give it the shine it deserves! 
If it stuck with you, add it to your favorites and keep a special list of films that wowed you. This way, you can revisit them whenever nostalgia hits or share top picks with friends. At Focus, movies come to life, and you re part of the action!
      </Text>
      <Text2> 
      Have fun!
      </Text2>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  background-color: black;
  color: white;
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
  min-height: 100vh; /* Garante que cobre toda a altura da janela */
`;

const Title = styled.h1`
  color: rgb(169, 129, 10);
  font-size: 36px;
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 1.6;
  text-align: justify;
`;

const Text2 = styled.p`
  font-size: 90px;
  line-height: 1.6;
  text-align: center;
`;


export default StaticPage;
