import React from "react";
import { useLogoutUserMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/authSlice";

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
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
