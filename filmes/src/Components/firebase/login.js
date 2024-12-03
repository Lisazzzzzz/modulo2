import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.conf";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login realizado com sucesso!");
      navigate("/main");
    } catch (err) {
      setError("Falha ao fazer login: " + err.message);
    }
  };

  return (
    <>
      <GlobalStyle /> 
      <Container>
        <ContainerLogin>
          <WrapLogin>
            <LoginForm onSubmit={handleSubmit}>
              <LoginFormTitle> Bem vindo </LoginFormTitle>

              <WrapInput>
                <Input
                  className={email !== "" ? "has-val" : ""}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FocusInput data-placeholder="Email"></FocusInput>
              </WrapInput>

              <WrapInput>
                <Input
                  className={password !== "" ? "has-val" : ""}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FocusInput data-placeholder="Password"></FocusInput>
              </WrapInput>

              {error && <ErrorText>{error}</ErrorText>}

              <ContainerLoginFormBtn>
                <LoginFormBtn type="submit"> Login </LoginFormBtn>
              </ContainerLoginFormBtn>

              <TextCenter>
                <Txt1> Ainda não tens conta? </Txt1>
                <Txt2 href="/register"> Criar conta </Txt2>
              </TextCenter>
            </LoginForm>
          </WrapLogin>
        </ContainerLogin>
      </Container>
    </>
  );
}

export default Login;



const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ContainerLogin = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding-top: 50px;
  margin-left: 200px;
`;

const WrapLogin = styled.div`
  width: 390px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  padding: 77px 55px 33px 55px;
  box-shadow: 0 5px 10px 0px rgb(169, 129, 10);
`;

const LoginForm = styled.form`
  width: 100%;
`;

const LoginFormTitle = styled.span`
  display: block;
  font-size: 30px;
  color: azure;
  line-height: 1.2;
  text-align: center;
  margin-bottom: 50px;
`;

const WrapInput = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 2px solid #adadad;
  margin-bottom: 50px;
`;

const Input = styled.input`
  font-size: 15px;
  color: white;
  line-height: 1.2;
  border: none;
  display: block;
  width: 100%;
  height: 45%;
  background-color: transparent;
  padding: 15px 5px;
  outline: none;
  &.has-val + span::after {
    top: -15px;
  }
  &.has-val + span::before {
    width: 100%;
  }
  &:focus + span::after {
    top: -20px;
  }
  &:focus + span::before {
    width: 100%;
  }
`;

const FocusInput = styled.span`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  color: #adadad;

  &::before {
    content: "";
    display: block;
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(to left, rgb(234, 205, 117), rgb(169, 129, 10));
    transition: all 0.4s;
  }

  &::after {
    font-size: 15px;
    color: #999999;
    line-height: 1.2;
    content: attr(data-placeholder);
    display: block;
    width: 100%;
    position: absolute;
    top: 16px;
    left: 0px;
    padding-left: 5px;
    transition: all 0.4s;
  }
`;

const ContainerLoginFormBtn = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 13px;
`;

const LoginFormBtn = styled.button`
  font-size: 15px;
  border: none;
  border-radius: 10px;
  color: white;
  line-height: 1.2;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background: linear-gradient(to left, rgb(234, 205, 117), rgb(169, 129, 10));
  &:hover {
    cursor: pointer;
  }
`;

const TextCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

const Txt1 = styled.span`
  font-size: 14px;
  color: #adadad;
  line-height: 1.5;
  padding-right: 5px;
  text-decoration: none;
`;

const Txt2 = styled.a`
  font-size: 14px;
  color: rgb(169, 129, 10);
  line-height: 1.5;
  text-decoration: none;
`;

const ErrorText = styled.p`
  font-size: 12px;
  color: rgb(169, 129, 10);
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(-50%);
  white-space: nowrap;
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