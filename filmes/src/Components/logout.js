import React from "react";
import { useLogoutUserMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/authSlice";
import styled from "styled-components";


const LogoutButton = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser()); 
      alert("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <LogoutButtonStyled onClick={handleLogout}> Logout </LogoutButtonStyled>
  );
};

export default LogoutButton;

const LogoutButtonStyled = styled.button`
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 10px 20px;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    color: black;
  }

  &:active {
    transform: scale(0.98);
  }
`;