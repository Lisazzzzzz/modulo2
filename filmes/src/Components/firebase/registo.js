import React, { useState } from "react";
import styled from "styled-components";
import { auth } from './firebase.conf';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";




function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      e.target.classList.add("has-val");
    } else {
      e.target.classList.remove("has-val");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.username) validationErrors.username = "Obrigatório";
    if (!formData.email) validationErrors.email = "Obrigatório";
    if (!formData.password) validationErrors.password = "Obrigatório";
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Não coincide";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        console.log("Utilizador registrado:", userCredential.user);
        setSuccess(true);
        alert("Utilizador registrado com sucesso!");
        navigate("/login");
      } catch (error) {
        console.error("Erro ao registrar o utilizador:", error);
        setErrors({ firebase: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
    <GlobalStyle /> 
    <Container>
      <WrapLogin>
        <LoginForm onSubmit={handleSubmit}>
          <LoginFormTitle>Torna-te um focado</LoginFormTitle>

          <WrapInput>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder=" "
            />
            <FocusInput data-placeholder="Nome de Utilizador" />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
          </WrapInput>

          <WrapInput>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
            />
            <FocusInput data-placeholder="Email" />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </WrapInput>

          <WrapInput>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
            />
            <FocusInput data-placeholder="Password" />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </WrapInput>

          <WrapInput>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
            />
            <FocusInput data-placeholder="Confirmação de Password" />
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword}</ErrorText>
            )}
          </WrapInput>

          {errors.firebase && <ErrorText>Erro: {errors.firebase}</ErrorText>}

          <ContainerLoginFormBtn>
            <LoginFormBtn type="submit" disabled={loading}>
              {loading ? "Carregando..." : "Registar"}
            </LoginFormBtn>
          </ContainerLoginFormBtn>

          {success && <SuccessText>Registrado com sucesso!</SuccessText>}

          <TextCenter>
            <Txt1>Já tem conta?</Txt1>
            <Txt2 href="/login">Login</Txt2>
          </TextCenter>
        </LoginForm>
      </WrapLogin>
    </Container>
    </>
  );
}

export default RegisterForm;



const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  padding-bottom: 40px;
  margin-left: 200px;
  background-color: black;
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

  &:focus {
    outline: 0;
  }

  &.has-val + span::after {
    top: -15px;
  }

  &.has-val + span::before {
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
    transition: all 0.4s;
    background: linear-gradient(to left, rgb(234, 0, 117), rgb(169, 129, 10));
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

const ErrorText = styled.div`
  font-size: 12px;
  color: rgb(169, 129, 10);
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(-50%);
  white-space: nowrap;
`;

const SuccessText = styled.p`
  font-size: 14px;
  color: green;
  text-align: center;
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
`;

const Txt2 = styled.a`
  font-size: 14px;
  color: rgb(169, 129, 10);
  line-height: 1.5;
  text-decoration: none;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    background-color: black; 
`;

