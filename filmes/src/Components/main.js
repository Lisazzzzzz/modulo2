import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useGetMoviesQuery } from "../services/movieApi";
import Card from "./card";
import FavoritesList from "./favoritos";
import LogoutButton from "./logout";
import botaolupa from "../images/headerimage/lupa.png";

const Main = () => {
  const categories = ["Popular", "Theatre", "Drama", "Comedie", "Favorites"]; // Adiciona "Favorites" às categorias
  const [showInput, setShowInput] = useState(false);
  const [movieType, setMovieType] = useState("Popular"); // Estado para controlar o tipo de exibição
  const [search, setSearch] = useState("");

  const { data, error, isLoading } = useGetMoviesQuery(
    movieType !== "Favorites" ? movieType : null
  );

  const handleButtonClick = (event) => {
    event.preventDefault();
    setShowInput(!showInput);
  };

  const handleSearch = (evt) => {
    if (evt.key === "Enter" && search.trim()) {
      setMovieType(search.trim());
    }
  };

  return (
    <>
      <GlobalStyle />
      <Header>
        <Nav>
          <ul>
            {categories.map((category) => (
              <li key={category}>
                <a
                  href="#"
                  onClick={() => setMovieType(category)} // Define o tipo de exibição ao clicar
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </Nav>
        <Form>
          <SearchButton showInput={showInput}>
            {showInput && (
              <InputText
                type="text"
                placeholder="Coloca o nome do filme"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                onKeyPress={handleSearch}
              />
            )}
            <button onClick={handleButtonClick}>
              <img src={botaolupa} alt="Botão com imagem" />
            </button>
          </SearchButton>
        </Form>
        <LogoutButton />
      </Header>

      {/* Renderiza a página conforme o tipo selecionado */}
      <Container>
        {movieType === "Favorites" ? (
          <FavoritesList /> // Renderiza os favoritos
        ) : (
          <>
            {isLoading && <p className="notfound">Loading...</p>}
            {error && <p className="notfound">Something went wrong!</p>}
            {data && data.results.length === 0 && (
              <p className="notfound">Not Found</p>
            )}
            {data &&
              data.results.map((movie, index) => (
                <Card info={movie} key={index} />
              ))}
          </>
        )}
      </Container>
    </>
  );
};

export default Main;

const GlobalStyle = createGlobalStyle`
  body {
    margin-top: 5rem;
    padding: 0;
    background-color: black;
    color: white;
    font-family: 'Poppins', sans-serif;
  }
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  background-color: rgb(169, 129, 10);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-around;
  height: 70px;
  align-items: center;

  @media (max-width: 900px) {
    height: 180px;
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    margin-left: -2rem;

    @media (max-width: 900px) {
      flex-direction: column;
    }

    li {
      list-style: none;
      margin-left: 2rem;

      @media (max-width: 900px) {
        padding-top: 10px;
        margin-right: 100px;
      }

      a {
        color: black;
        text-decoration: none;
        font-size: 16px;
        transition: color 0.3s;
        position: relative;

        &:before {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          height: 3px;
          width: 0;
          transform: translateX(-50%);
          background-color: #f0a500;
          transition: all 0.2s ease-in-out;
        }

        &:hover:before {
          width: 100%;
        }
      }
    }
  }
`;

const Form = styled.form`
  position: relative;
  margin-top: 1rem;
  display: flex;
  justify-content: right;
  margin-left: 20rem;
`;

const SearchButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-70%);

    img {
      width: 20px;
      height: 20px;
      display: block;
    }
  }

  input {
    position: absolute;
    left: -300px;
    opacity: ${({ showInput }) => (showInput ? "1" : "0")};
    visibility: ${({ showInput }) => (showInput ? "visible" : "hidden")};
    transition: all 0.3s ease;
    transform: translateY(-15%);
  }
`;

const InputText = styled.input`
  padding: 10px 40px 10px 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  outline: none;
  width: 250px;
  background-color: white;
  color: black;

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const Container = styled.div`
  margin: auto;
  width: 80%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .notfound {
    color: white;
  }
`;
